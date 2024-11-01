from ultralytics import YOLO

# YOLOv8m 모델 로드
model = YOLO('yolov8m.pt')

# 클래스 이름 및 개수 확인
class_names = model.names  # 모델에 학습된 클래스 이름 딕셔너리
num_classes = len(class_names)  # 클래스 수

print(f"Class count: {num_classes}")
print("Class names:", class_names)
