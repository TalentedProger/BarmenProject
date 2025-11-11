# Simple PowerShell script to fetch one example

$url = "https://krasnoeibeloe.ru/catalog/soki-i-nektary/nektary/nektar_multifruktovyy_divnyy_sad_2/"

try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
    $html = $response.Content
    
    # Search for any servicecdn.ru images
    $pattern = "https://krasnoeibeloe\.servicecdn\.ru/upload/[^`"'<> ]+"
    $matches = [regex]::Matches($html, $pattern)
    
    Write-Host "Found $($matches.Count) servicecdn.ru URLs:"
    foreach ($match in $matches) {
        Write-Host "  $($match.Value)"
    }
    
    # Also save HTML to file for manual inspection
    $html | Set-Content "juice-page.html" -Encoding UTF8
    Write-Host "`nHTML saved to juice-page.html for manual inspection"
    
} catch {
    Write-Host "Error: $_"
}
