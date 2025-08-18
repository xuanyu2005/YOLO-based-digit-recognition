import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
    const [image, setImage] = useState(null);
    const [detections, setDetections] = useState([]);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!image) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', image);

        try {
            const res = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDetections(res.data);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={isLoading}>
                {isLoading ? 'Loading...' : '上传并检测'}
            </button>

            {preview && <img src={preview} alt="preview" style={{ width: 400 }} />}
            {isLoading && <p>Processing...</p>}
            <pre>{JSON.stringify(detections, null, 2)}</pre>
        </div>
    );
}

export default ImageUpload;