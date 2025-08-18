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

def detect_on_frame(frame):
    results = model(frame)
    out = []
    for r in results:
        boxes = r.boxes
        if boxes is not None:
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = box.conf[0].item()
                cls = int(box.cls[0].item())
                label = r.names[cls]
                out.append({'label': label, 'confidence': conf, 'bbox': [x1, y1, x2, y2]})
    return out

@app.route('/upload_video', methods=['POST'])
def upload_video():
    file = request.files['video']
    if not file:
        return jsonify([]), 400

    # 保存成临时 MP4
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp:
        tmp.write(file.read())
        tmp_path = tmp.name

    cap = cv.VideoCapture(tmp_path)
    all_frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        all_frames.extend(detect_on_frame(frame))
    cap.release()
    os.remove(tmp_path)

    return jsonify(all_frames)

if __name__ == '__main__':
    app.run(debug=True)