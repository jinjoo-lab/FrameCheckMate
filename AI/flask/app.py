from flask import Flask, jsonify, request
from flask_cors import CORS
import cv2
from ultralytics import YOLO
from datetime import datetime
from py_eureka_client import eureka_client
import server_config as server

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"]}})

eureka_client.init(eureka_server=server.EUREKA_SERVER,
                   app_name=server.SERVICE_NAME,
                   instance_host=server.SERVICE_HOST,
                   instance_port=server.SERVICE_PORT)

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    # OPTIONS 요청을 처리하여 프리플라이트 요청에 응답
    if request.method == 'OPTIONS':
        # OPTIONS 요청에 대해 허용 응답을 반환
        response = jsonify({'status': 'OK'})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        return response

    # JSON 요청에서 URL 가져오기
    data = request.get_json()
    if not data or 'url' not in data:
        print('error', ':', 'No URL provided in request')
        return jsonify({'error': 'No URL provided in request'}), 400

    video_url = data['url']
    cap = cv2.VideoCapture(video_url)

    # 학습된 모델 불러오기 -> 담배 탐지
    model = YOLO('./best.pt')

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

    # POST 요청에 대한 응답에 CORS 헤더 추가
    response = jsonify({
        'status': 'success',
        'detection_times': detection_times
    })
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8083, debug=True)