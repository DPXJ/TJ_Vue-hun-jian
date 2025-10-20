@echo off
chcp 65001
echo 正在启动AI视频混剪V2.0项目...
echo.

echo 1. 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo 依赖安装失败，请检查网络连接和Node.js环境
    pause
    exit /b 1
)

echo.
echo 2. 启动开发服务器...
call npm run dev

pause
