@echo off
REM Start Next.js dev server from project root (Windows cmd)
cd /d "%~dp0"
echo Checking Node and npm versions...
node -v || echo Node not found
npm -v || echo npm not found
echo Installing dependencies if needed...
npm install
echo Starting Next.js dev server on port 3000...
npm run dev
pause
