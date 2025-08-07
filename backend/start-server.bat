@echo off
echo Starting SafeHaven API Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if we're in the backend directory
if not exist "src\index.ts" (
    echo ERROR: Please run this script from the backend directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting server with ts-node...
echo Server will be available at: http://localhost:4000
echo Health check: http://localhost:4000/health
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
npx ts-node src/index.ts

REM If the server exits, pause to see any error messages
if %errorlevel% neq 0 (
    echo.
    echo Server stopped with error code: %errorlevel%
    pause
) 