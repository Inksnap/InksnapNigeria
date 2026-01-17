$root = 'C:\Users\USER\OneDrive\Documents\InksnapNigeria-main (5)\InksnapNigeria-main'
$files = Get-ChildItem -Path $root -Recurse -Filter *.html
$updatedCount = 0
foreach ($f in $files) {
    $path = $f.FullName
    $text = Get-Content -Path $path -Raw -Encoding UTF8
    $updated = $false

    if ($text -notmatch 'assets/discount.css') {
        if ($text -match '<link rel="stylesheet" href="styles\.css"[^>]*>') {
            $text = $text -replace '(<link rel="stylesheet" href="styles\.css"[^>]*>(?:\s*<noscript>.*?</noscript>)?)', '$1`n        <link rel="stylesheet" href="assets/discount.css">'
        }
        elseif ($text -match '(?i)</head>') {
            $text = $text -replace '(?i)</head>', '    <link rel="stylesheet" href="assets/discount.css">`n</head>'
        }
        else {
            $text = '<link rel="stylesheet" href="assets/discount.css">`n' + $text
        }
        $updated = $true
    }

    if ($text -notmatch 'assets/discount.js') {
        if ($text -match '(?i)</body>') {
            $text = $text -replace '(?i)</body>', '    <script src="assets/discount.js" defer></script>`n</body>'
        }
        else {
            $text = $text + "`n    <script src='assets/discount.js' defer></script>"
        }
        $updated = $true
    }

    if ($updated) {
        Set-Content -Path $path -Value $text -Encoding UTF8
        Write-Host "Updated: $path"
        $updatedCount++
    }
}
Write-Host "Total files updated: $updatedCount"
