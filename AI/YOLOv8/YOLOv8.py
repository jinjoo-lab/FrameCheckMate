from ultralytics import YOLO

# YOLOv8 모델 로드 (YOLOv8n, YOLOv8s, YOLOv8m, YOLOv8l, YOLOv8x 중 선택 가능)
model = YOLO('yolov8m.pt')

# 모델 학습
model.train(
    data='cigarette.yaml',   # 데이터셋 구성 파일 경로
    epochs=50,               # 학습 반복 횟수
    imgsz=640,               # 입력 이미지 크기
    batch=16                 # 배치 크기 (필요에 따라 조정 가능)
)

# 이미지 또는 비디오에서 객체 탐지 수행
results = model.predict(source='C:\\Users\\SSAFY\\Desktop\\video.mp4', show=False, vid_stride=25)