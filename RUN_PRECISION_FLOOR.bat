@echo off
title effiPrecision - Master Launch Sequence
color 0D

echo ----------------------------------------------------------
echo [POWERING UP] effiPrecision Metrology Node v2.6
echo ----------------------------------------------------------

:: 1. Launch FastAPI Backend
echo [1/3] Launching Agentic Intelligence Engine...
start "Backend (PORT 8000)" cmd /c "venv\Scripts\python -m uvicorn api:app --host 127.0.0.1 --port 8000 --log-level info"

:: 2. Launch Vite Frontend
echo [2/3] Launching Premium Metrology Dashboard...
cd web-ui
start "Frontend (PORT 5173)" cmd /c "npm run dev -- --port 5173"
cd ..

:: 3. Open Browser
echo [3/3] Establishment of Metrology Link...
timeout /t 5 /nobreak
start http://localhost:5173

echo ----------------------------------------------------------
echo [SUCCESS] ALL SYSTEMS NOMINAL. 
echo ----------------------------------------------------------
pause
