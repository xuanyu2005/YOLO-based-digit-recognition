import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function IndustrialUI() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const videoRef = useRef(null);

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setResults([]);
    };

    const upload = async () => {
        if (!file) return;
        setLoading(true);

        const isVideo = file.type.startsWith('video');
        const form = new FormData();
        form.append(isVideo ? 'video' : 'image', file);
        const url = isVideo ? '/upload_video' : '/upload';

        try {
            const res = await axios.post(
                `http://localhost:5000${url}`,
                form,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setResults(isVideo ? res.data.merged_codes : res.data);
        } catch (e) {
            alert('上传失败：' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        if (!results.length) return;
        const csv =
            (Array.isArray(results) ? results : Object.entries(results))
                .map((r) => (Array.isArray(r) ? `${r[0]},${r[1]}` : `${r}`))
                .join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'industrial_report.csv';
        a.click();
    };

    return (
        <div className="industrial-card">
            <h1>工业检测终端</h1>

            {/* 文件选择 */}
            <input type="file" accept="image/*,video/*" onChange={handleFile} />

            {/* 预览 */}
            {preview && (
                <>
                    {file.type.startsWith('image') ? (
                        <img src={preview} alt="preview" className="preview-img" />
                    ) : (
                        <video src={preview} controls className="preview-vid" ref={videoRef} />
                    )}
                </>
            )}

            {/* 处理按钮 */}
            <button onClick={upload} disabled={loading || !file}>
                {loading ? '处理中…' : '开始检测'}
            </button>

            {/* 结果列表 */}
            {results.length > 0 && (
                <div className="result-card">
                    <h3>{file.type.startsWith('video') ? '合并号码' : '检测结果'}</h3>
                    <ul>
                        {file.type.startsWith('video')
                            ? results.map((code, i) => <li key={i}>{code}</li>)
                            : results.map((item, i) => (
                                <li key={i}>
                                    {item.label} ({(item.confidence * 100).toFixed(1)}%)
                                </li>
                            ))}
                    </ul>
                    <button onClick={exportCSV}>导出 CSV</button>
                </div>
            )}
        </div>
    );
}

export default IndustrialUI;