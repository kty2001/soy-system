import os
import glob
import argparse

import pandas as pd
import numpy as np
from PIL import Image
import cv2

import torch
from torch import nn
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from sklearn.model_selection import train_test_split
from ultralytics import YOLO

yolo = YOLO("yolo_run/obb/7best.pt")

class ConcentrationDataset(Dataset):
    def __init__(self, data_df, transform=None):
        self.data = np.array(data_df.values.tolist())[:, :2]
        self.transform = transform

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        img_path = self.data[idx, 0]
        label = self.data[idx, 1]

        image = Image.open(os.path.join("images", label, "5", img_path)).convert("RGB")
        image = np.array(image)

        results = yolo.predict(source=image, save=False, save_txt=False)
        obb_data = results[0].obb.xywhr
            
        x, y, h, w, r = obb_data[0]
        center = (int(x), int(y))

        rotation_matrix = cv2.getRotationMatrix2D(center, -r.item(), 1.0)
        rotated_image = cv2.warpAffine(image, rotation_matrix, (image.shape[1], image.shape[0]))

        x_start = max(0, int(x - (w / 2)))
        x_end = min(image.shape[1], int(x + (w / 2)))
        y_start = max(0, int(y - (h / 2)))
        y_end = min(image.shape[0], int(y + (h / 2)))
        cropped_image = rotated_image[y_start:y_end, x_start:x_end]

        if self.transform:
            cropped_image = self.transform(Image.fromarray(cropped_image))

        return cropped_image, torch.tensor(float(label), dtype=torch.float32)
    

class ResNetRegression(nn.Module):
    def __init__(self):
        super(ResNetRegression, self).__init__()
        self.model = models.resnet50(pretrained=True)
        num_ftrs = self.model.fc.in_features
        self.model.fc = nn.Linear(num_ftrs, 1)

    def forward(self, x):
        return self.model(x)


def pred():
    model = ResNetRegression().to('cuda')
    model.load_state_dict(torch.load("7yolo_res50_best.pth"))
    model.eval()

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                             std=[0.229, 0.224, 0.225])
    ])

    image = Image.open("yolo_run/obb_test.jpg").convert("RGB")

    np_image = np.array(image)

    results = yolo.predict(source=np_image, save=False, save_txt=False)
    obb_data = results[0].obb.xywhr
    
    print(*obb_data[0])
    x, y, w, h, r = obb_data[0]
    if w < h: w, h = h, w
    center = (int(x), int(y))

    rotation_matrix = cv2.getRotationMatrix2D(center, -r.item(), 1.0)
    rotated_image = cv2.warpAffine(np_image, rotation_matrix, (np_image.shape[1], np_image.shape[0]))

    x_start = max(0, int(x - (w / 2)))
    x_end = min(np_image.shape[1], int(x + (w / 2)))
    y_start = max(0, int(y - (h / 2)))
    y_end = min(np_image.shape[0], int(y + (h / 2)))
    cropped_image = rotated_image[y_start:y_end, x_start:x_end]

    transform_image = transform(Image.fromarray(cropped_image))

    with torch.no_grad():
        outputs = model(transform_image.unsqueeze(0).to('cuda'))
    print("predict:", outputs)

    cv2.imshow("original image", np.array(image))
    cv2.imshow("ratated image", np.array(rotated_image))
    cv2.imshow("cropped image", np.array(cropped_image))
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def main():
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                            std=[0.229, 0.224, 0.225])
    ])
    
    full_df = pd.read_csv("images/data.csv")
    train_df, val_df = train_test_split(full_df, test_size=0.2, random_state=42, stratify=full_df['label_name'])

    train_dataset = ConcentrationDataset(train_df, transform=transform)
    val_dataset = ConcentrationDataset(val_df, transform=transform)

    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=16)

    model = ResNetRegression().to('cuda')
    loss_fn = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

    num_epochs = 50
    for epoch in range(num_epochs):
        model.train()
        train_loss = 0
        for images, labels in train_loader:
            images, labels = images.to('cuda'), labels.to('cuda').unsqueeze(1)
            outputs = model(images)
            loss = loss_fn(outputs, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            train_loss += loss.item() * images.size(0)

        model.eval()
        val_loss = 0
        best_val_loss = float('inf')
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to('cuda'), labels.to('cuda').unsqueeze(1)
                outputs = model(images)
                loss = loss_fn(outputs, labels)
                val_loss += loss.item() * images.size(0)

        print(f"Epoch {epoch+1}/{num_epochs}, Train Loss: {train_loss/len(train_loader.dataset):.4f}, Val Loss: {val_loss/len(val_loader.dataset):.4f}")
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), "7yolo_res50_best.pth")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", type=str, default="train", choices=["train", "pred"], help="Mode: train or pred")
    args = parser.parse_args()

    if args.mode == "train":
        main()
    elif args.mode == "pred":
        pred()