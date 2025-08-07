@echo off
title SafeHaven - Full Stack Development Server
color 0A

echo ========================================
echo    SafeHaven Development Environment
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if we're in the correct directory
if not exist "backend\src\index.ts" (
    echo ERROR: Backend source not found
    echo Please run this script from the project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ERROR: Frontend not found
    echo Please run this script from the project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo Checking and installing dependencies...
echo.

REM Install backend dependencies
echo [1/2] Installing backend dependencies...
cd backend
if not exist "node_modules" (
    echo Installing backend node_modules...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo Backend dependencies installed successfully
) else (
    echo Backend dependencies already installed
)
cd ..

REM Install frontend dependencies
echo [2/2] Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing frontend node_modules...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo Frontend dependencies installed successfully
) else (
    echo Frontend dependencies already installed
)
cd ..

echo.
echo ========================================
echo    Starting Development Servers
echo ========================================
echo.
echo Backend API:  http://localhost:4000
echo Health Check: http://localhost:4000/health
echo Frontend:     http://localhost:3000
echo.
echo Press Ctrl+C in any window to stop that server
echo Close all windows to stop all servers
echo.

REM Start backend server in a new window
echo Starting backend server...
start "SafeHaven Backend" cmd /k "cd /d %CD%\backend && npx ts-node src/index.ts"

REM Wait a moment for backend to start
echo Waiting for backend to initialize...
ping -n 4 127.0.0.1 >nul

REM Start frontend server in a new window
echo Starting frontend server...
start "SafeHaven Frontend" cmd /k "cd /d %CD%\frontend && npm run dev"

echo.
echo ========================================
echo    Servers Started Successfully!
echo ========================================
echo.
echo Backend API:  http://localhost:4000
echo Health Check: http://localhost:4000/health
echo Frontend:     http://localhost:3000
echo.
echo Both servers are now running in separate windows.
echo You can close this window or keep it open for reference.
echo.
echo Press any key to close this window...
pause >nul 