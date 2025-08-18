import React from 'react';
import ImageUpload from './ImageUpload';   // 引入刚才的组件
import './App.css';                       // 可选，删掉也行

function App() {
  return (
    <div className="App">
      <h1>YOLO 图像检测</h1>
      <ImageUpload />
    </div>
  );
}

export default App;