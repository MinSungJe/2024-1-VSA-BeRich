# Python 3.9 이미지 사용
FROM python:3.12-slim

# 작업 디렉토리 설정
WORKDIR /app

# 현재 디렉토리의 모든 파일을 컨테이너의 /app 디렉토리로 복사
COPY . /app

# 종속성 설치
RUN pip install --no-cache-dir -r requirements.txt

# 서버 실행
CMD ["python", "app.py"]
