// AllInOneUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

function AllInOneUpload() {
    const [file, setFile] = useState(null);
    const [videoSrc, setVideoSrc] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFile = (e) => {
        const f = e.target.files[0];
        setFile(f);
        setVideoSrc(null);
        setResults([]);
    };

    const uploadVideo = async () => {
        if (!file) return;
        setLoading(true);
        const form = new FormData();
        form.append('video', file);

        try {
            const res = await axios.post('http://localhost:5000/upload_video', form, {
                responseType: 'blob',
            });
            setLoading(false);

            // 播放视频
            const blob = new Blob([res.data], { type: 'video/x-msvideo' });
            setVideoSrc(URL.createObjectURL(blob));

            // 解析检测结果
            const detections = JSON.parse(res.headers['x-detections']);
            setResults(detections);
        } catch (error) {
            console.error('Upload error:', error);
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <input type="file" accept="video/*" onChange={handleFile} />
            <button onClick={uploadVideo} disabled={loading || !file}>
                {loading ? '处理中…' : '上传并识别'}
            </button>

            {videoSrc && (
                <video controls style={{ width: 400 }}>
                    <source src={videoSrc} type="video/x-msvideo" />
                </video>
            )}

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