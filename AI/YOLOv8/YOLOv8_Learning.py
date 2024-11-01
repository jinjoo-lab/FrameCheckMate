# YOLOv8 학습 시키는 파일

from ultralytics import YOLO

# 기존 YOLOv8m 모델 로드 (칼 탐지 포함)
model = YOLO('yolov8m.pt')  # 기존에 칼이 학습된 모델

# 모델 학습 -> 학습된 모델은 'runs/detect/train/weights/best.pt'에 저장됨
model.train(
    data='cigarette.yaml',   # 데이터셋 구성 파일 경로
    epochs=50,               # 학습 반복 횟수
    imgsz=640,               # 입력 이미지 크기
    batch=16                 # 배치 크기 (필요에 따라 조정 가능)
)