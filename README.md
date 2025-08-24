# YOLO-based Digit Recognition

基于YOLO模型的数字识别系统，支持图片和视频中的数字检测与识别。该项目包含前端React应用和后端Flask服务，能够快速识别图像或视频中的数字并返回结果。

## 项目结构

```
YOLO-based-digit-recognition/
├── frontend/           # React前端应用
├── app.py              # Flask后端服务
└── best.pt             # YOLO模型权重文件(需自行添加)
```

## 功能特点

- 支持图片上传并识别其中的数字
- 支持视频上传并逐帧识别其中的数字
- 显示识别结果及置信度
- 前端实时预览上传的图片

## 环境要求

### 后端
- Python 3.8+
- 依赖包：flask, flask-cors, opencv-python, numpy, ultralytics

### 前端
- Node.js 14+
- npm 6+

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/xuanyu2005/YOLO-based-digit-recognition
cd YOLO-based-digit-recognition
```

### 2. 后端设置

安装依赖：
```bash
pip install flask flask-cors opencv-python numpy ultralytics
```

放置YOLO模型权重文件：
将训练好的`best.pt`文件放在项目根目录

启动后端服务：
```bash
python app.py
```
服务将运行在 http://localhost:5000

### 3. 前端设置

进入前端目录：
```bash
cd frontend
```

安装依赖：
```bash
npm install
```

启动开发服务器：
```bash
npm start
```
前端应用将运行在 http://localhost:3000

## 使用方法

1. 确保后端服务和前端应用都已启动
2. 在浏览器中访问 http://localhost:3000
3. 点击"选择文件"按钮上传图片或视频
4. 根据文件类型点击"上传图片"或"上传视频"按钮
5. 等待处理完成后查看识别结果

## 项目组件说明

### 后端API

- `POST /upload`：处理图片上传，返回识别结果
- `POST /upload_video`：处理视频上传，返回逐帧识别结果

### 前端组件

- `App.js`：应用入口组件
- `AllInOneUpload.jsx`：处理图片和视频上传的综合组件
- `ImageDisplay.jsx`：用于在画布上显示图片及检测框
- `ImageUpload.jsx`/`VideoUpload.jsx`：分别处理图片和视频上传的组件

## 生产环境部署

### 后端部署

可以使用Gunicorn作为WSGI服务器部署Flask应用：
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### 前端部署

构建生产版本：
```bash
cd frontend
npm run build
```
生成的`build`目录可部署到Nginx等Web服务器

## 注意事项

- 视频处理可能需要较长时间，取决于视频长度和服务器性能
- 确保上传的文件格式被支持（图片：常见图片格式；视频：MP4等）
- 模型性能取决于训练数据和场景，复杂场景下可能识别准确率下降

## 相关文档

- [Create React App 文档](https://facebook.github.io/create-react-app/docs/getting-started)
- [React 文档](https://reactjs.org/)
- [YOLO 文档](https://docs.ultralytics.com/)
- [Flask 文档](https://flask.palletsprojects.com/)