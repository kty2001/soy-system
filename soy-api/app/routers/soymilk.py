import time
import os
import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import cv2
from pathlib import Path
import io

from app.models.schemas import ImageResponse, ErrorResponse
from app.utils.model_utils import get_save_path

router = APIRouter()


@router.post("/process", response_model=ImageResponse, responses={400: {"model": ErrorResponse}})
async def process_image(file: UploadFile = File(...)):
    """
    이미지 처리 API (딥러닝 모델 제거, OpenCV 기반 처리)
    
    - **file**: 처리할 이미지 파일 (PNG, JPG, BMP 등)
    
    반환값:
    - 처리된 이미지 정보 및 URL
    """
    start_time = time.time()
    
    try:
        # 파일 확장자 확인
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp')):
            raise HTTPException(status_code=400, detail="지원되지 않는 파일 형식입니다. PNG, JPG, JPEG, BMP 파일만 허용됩니다.")
        
        # 파일 읽기
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")  # RGB로 변환
        input_w, input_h = image.size
        
        # 입력 이미지 저장
        input_filename = get_save_path("uploads", "jpg")
        image.save(input_filename)
        
        # OpenCV로 이미지 읽기
        img = cv2.imread(input_filename)
        img = img[:, :, ::-1]  # BGR -> RGB 변환
        
        # R, G, B 채널 분리
        red_channel = img[:, :, 0]
        green_channel = img[:, :, 1]
        blue_channel = img[:, :, 2]
        
        # 조건에 따라 픽셀 변경
        red_threshold = 125
        green_threshold = 200
        blue_threshold = 100
        condition = (blue_channel >= blue_threshold) & (red_channel <= red_threshold) & (green_channel <= green_threshold)
        pixel_positions = np.where(condition)
        img[pixel_positions[0], pixel_positions[1]] = [0, 0, 0]  # 해당 픽셀을 검정색으로 변경
        
        # 처리된 이미지를 PIL로 변환
        output_pil = Image.fromarray(img)
        
        # 출력 이미지 저장
        output_filename = get_save_path("results", "jpg")
        output_pil.save(output_filename)
        
        # 처리 시간 계산
        processing_time = time.time() - start_time
        
        # 상대 URL 생성
        input_url = f"/uploads/{os.path.basename(input_filename)}"
        output_url = f"/results/{os.path.basename(output_filename)}"
        
        return ImageResponse(
            input_width=input_w,
            input_height=input_h,
            output_width=input_w,
            output_height=input_h,
            input_metric=1,
            output_metric=1,
            input_image_url=input_url,
            output_image_url=output_url,
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"이미지 처리 중 오류가 발생했습니다: {str(e)}")