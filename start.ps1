# AI视频混剪V2.0 启动脚本
Write-Host "正在启动AI视频混剪V2.0项目..." -ForegroundColor Green
Write-Host ""

# 设置编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "1. 安装依赖..." -ForegroundColor Yellow
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "依赖安装失败"
    }
    Write-Host "依赖安装成功！" -ForegroundColor Green
} catch {
    Write-Host "依赖安装失败，请检查网络连接和Node.js环境" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host ""
Write-Host "2. 启动开发服务器..." -ForegroundColor Yellow
Write-Host "项目将在 http://localhost:3000 启动" -ForegroundColor Cyan
Write-Host ""

try {
    npm run dev
} catch {
    Write-Host "启动失败，请检查配置" -ForegroundColor Red
    Read-Host "按任意键退出"
}
