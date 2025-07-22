import time
import os
import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
from pathlib import Path
import io

from app.models.schemas import ImageResponse, ErrorResponse
from app.utils.model_utils import ImageProcessor, get_model_path, get_save_path

router = APIRouter()

# 모델 경로 설정
MODEL_PATH = get_model_path("model_deblur.onnx")

# 이미지 프로세서 초기화
image_processor = ImageProcessor(MODEL_PATH)


@router.post("/process", response_model=ImageResponse, responses={400: {"model": ErrorResponse}})
async def process_image(file: UploadFile = File(...)):
    """
    이미지 디블러링 처리 API
    
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
        image = Image.open(io.BytesIO(contents)).convert("L")
        input_w, input_h = image.size
        
        # 입력 이미지 저장
        input_filename = get_save_path("uploads", "png")
        image.save(input_filename)
        
        # 이미지 전처리
        numpy_image = np.array(image).astype(np.float32)
        input_sharpness = image_processor.calculate_sharpness(numpy_image)
        
        # 모델 입력 형식으로 변환
        numpy_image = numpy_image / 255.0
        numpy_image = numpy_image[None, None, :, :]
        
        # 모델 추론
        result = image_processor.model.predict(numpy_image)
        
        # 결과 후처리
        result = numpy_image + result
        result = np.clip(result, 0, 1)
        result = result * 255.0
        output_image = result.astype(np.uint8)
        output_image = np.squeeze(output_image, axis=0)
        output_image = np.squeeze(output_image, axis=0)
        
        # 출력 이미지 선명도 계산
        output_sharpness = image_processor.calculate_sharpness(output_image)
        
        # 출력 이미지를 원본 크기로 조정
        output_pil = Image.fromarray(output_image)
        output_pil = output_pil.resize((input_w, input_h))
        output_image = np.array(output_pil)
        
        # 출력 이미지 저장
        output_filename = get_save_path("results", "png")
        image_processor.save_image(output_image, output_filename)
        
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
            input_metric=input_sharpness,
            output_metric=output_sharpness,
            input_image_url=input_url,
            output_image_url=output_url,
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"이미지 처리 중 오류가 발생했습니다: {str(e)}") 