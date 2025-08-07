@echo off
echo Starting SafeHaven Security Systems...
echo.

echo Starting Backend Server (Port 4001)...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo.
echo Starting Frontend Server (Port 3001)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting...
echo Backend: http://localhost:4001
echo Frontend: http://localhost:3001
echo.
echo Press any key to exit this window...
pause > nul 