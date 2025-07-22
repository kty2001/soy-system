import time
import os
import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from pathlib import Path
import io

from app.models.schemas import SignalResponse, ErrorResponse
from app.utils.model_utils import SignalProcessor, get_model_path, get_save_path

router = APIRouter()

# 모델 경로 설정
MODEL_PATH = get_model_path("signal.onnx")

# 신호 프로세서 초기화
signal_processor = SignalProcessor(MODEL_PATH)


@router.post("/process", response_model=SignalResponse, responses={400: {"model": ErrorResponse}})
async def process_signal(file: UploadFile = File(...)):
    """
    신호 디노이징 처리 API
    
    - **file**: 처리할 CSV 파일
    
    반환값:
    - 처리된 신호 정보 및 URL
    """
    start_time = time.time()
    
    try:
        # 파일 확장자 확인
        if not file.filename.lower().endswith('.csv'):
            raise HTTPException(status_code=400, detail="지원되지 않는 파일 형식입니다. CSV 파일만 허용됩니다.")
        
        # 파일 읽기
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents), header=None)
        
        # 신호 데이터 추출
        signal_data = df.iloc[:, 0].values.astype(np.float32)
        input_length = len(signal_data)
        
        # 입력 신호 SNR 계산
        input_snr = signal_processor.calculate_snr(signal_data)
        
        # 모델 입력 형식으로 변환 - 2차원으로 변경
        signal_data = signal_data.reshape(1, -1)  # (1, length) 형태로 변경
        
        # 모델 추론
        result = signal_processor.model.predict(signal_data)
        
        # 결과 후처리
        output_signal = result.reshape(-1)
        output_length = len(output_signal)
        
        # 출력 신호 SNR 계산
        output_snr = signal_processor.calculate_snr(output_signal)
        
        # 결과 저장
        # 1. CSV 파일로 저장
        csv_filename = get_save_path("results", "csv")
        pd.DataFrame(output_signal).to_csv(csv_filename, index=False, header=False)
        
        # 2. 시각화 이미지 저장
        plot_filename = get_save_path("results", "png")
        signal_processor.save_signal_plot(signal_data.reshape(-1), output_signal, plot_filename)
        
        # 처리 시간 계산
        processing_time = time.time() - start_time
        
        # 상대 URL 생성
        csv_url = f"/results/{os.path.basename(csv_filename)}"
        plot_url = f"/results/{os.path.basename(plot_filename)}"
        
        return SignalResponse(
            input_length=input_length,
            output_length=output_length,
            input_snr=input_snr,
            output_snr=output_snr,
            plot_url=plot_url,
            csv_url=csv_url,
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"신호 처리 중 오류가 발생했습니다: {str(e)}")


@router.get("/sample", response_model=SignalResponse, responses={400: {"model": ErrorResponse}})
async def get_sample():
    """
    샘플 신호 처리 API
    
    샘플 신호를 처리하고 결과를 반환합니다.
    
    반환값:
    - 처리된 신호 정보 및 URL
    """
    start_time = time.time()
    
    try:
        # 샘플 신호 생성 (노이즈가 있는 사인파)
        x = np.linspace(0, 10, 1000)
        signal_data = np.sin(x) + 0.2 * np.random.randn(1000)
        signal_data = signal_data.astype(np.float32)
        input_length = len(signal_data)
        
        # 입력 신호 SNR 계산
        input_snr = signal_processor.calculate_snr(signal_data)
        
        # 모델 입력 형식으로 변환 - 2차원으로 변경
        signal_data_reshaped = signal_data.reshape(1, -1)  # (1, length) 형태로 변경
        
        # 모델 추론
        result = signal_processor.model.predict(signal_data_reshaped)
        
        # 결과 후처리
        output_signal = result.reshape(-1)
        output_length = len(output_signal)
        
        # 출력 신호 SNR 계산
        output_snr = signal_processor.calculate_snr(output_signal)
        
        # 결과 저장
        # 1. CSV 파일로 저장
        csv_filename = get_save_path("results", "csv")
        pd.DataFrame(output_signal).to_csv(csv_filename, index=False, header=False)
        
        # 2. 시각화 이미지 저장
        plot_filename = get_save_path("results", "png")
        signal_processor.save_signal_plot(signal_data, output_signal, plot_filename)
        
        # 처리 시간 계산
        processing_time = time.time() - start_time
        
        # 상대 URL 생성
        csv_url = f"/results/{os.path.basename(csv_filename)}"
        plot_url = f"/results/{os.path.basename(plot_filename)}"
        
        return SignalResponse(
            input_length=input_length,
            output_length=output_length,
            input_snr=input_snr,
            output_snr=output_snr,
            plot_url=plot_url,
            csv_url=csv_url,
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"샘플 신호 처리 중 오류가 발생했습니다: {str(e)}") 