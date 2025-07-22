# THz AI Processing System

### 추론 서버

```bash
cd thz-api
python run.py
```

```bash
INFO:     Will watch for changes in these directories: ['C:\\Users\\unerue\\Projects\\thz-viewer\\thz-api']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [49012] using StatReload
INFO:     Started server process [30536]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 프론트엔드 서버 실행

```bash
cd thz-frontend
npm run start
```

```bash
Compiled successfully!

You can now view thz-frontend in the browser.

  Local:            http://localhost:9879
  On Your Network:  http://192.168.0.14:9879

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

### 일렉트론

```bash
npm run electron
```

- [X] src/model_deblur.onnx (test-01.png)
- [X] src/image.onnx (test-02.png), [1, 1, 256, 256] scale to 0-1
- [X] src/signal.onnx (src/signal_22847.csv)
- [x] 입력 및 추론된 이미지 크기 유동적으로 보여주기
- [x] 저장 버튼 만들기(png, csv): csv는 pandas df.to_csv("파일명", index=False, header=None)

## 뭐지?

* 사이드바 메뉴 하나 추가 이미지랑 시그널 사이에 추가
* 이미지 처리하는거 똑같이 복사해서 src/image.onnx 적용
* 시그널 인풋 들어가는거 이미지에서 드래그앤드롭하는거랑 똑같이 해서 csv 파일 넘겨 받기


---
### 추가 작성 내용 by 김태윤

#### requirements.txt
```bash
# 기존 fastapi & uvicorn 버전
fastapi==0.104.1
uvicorn==0.24.0

# 업데이트 버전
fastapi==0.115.11
uvicorn==0.34.0
```

#### run.py
```bash
uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
# reload=True로 인하여 서버 킨 상태로 수정해도 즉시 적용됨
# fastapi 성능 저하의 요소가 될 수 있으므로 배포시 False 사용
```

#### 작동 원리: 개발 환경(run.py) 기준
```bash
# 백엔드 서버 실행
python run.py
```
```python
# uvicorn.run을 통해 app 디렉토리의 main.py 실행
uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

# router 추가하여 모델과 연결
app.include_router(deblur.router, prefix="/api/deblur", tags=["Image Deblurring"])

# model_utils.py에 모델 추론, 이미지 처리, 신호 처리 클래스 구현

# router 디렉토리의 파일에서 해당 task 동작 및 후처리 진행
```