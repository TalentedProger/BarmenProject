# PowerShell script for fetching juice images

$juiceUrls = @(
    "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_multifruktovyy_divnyy_sad_2/",
    "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/__445/",
    "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/24646-nektar-dobryy-multifrukt-2-0-6/",
    "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/22220-sok-rich-greypfrut-1l-/",
    "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/21901-nektar-rich-vishnya-1l-/",
    "https://krasnoeibeloe.ru/catalog/soki-i-nektary/sokosoderzhashchie-napitki/21851-napitok-dobryy-apelsin-s-myakotyu-0-9/",
    "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/22223-sok-rich-yabloko-1l-/",
    "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/22222-sok-rich-tomat-1l-/",
    "https://krasnoeibeloe.ru/catalog/soki-i-nektary/soki/__395/",
    "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_kral_mango/"
)

$results = @()

Write-Host "Starting image fetch..." -ForegroundColor Green

foreach ($url in $juiceUrls) {
    try {
        Write-Host "Loading: $url" -ForegroundColor Cyan
        
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        $html = $response.Content
        
        $pattern = "https://krasnoeibeloe.servicecdn.ru/upload/resize_cache/iblock/.+?200_356_1.+?\.jpg"
        
        if ($html -match $pattern) {
            $imageUrl = $matches[0]
            
            $titlePattern = "<h1.+?>(.+?)</h1>"
            if ($html -match $titlePattern) {
                $productName = $matches[1].Trim()
            } else {
                $productName = "Unknown"
            }
            
            $results += [PSCustomObject]@{
                Name = $productName
                ImageUrl = $imageUrl
                SourceUrl = $url
            }
            
            Write-Host "  Found: $imageUrl" -ForegroundColor Green
        } else {
            Write-Host "  Not found" -ForegroundColor Yellow
        }
        
        Start-Sleep -Milliseconds 500
        
    } catch {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

Write-Host "`n=== RESULTS ===" -ForegroundColor Green
Write-Host "Found $($results.Count) images`n"

foreach ($result in $results) {
    Write-Host "$($result.Name):"
    Write-Host "  imageUrl: '$($result.ImageUrl)'" -ForegroundColor Cyan
    Write-Host ""
}

$jsonPath = Join-Path $PSScriptRoot "..\juice-images-results.json"
$results | ConvertTo-Json -Depth 3 | Set-Content $jsonPath -Encoding UTF8
Write-Host "Results saved to: $jsonPath" -ForegroundColor Green
