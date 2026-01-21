# Add NextAuth.js environment variables to .env files

$envFile = ".env"
$envExampleFile = ".env.example"

# Generate NEXTAUTH_SECRET
Write-Host "`n[1/3] Generating NEXTAUTH_SECRET..." -ForegroundColor Cyan
$secret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 48 | ForEach-Object {[char]$_})
Write-Host "   Secret key generated" -ForegroundColor Green

# Environment variables content
$nextAuthVars = @"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hayat_clinic

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
"@

# Add to .env.example
Write-Host "`n[2/3] Adding variables to .env.example..." -ForegroundColor Cyan
if (Test-Path $envExampleFile) {
    $content = Get-Content $envExampleFile -Raw -Encoding UTF8
    if ($content -notmatch "NEXTAUTH_URL") {
        Add-Content -Path $envExampleFile -Value "`n$nextAuthVars" -Encoding UTF8
        Write-Host "   Variables added to .env.example" -ForegroundColor Green
    } else {
        Write-Host "   Variables already exist in .env.example" -ForegroundColor Yellow
    }
} else {
    Set-Content -Path $envExampleFile -Value $nextAuthVars -Encoding UTF8
    Write-Host "   Created .env.example" -ForegroundColor Green
}

# Add to .env (if it doesn't exist)
Write-Host "`n[3/3] Checking .env file..." -ForegroundColor Cyan
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw -Encoding UTF8
    if ($envContent -notmatch "NEXTAUTH_URL") {
        Add-Content -Path $envFile -Value "`n$nextAuthVars" -Encoding UTF8
        Write-Host "   Variables added to .env" -ForegroundColor Green
    } else {
        Write-Host "   Variables already exist in .env" -ForegroundColor Yellow
        Write-Host "   Note: Update NEXTAUTH_SECRET manually if needed" -ForegroundColor Yellow
    }
} else {
    Write-Host "   .env file not found" -ForegroundColor Yellow
    Write-Host "   Tip: Copy .env.example to .env and update values" -ForegroundColor Cyan
    Write-Host "   Copy-Item .env.example .env" -ForegroundColor Gray
}

Write-Host "`nDone! Next steps:" -ForegroundColor Green
Write-Host "   1. Update DATABASE_URL with real database values" -ForegroundColor White
Write-Host "   2. (Optional) Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET" -ForegroundColor White
Write-Host "   3. Generated NEXTAUTH_SECRET: $secret" -ForegroundColor White
Write-Host ""
