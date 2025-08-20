from flask import Flask, request, send_file, jsonify
from ultralytics import YOLO
import cv2
import tempfile
import os
import json
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
model = YOLO('best.pt')  # 确保同级目录有 best.pt

@app.route('/upload_video', methods=['POST'])
def upload_video():
    file = request.files['video']
    if not file:
        return jsonify({'error': 'No file'}), 400

    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp:
        tmp.write(file.read())
        tmp_path = tmp.name

    cap = cv2.VideoCapture(tmp_path)
    if not cap.isOpened():
        return jsonify({'error': 'Cannot open video'}), 400

    # 1. 用 MJPG 编码 + .avi，任何浏览器都能播
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    out_path = tmp_path + '_out.avi'
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    out = cv2.VideoWriter(out_path, fourcc, fps, (w, h))

    if not out.isOpened():
        cap.release()
        return jsonify({'error': '无法创建编码器，请安装 ffmpeg'}), 500

    detections = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        res = model(frame)[0]
        for box in res.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = box.conf[0].item()
            label = res.names[int(box.cls[0].item())]
            detections.append({'label': label, 'confidence': conf})
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)
            cv2.putText(frame, f'{label}:{conf:.2f}', (int(x1), int(y1) - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        out.write(frame)

    cap.release()
    out.release()

    # 先返回文件，再删除
    response = send_file(out_path, as_attachment=True, download_name='result.avi'), 200, {
        'Access-Control-Expose-Headers': 'X-Detections',
        'X-Detections': json.dumps(detections)
    }
    # 删除临时文件
    os.remove(tmp_path)
    os.remove(out_path)

    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)