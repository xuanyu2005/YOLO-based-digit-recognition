import React, { useState } from 'react';
import axios from 'axios';

function AllInOneUpload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFile = (e) => {
        const f = e.target.files[0];
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setResults([]);
    };

    const uploadImage = async () => {
        if (!file) return;
        setLoading(true);
        const form = new FormData();
        form.append('image', file);
        const res = await axios.post('http://localhost:5000/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setResults(res.data);
        setLoading(false);
    };

    const uploadVideo = async () => {
        if (!file) return;
        setLoading(true);
        const form = new FormData();
        form.append('video', file);
        const res = await axios.post('http://localhost:5000/upload_video', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setResults(res.data);
        setLoading(false);
    };

    return (
        <div className="upload-container">
            <input type="file" accept="image/*,video/*" onChange={handleFile} />
            <div>
                <button onClick={uploadImage} disabled={loading || !file}>
                    {loading ? '处理中...' : '上传图片'}
                </button>
                <button onClick={uploadVideo} disabled={loading || !file}>
                    {loading ? '处理中...' : '上传视频'}
                </button>
            </div>

            {preview && (
                <div className="preview-container">
                    <img src={preview} alt="preview" style={{ width: 400 }} />
                </div>
            )}

            {loading && <p className="loading">Loading…</p>}

            <ul className="detections-list">
                {results.map((r, i) => (
                    <li key={i}>
                        {r.label} ({(r.confidence * 100).toFixed(1)}%)
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AllInOneUpload;