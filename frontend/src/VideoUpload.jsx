import React, { useState } from 'react';
import axios from 'axios';

function VideoUpload() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const handleFile = (e) => setFile(e.target.files[0]);

    const upload = async () => {
        if (!file) return;
        setLoading(true);
        const form = new FormData();
        form.append('video', file);
        try {
            const res = await axios.post('http://localhost:5000/upload_video', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResults(res.data);
        } catch (e) {
            alert('视频上传失败：' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <input type="file" accept="video/*" onChange={handleFile} />
            <button onClick={upload} disabled={loading}>
                {loading ? '处理中...' : '上传视频'}
            </button>
            <ul>
                {results.map((r, i) => (
                    <li key={i}>{r.label} ({(r.confidence * 100).toFixed(1)}%)</li>
                ))}
            </ul>
        </div>
    );
}

export default VideoUpload;