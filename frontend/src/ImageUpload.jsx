import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function ImageUpload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [detections, setDetections] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFile = (e) => {
        const f = e.target.files[0];
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setDetections([]);
    };

    const uploadImage = async () => {
        if (!file) return;
        setLoading(true);
        const form = new FormData();
        form.append('image', file);
        try {
            const res = await axios.post('http://localhost:5000/upload', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDetections(res.data);
        } catch (e) {
            alert('图片上传失败');
        } finally {
            setLoading(false);
        }
    };

    const uploadVideo = async () => {
        if (!file) return;
        setLoading(true);
        const form = new FormData();
        form.append('video', file);
        try {
            const res = await axios.post('http://localhost:5000/upload_video', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDetections(res.data);
        } catch (e) {
            alert('视频上传失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <input type="file" accept="image/*,video/*" onChange={handleFile} />
            <div>
                <button onClick={uploadImage} disabled={loading}>
                    {loading ? '处理中...' : '上传图片'}
                </button>
                <button onClick={uploadVideo} disabled={loading}>
                    {loading ? '处理中...' : '上传视频'}
                </button>
            </div>

            {preview && <img src={preview} alt="preview" style={{ width: 400 }} />}
            {loading && <div className="loading">Loading...</div>}

            <ul className="detections-list">
                {detections.map((d, i) => (
                    <li key={i}>
                        {d.label} ({(d.confidence * 100).toFixed(1)}%)
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ImageUpload;