from flask import Flask, request, jsonify
import cv2 as cv
import numpy as np
from ultralytics import YOLO
from flask_cors import CORS
import tempfile
import os

app = Flask(__name__)
CORS(app)
model = YOLO('best.pt')

# ---------- 图片 ----------
@app.route('/upload', methods=['POST'])
def upload_image():
    file = request.files['image']
    img = cv.imdecode(np.frombuffer(file.read(), np.uint8), cv.IMREAD_COLOR)
    results = model(img)
    detections = []
    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = box.conf[0].item()
            label = r.names[int(box.cls[0].item())]
            detections.append({'label': label, 'confidence': conf, 'bbox': [x1, y1, x2, y2]})
    return jsonify(detections)

# ---------- 视频 ----------
@app.route('/upload_video', methods=['POST'])
def upload_video():
    file = request.files['video']
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp:
        tmp.write(file.read())
        tmp_path = tmp.name

    cap = cv.VideoCapture(tmp_path)
    detections = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        results = model(frame)
        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = box.conf[0].item()
                label = r.names[int(box.cls[0].item())]
                detections.append({'label': label, 'confidence': conf, 'bbox': [x1, y1, x2, y2]})
    cap.release()
    os.remove(tmp_path)
    return jsonify(detections)

if __name__ == '__main__':
    app.run(debug=True)