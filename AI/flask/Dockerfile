# 베이스 이미지 선택
FROM python:3.12.5

# 작업 디렉토리 설정
WORKDIR /app

# 프로젝트 파일 복사
COPY . /app

# 필요한 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# Flask 환경 변수 설정
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# 포트 노출
EXPOSE 8083

# Flask 서버 실행
CMD ["flask", "run", "--host=0.0.0.0"]