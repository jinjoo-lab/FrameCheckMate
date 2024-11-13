# 베이스 이미지 선택
FROM python:3.12.5

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx  # OpenCV에 필요한 라이브러리 설치

# 프로젝트 파일 복사
COPY . /app

# 필요한 Python 패키지 설치
RUN pip install --no-cache-dir Flask==3.0.3 Flask-Cors==5.0.0 Werkzeug==3.0.4 \
    itsdangerous==2.2.0 Jinja2==3.1.4 MarkupSafe==2.1.5 \
    opencv-python-headless==4.10.0.84 ultralytics==8.2.86 \
    py_eureka_client==0.11.13

# Flask 환경 변수 설정
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# 포트 노출
EXPOSE 8083

# Flask 서버 실행
CMD ["flask", "run", "--host=0.0.0.0", "--port=8083"]
