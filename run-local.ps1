param(
    [int]$Port = 3000
)
# PowerShell script to start Next dev on specified port
Set-Location -Path $PSScriptRoot
Write-Host "Checking Node and npm versions..."
node -v 2>$null || Write-Warning "Node not found"
npm -v 2>$null || Write-Warning "npm not found"
Write-Host "Installing dependencies if needed..."
npm install
Write-Host "Starting Next.js dev on port $Port..."
$env:PORT = $Port
npm run dev
