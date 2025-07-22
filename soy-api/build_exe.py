import os
import shutil
from pathlib import Path
import time

# 현재 디렉토리
current_dir = Path(__file__).parent
project_dir = current_dir.parent

# 프론트엔드 빌드 디렉토리
frontend_build_dir = project_dir / "soy-frontend" / "build"

# 모델 디렉토리
models_dir = current_dir / "models"

# 빌드 디렉토리 생성
build_dir = current_dir / "build"
dist_dir = current_dir / "dist"

# 안전하게 디렉토리 삭제 시도
try:
    if build_dir.exists():
        shutil.rmtree(build_dir)
    if dist_dir.exists():
        shutil.rmtree(dist_dir)
except Exception as e:
    print(f"경고: 디렉토리 삭제 중 오류 발생: {e}")
    print("빌드를 계속 진행합니다...")
    time.sleep(2)

# 프론트엔드 빌드 확인
if not frontend_build_dir.exists():
    print("프론트엔드 빌드 디렉토리를 찾을 수 없습니다.")
    print("먼저 'cd soy-frontend && npm run build' 명령을 실행하세요.")
    exit(1)

# 모델 파일 확인
required_models = ["model_deblur.onnx", "image.onnx", "signal.onnx"]
for model in required_models:
    if not (models_dir / model).exists():
        print(f"모델 파일 {model}을 찾을 수 없습니다.")
        exit(1)

# 경로를 raw 문자열로 변환
current_dir_str = str(current_dir).replace("\\", "\\\\")
models_dir_str = str(models_dir).replace("\\", "\\\\")
frontend_build_dir_str = str(frontend_build_dir).replace("\\", "\\\\")

# 런처 스크립트 생성 (Electron에서 사용하기 위한 서버 전용 모드)
launcher_script = """
import os
import sys
import uvicorn
from pathlib import Path
from app.main import app

if __name__ == "__main__":
    # 실행 파일 경로 기준으로 작업 디렉토리 설정
    if getattr(sys, 'frozen', False):
        # PyInstaller로 패키징된 경우
        base_dir = Path(sys._MEIPASS)
        os.chdir(base_dir)
    
    # 결과 및 업로드 디렉토리 생성
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("results", exist_ok=True)
    
    # 로깅 설정 - 콘솔 출력 비활성화
    log_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "()": "uvicorn.logging.DefaultFormatter",
                "fmt": "%(levelprefix)s %(message)s",
                "use_colors": False,
            },
        },
        "handlers": {
            "default": {
                "formatter": "default",
                "class": "logging.NullHandler",
            },
        },
        "loggers": {
            "uvicorn": {"handlers": ["default"], "level": "INFO"},
        },
    }
    
    # FastAPI 서버 시작 - 로깅 설정 추가
    uvicorn.run(app, host="127.0.0.1", port=8000, log_config=log_config)
"""

# 런처 스크립트 저장 - UTF-8 인코딩 명시
launcher_file = current_dir / "launcher.py"
with open(launcher_file, "w", encoding="utf-8") as f:
    f.write(launcher_script)

# PyInstaller 스펙 파일 생성
spec_content = f"""
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['launcher.py'],
    pathex=[r'{current_dir_str}'],
    binaries=[],
    datas=[
        (r'{models_dir_str}', 'models'),
        (r'{frontend_build_dir_str}', 'soy-frontend/build'),
    ],
    hiddenimports=[
        'uvicorn.logging',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        'app.routers.deblur',
        'app.routers.denoise',
        'app.routers.signal',
        'http.server',
    ],
    hookspath=[],
    hooksconfig={{}},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='soy_AI_System',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,  # 콘솔 창 숨기기
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='soy_AI_System',
)
"""

# 스펙 파일 저장 - UTF-8 인코딩 명시
spec_file = current_dir / "soy_AI_System.spec"
with open(spec_file, "w", encoding="utf-8") as f:
    f.write(spec_content)

print("PyInstaller 스펙 파일이 생성되었습니다.")
print("다음 명령을 실행하여 EXE 파일을 생성하세요:")
print(f"cd {current_dir} && pyinstaller soy_AI_System.spec")

# 자동으로 PyInstaller 실행
print("PyInstaller 실행 중...")
os.chdir(current_dir)
os.system("pyinstaller soy_AI_System.spec")

print("\n빌드가 완료되었습니다.")
print(f"실행 파일 위치: {dist_dir / 'soy_AI_System' / 'soy_AI_System.exe'}") 