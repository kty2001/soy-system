import os
import time
import math

import io
import cv2
import numpy as np
from PIL import Image
from pathlib import Path
import matplotlib.pyplot as plt
from scipy.signal import savgol_filter
from fastapi import Request, APIRouter, UploadFile, File, HTTPException

from app.models.schemas import AnalysisResponse, ErrorResponse
from app.utils.model_utils import get_save_path

router = APIRouter()

def rotate_image(gray_image):
    th1, th2 = 150, 180
    hough_th, hough_min, hough_max = 150, 50, 50

    blurred = cv2.GaussianBlur(gray_image, (5, 5), 1.5)
    edges = cv2.Canny(blurred, th1, th2, apertureSize=3)
    lines = cv2.HoughLinesP(edges, 1, np.pi/360, threshold=hough_th, minLineLength=hough_min, maxLineGap=hough_max)

    angles = []
    average_angle = 0
    if lines is not None:
        for x1, y1, x2, y2 in lines[:, 0]:
            angle_rad = math.atan2((y2 - y1), (x2 - x1))
            angle_deg = math.degrees(angle_rad)
            angles.append(angle_deg)
            print(f"Line: ({x1}, {y1}) to ({x2}, {y2}), Angle: {angle_deg:.2f} degrees")
            
        if angles:
            average_angle = np.mean(angles)
            print(f"Average angle: {average_angle:.2f} degrees")

    (h, w) = gray_image.shape[:2]
    center = (w // 2, h // 2)

    M = cv2.getRotationMatrix2D(center, average_angle, 1.0)
    rotated_img = cv2.warpAffine(gray_image, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    
    return average_angle, rotated_img

def find_edges_line(img, hor_threshold, ver_threshold):
    h, w = img.shape
    center_y, center_x = h // 2, w // 2
    results = {}

    # 상단에서 아래
    for y in range(center_y):
        if np.sum(img[y, :]) > hor_threshold:
            results['top'] = y
            break
    else: results['top'] = 0

    # 하단에서 위
    for y in range(h - 1, center_y, -1):
        if np.sum(img[y, :]) > hor_threshold:
            results['bottom'] = y
            break
    else: results['bottom'] = h - 1

    # 왼쪽에서 오른쪽
    for x in range(center_x):
        if np.sum(img[:, x]) > ver_threshold:
            results['left'] = x
            break
    else: results['left'] = 0

    # 오른쪽에서 왼쪽
    for x in range(w - 1, center_x, -1):
        if np.sum(img[:, x]) > ver_threshold:
            results['right'] = x
            break
    else: results['right'] = w - 1

    cropped_image = img[results['top']:results['bottom'], results['left']:results['right']]

    return results, cropped_image

def crop_zero2fifth(image, crop_lines=None, left_crop_ratio=0):
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    equalized = clahe.apply(image)
    rota_blur = cv2.blur(equalized, (5, 5), 1.5)
    crop_blur = rota_blur[crop_lines['top']:crop_lines['bottom'], crop_lines['left']:crop_lines['right']]
    
    left_crop_image = crop_blur[:, int(crop_blur.shape[1]*left_crop_ratio):]
    h, w = left_crop_image.shape 
    print("left_crop_ratio:", left_crop_ratio)
    print("left_crop_image shape:", left_crop_image.shape)

    pixel_data = left_crop_image[int(h*0.36), :].astype(np.int16)
    pixel_deriv = np.diff(pixel_data, n=1)
    std_threshold = np.std(pixel_deriv) * 2

    marks = []
    idx = 0
    previous_mark = 0
    while idx < len(pixel_deriv):
        if abs(pixel_deriv[idx]) > std_threshold:
            if pixel_deriv[previous_mark] <= 0 and pixel_deriv[idx] > 0:
                marks.append((previous_mark + idx) // 2 + 1)
                idx += 20
            previous_mark = idx
            idx += 1
        else:
            idx += 1

    all_marks = []
    for i in range(len(marks)-1):
        interv = (marks[i+1]-marks[i])//5
        all_marks.extend(list(range(marks[i], marks[i+1]-interv+1, interv)))
    all_marks.sort()
    all_marks.append(marks[-1])

    crop_image = left_crop_image[:, marks[0]:marks[-1]]

    print("marks:", marks)
    print("all_marks:", all_marks)
    for j in marks:
        cv2.line(left_crop_image, (j, 0), (j, left_crop_image.shape[0]), (0, 0, 0), 2)
    cv2.imshow("left cropped Image", left_crop_image)
    cv2.imshow("Cropped Image", crop_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    return all_marks, crop_image, (pixel_data, pixel_deriv, std_threshold, marks)

def analyze_image(image, pixel_values):
    y_raw = image[image.shape[0] // 2, :]
    x = np.arange(len(y_raw))

    wl = 31
    y_smooth = savgol_filter(y_raw, window_length=wl, polyorder=2)
    y_deriv = savgol_filter(y_raw, window_length=wl, polyorder=2, deriv=1)
    y_deriv_smooth = savgol_filter(y_deriv, window_length=wl, polyorder=2)

    min_index = np.argmin(y_deriv_smooth)
    min_value = y_deriv_smooth[min_index]
    min_value2 = min_value / 2
    min_value2_index = min_index
    while min_value2_index > 0:
        if y_deriv_smooth[min_value2_index] >= min_value2:
            break
        min_value2_index -= 1
    width = min_index - min_value2_index
    print("min_index:", min_index, "/ min_value:", min_value)
    print("min_value2_index:", min_value2_index, "/ min_value2:", min_value2)
    print("width:", width)

    fig, axs = plt.subplots(3, 1, figsize=(8, 8))

    axs[0].plot(x, y_smooth, color='red', label='Raw', linewidth=2)
    axs[0].axvline(x=min_index, color='green', linestyle='--', label='Threshold Line')
    axs[0].axvline(x=min_value2_index, color='blue', linestyle='--', label='Boundary Line')
    axs[0].axvline(x=min_index+width, color='blue', linestyle='--')
    axs[0].legend()
    axs[0].grid(True)
    axs[0].set_xlim(0, image.shape[1])

    ax1 = axs[1]
    ax1.plot(pixel_values[0], color='b', label='pixel_data')
    ax1.set_xlabel("Index")
    ax1.set_ylabel("Pixel data", color='b')
    ax1.tick_params(axis='y', labelcolor='b')
    ax1.grid(True)
    ax2 = ax1.twinx()
    ax2.plot(pixel_values[1], color='r', label='pixel_deriv')
    ax2.axhline(y=pixel_values[2], color='b', linestyle='--', linewidth=1, label='std thereshold')
    for mark in pixel_values[3]:
        ax2.axvline(x=mark, color='g', linestyle='--', linewidth=1, label='marks')
    ax2.set_ylabel("pixel_deriv", color='r')
    ax2.tick_params(axis='y', labelcolor='r')

    axs[2].plot(x, y_deriv_smooth, color='red', label='1st Deriv Smooth', linewidth=2)
    axs[2].axvline(x=min_index, color='green', linestyle='--', label='Threshold Line')
    axs[2].axvline(x=min_value2_index, color='blue', linestyle='--', label='Boundary Line')
    axs[2].axvline(x=min_index+width, color='blue', linestyle='--')
    axs[2].legend()
    axs[2].grid(True)
    axs[2].set_xlim(0, image.shape[1])

    plt.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format="png")
    buf.seek(0)
    img_pil = Image.open(buf).convert("RGB")
    img_np = np.array(img_pil)

    plt.close(fig)  # 메모리 누수 방지

    return img_np, width, min_index


@router.post("/process", response_model=AnalysisResponse, responses={400: {"model": ErrorResponse}})
async def process_image(request: Request, file: UploadFile = File(...)):
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
        average_angle, rotated_img = rotate_image(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))
        line_results, line_cropped_image = find_edges_line(rotated_img, 25000, 20000)
        print("line cropped image shape:", line_cropped_image.shape)
        
        left_crop_ratio = 0.12
        all_marks, mark_crop_image, pixel_values = crop_zero2fifth(rotated_img, line_results, left_crop_ratio=left_crop_ratio)
        left_cropped_image = line_cropped_image[:, int(line_cropped_image.shape[1]*left_crop_ratio):]
        analysis_image = left_cropped_image[:, all_marks[0]:all_marks[-1]]
        print("mark cropped image shape:", analysis_image.shape)

        analysis_graph, width, min_index = analyze_image(analysis_image, pixel_values)

        # 처리된 이미지를 PIL로 변환
        cropped_pil = Image.fromarray(analysis_image)
        output_pil = Image.fromarray(analysis_graph)
        
        # 출력 이미지 저장
        cropped_filename = get_save_path("results", "jpg")
        cropped_pil.save(cropped_filename)
        output_filename = get_save_path("results", "jpg")
        output_pil.save(output_filename)
        
        # 처리 시간 계산
        processing_time = time.time() - start_time
        
        # # 상대 URL 생성
        # input_url = f"/uploads/{os.path.basename(input_filename)}"
        # cropped_output_url = f"/results/{os.path.basename(cropped_filename)}"
        # output_url = f"/results/{os.path.basename(output_filename)}"

        # 절대 URL 생성
        base_url = str(request.base_url).rstrip("/")
        input_url = f"{base_url}/uploads/{os.path.basename(input_filename)}"
        cropped_output_url = f"{base_url}/results/{os.path.basename(cropped_filename)}"
        output_url = f"{base_url}/results/{os.path.basename(output_filename)}"

        return AnalysisResponse(
            input_width=input_w,
            input_height=input_h,
            output_width=mark_crop_image.shape[1],
            output_height=mark_crop_image.shape[0],
            input_metric=1,
            output_metric=1,
            average_angle=average_angle,
            min_index=min_index,
            width=width,
            input_image_url=input_url,
            cropped_image_url=cropped_output_url,
            output_image_url=output_url,
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"이미지 처리 중 오류가 발생했습니다: {str(e)}")