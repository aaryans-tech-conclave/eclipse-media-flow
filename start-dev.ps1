# PowerShell script to start both servers
Write-Host "🚀 Starting Google Trends Backend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '📊 Backend Server Starting...' -ForegroundColor Blue; npm run dev" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

Write-Host "🎬 Starting React Frontend..." -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Blue
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the frontend server" -ForegroundColor Yellow

npm run dev 