echo "=== 1. Python 빌드 실행 ==="
python build_exe.py

echo "=== 2. 기존 서버 폴더 정리 ==="
rm ../soy-frontend/server/*

echo "=== 3. 빌드 결과 복사 ==="
cp dist/soy_AI_Analysys/* ../soy-frontend/server/

echo "=== 빌드 및 복사 완료 ==="