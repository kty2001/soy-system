# THz AI Processing API

테라헤르츠(THz) 이미지 및 신호 처리를 위한 FastAPI 기반 백엔드 서버입니다.

## 기능

- 이미지 디블러링 (Image Deblurring)
- 이미지 디노이징 (Image Denoising)
- 신호 디노이징 (Signal Denoising)

## 설치 및 실행

### 필요 조건

- Python 3.8 이상
- pip 또는 poetry

### 설치

```bash
# 가상 환경 생성 (선택 사항)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 또는
venv\Scripts\activate  # Windows

# 패키지 설치
pip install -r requirements.txt
```

### 모델 파일 준비

ONNX 모델 파일을 `models` 디렉토리에 복사합니다:

- `models/model_deblur.onnx`: 이미지 디블러링 모델
- `models/image.onnx`: 이미지 디노이징 모델
- `models/signal.onnx`: 신호 디노이징 모델

### 실행

```bash
python run.py
```

서버는 기본적으로 `http://localhost:8000`에서 실행됩니다.

## API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API 엔드포인트

### 이미지 디블러링

- `POST /api/deblur/process`: 이미지 디블러링 처리

### 이미지 디노이징

- `POST /api/denoise/process`: 이미지 디노이징 처리

### 신호 디노이징

- `POST /api/signal/process`: 신호 디노이징 처리
- `GET /api/signal/sample`: 샘플 신호 처리

## 사용 예시

### cURL을 사용한 이미지 디블러링 요청

```bash
curl -X 'POST' \
  'http://localhost:8000/api/deblur/process' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@image.png'
```

### Python 요청 예시

```python
import requests

url = "http://localhost:8000/api/deblur/process"
files = {"file": open("image.png", "rb")}
response = requests.post(url, files=files)
print(response.json())
``` 

###
두유 이미지 데이터
```bash
images/
  ├── 7.0/
    ├── 1/
      ├── 7.0_1_1.jpg
      ├── 7.0_1_2.jpg
      ├── .....
      ├── 7.0_1_19.jpg
      └── 7.0_1_20.jpg
    ├── 2/
    ├── 3/
    ├── 4/
    └── 5/  
  ├── 7.5/
  ├── 8.0/
  ├── 8.5/
  └── 9.0/
```