import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function IndustrialReport() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const upload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const isVideo = file.type.startsWith('video');
        setLoading(true);
        const form = new FormData();
        form.append(isVideo ? 'video' : 'image', file);

        const url = isVideo ? 'http://localhost:5000/upload_video' : 'http://localhost:5000/upload';
        try {
            const res = await axios.post(url, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setReport(res.data);
        } catch (e) {
            alert('上传失败：' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        if (!report) return;
        let csv = 'label,count\n';
        Object.entries(report.summary || report).forEach(([label, count]) => {
            csv += `${label},${count}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'industrial_report.csv'; a.click();
    };

    return (
        <div className="industrial">
            <h1>工业检测报告</h1>
            <input type="file" accept="image/*,video/*" onChange={upload} />

            {loading && <p>处理中…</p>}

            {report && (
                <>
                    <h2>统计汇总（阈值 ≥ 0.7）</h2>
                    <ul>
                        {Object.entries(report.summary || report).map(([label, count]) => (
                            <li key={label}>{label}: {count} 次</li>
                        ))}
                    </ul>
                    <button onClick={exportCSV}>导出 CSV</button>
                </>
            )}
        </div>
    );
}

export default IndustrialReport;