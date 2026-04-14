# Simplified start_demo.ps1
Write-Host "Starting effiCouncil Full-Stack Demo..." -ForegroundColor Cyan

# Start Backend in background
Write-Host "Launching FastAPI Backend..." -ForegroundColor Green
Start-Process -NoNewWindow powershell -ArgumentList "-Command", "venv\Scripts\python -m uvicorn api:app --host 0.0.0.0 --port 8000"

# Start Frontend in background
Write-Host "Launching Vite Frontend on port 5174..." -ForegroundColor Green
Start-Process -NoNewWindow powershell -ArgumentList "-Command", "cd web-ui; npm run dev -- --port 5174"

Write-Host "Launch commands sent. Systems should be up shortly." -ForegroundColor Yellow
Write-Host "➜ Backend: http://localhost:8000"
Write-Host "➜ Frontend: http://localhost:5174"
