from flask import Flask, request, jsonify
import cv2 as cv
import numpy as np
from ultralytics import YOLO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = YOLO('best.pt')

@app.route('/upload', methods=['POST'])   
def upload_file():
    file = request.files['image']        
    image_bytes = file.read()
    image = cv.imdecode(np.frombuffer(image_bytes, np.uint8), cv.IMREAD_COLOR)

    results = model(image)

    detections = []
    for r in results:
        boxes = r.boxes
        if boxes is not None:
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = box.conf[0].item()
                cls = int(box.cls[0].item())
                label = r.names[cls]
                detections.append({
                    'label': label,
                    'confidence': conf,
                    'bbox': [x1, y1, x2, y2]
                })

    return jsonify(detections)

if __name__ == '__main__':
    app.run(debug=True)