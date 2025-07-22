# THz AI 처리 시스템 프론트엔드

테라헤르츠(THz) 이미지 및 신호 처리를 위한 React 기반 프론트엔드 애플리케이션입니다.

## 기능

- 이미지 디블러링 (Image Deblurring)
- 이미지 디노이징 (Image Denoising)
- 신호 디노이징 (Signal Denoising)

## 설치 및 실행

```bash
pyinstaller THz_AI_System.spec
```
python build 시 상대경로로 전부 바꿔야함

```bash

```

"build:api": "cd ../thz-api && .venv/Scripts/activate.ps1 && pip install pyinstaller fastapi uvicorn python-multipart && python -m PyInstaller --onefile --name THz_AI_System run.py"

"build:api": "cd ../thz-api && powershell -Command \"./venv/Scripts/activate.ps1; pyinstaller --onefile --name THz_AI_System run.py\"",