from flask import Flask, jsonify
import cv2
from ultralytics import YOLO
from datetime import datetime

app = Flask(__name__)

@app.route('/predict')
def home():
    # 학습된 모델 불러오기 -> 담배 탐지
    model = YOLO('./best.pt')

    # TODO : 비디오 파일 경로 server내부로 재설정 해서 불러오기
    video_path = 'C:\\Users\\SSAFY\\Desktop\\test_video.mp4'
    cap = cv2.VideoCapture(video_path)

    # FPS 가져오기
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps)

    detection_times = []
    frame_index = 0
    last_time = None
    current_range = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_index % frame_interval == 0:
            frame_time = int(frame_index / fps)
            results = model.predict(source=frame, save=False, save_txt=False, verbose=False)

            for result in results:
                if result.boxes:
                    if last_time is None:
                        current_range = [frame_time, frame_time]
                    elif frame_time == last_time + 1:
                        current_range[1] = frame_time
                    else:
                        detection_times.append(current_range)
                        current_range = [frame_time, frame_time]
                    last_time = frame_time
                    break

        frame_index += 1
 
    if current_range:
        detection_times.append(current_range)

    cap.release()

    # 2중 리스트 데이터를 JSON 형식으로 반환
    return jsonify(detection_times)

if __name__ == '__main__':
    app.run(debug=True)