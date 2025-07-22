import time
import os
from pathlib import Path
import io

import cv2
from PIL import Image
import numpy as np
from ultralytics import YOLO
import torch
from torch import nn
from torchvision import models
from torchvision import transforms

from starlette.responses import StreamingResponse
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.models.schemas import ImageResponse, ErrorResponse
from app.utils.model_utils import get_model_path, get_save_path

router = APIRouter()

yolo_weight_path = get_model_path("6best.pt")
yolo = YOLO(yolo_weight_path)

class ResNetRegression(nn.Module):
    def __init__(self):
        super(ResNetRegression, self).__init__()
        self.model = models.resnet50(pretrained=True)
        num_ftrs = self.model.fc.in_features
        self.model.fc = nn.Linear(num_ftrs, 1)

    def forward(self, x):
        return self.model(x)
    
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                            std=[0.229, 0.224, 0.225])
])
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
resnet_weight_path = get_model_path("7yolo_res50_best.pth")
resnet = ResNetRegression().to(device)
resnet.load_state_dict(torch.load(resnet_weight_path, map_location=device))


@router.get('/process')
async def video_feed():
    return StreamingResponse(generate_frames(),
                             media_type='multipart/x-mixed-replace; boundary=frame')


def generate_frames():
    resnet.eval()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("웹캠을 열 수 없습니다.")
        return

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920) 
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

    while True:
        cv2.waitKey(1000)
        success, frame = cap.read()
        if not success:
            break

        results = yolo.predict(source=frame, save=False, save_txt=False)
        obb_data = results[0].obb.xywhr

        if len(obb_data) == 0:
            yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        
        print(obb_data[0])
        x, y, w, h, r = obb_data[0]
        if w < h: w, h = h, w
        center = (int(x), int(y))

        rotation_matrix = cv2.getRotationMatrix2D(center, -r.item(), 1.0)
        rotated_frame = cv2.warpAffine(frame, rotation_matrix, (frame.shape[1], frame.shape[0]))

        x_start = max(0, int(x - (w / 2)))
        x_end = min(frame.shape[1], int(x + (w / 2)))
        y_start = max(0, int(y - (h / 2)))
        y_end = min(frame.shape[0], int(y + (h / 2)))
        cropped_object = rotated_frame[y_start:y_end, x_start:x_end]

        transform_image = transform(Image.fromarray(cropped_object))

        with torch.no_grad():
            outputs = resnet(transform_image.unsqueeze(0).to(device))
        print("predict:", outputs)

        cv2.putText(
            cropped_object,
            f"pred: {outputs.item():.2f}",
            (10, 30),  # 좌상단 위치
            cv2.FONT_HERSHEY_SIMPLEX,
            1.0,       # 폰트 크기
            (0, 255, 0),  # 글자 색상 (초록)
            2,         # 두께
            cv2.LINE_AA
        )
        success, buffer = cv2.imencode('.jpg', cropped_object)
        if success:
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        