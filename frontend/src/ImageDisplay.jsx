import React from 'react';

function ImageDisplay({ image, detections }) {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (canvas && detections.length > 0) {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                detections.forEach((detection) => {
                    const { bbox, confidence, label } = detection;
                    const [x1, y1, x2, y2] = bbox;

                    // Draw bounding box
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

                    // Draw label
                    ctx.fillStyle = 'red';
                    ctx.font = '16px Arial';
                    ctx.fillText(`${label} (${confidence.toFixed(2)})`, x1, y1 - 10);
                });
            };
            img.src = image;
        }
    }, [image, detections]);

    return <canvas ref={canvasRef} />;
}

export default ImageDisplay;