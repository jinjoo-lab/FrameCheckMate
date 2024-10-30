import cv2
from ultralytics import YOLO
from datetime import datetime

# # YOLOv8 모델 로드 -> 칼 탐지
# model = YOLO('yolov8m.pt')

# 학습된 모델 불러오기 -> 담배 탐지
model = YOLO('runs/detect/train/weights/best.pt')

# 비디오 파일 열기
video_path = 'C:\\Users\\SSAFY\\Desktop\\video2.mp4'
cap = cv2.VideoCapture(video_path)

# FPS와 총 프레임 수 가져오기
fps = cap.get(cv2.CAP_PROP_FPS)

# 1초에 한 프레임만 처리하기 위한 프레임 간격 계산
frame_interval = int(fps)

# 현재 시간을 이용하여 파일 이름 생성
current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
output_file_path = f"runs/detection_times/{current_time}.txt"

# 파일 경로가 제대로 생성되는지 확인하기 위해 출력
print(f"Output file path: {output_file_path}")

# 결과 저장할 파일 열기
output_file = open(f"runs/detection_times/{current_time}.txt", "w")

frame_index = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # 1초마다 한 프레임을 처리하도록 설정
    if frame_index % frame_interval == 0:
        # 현재 프레임의 시간 (초 단위)
        frame_time = frame_index / fps

        # YOLOv8을 사용하여 객체 탐지 수행
        results = model.predict(source=frame, save=False, save_txt=False, verbose=False)

        # 탐지된 객체가 있을 경우 시간만 저장
        for result in results:
            if result.boxes:  # 탐지된 객체가 있으면
                output_file.write(f"Time: {frame_time:.2f}s\n")
                break  # 객체가 탐지되면 해당 프레임에서 시간 정보만 한 번 기록

    frame_index += 1

cap.release()
output_file.close()
