$root = 'C:\Users\USER\OneDrive\Documents\InksnapNigeria-main (5)\InksnapNigeria-main'
$files = Get-ChildItem -Path $root -Recurse -Filter *.html -ErrorAction SilentlyContinue
$fixed = 0
foreach ($f in $files) {
    $path = $f.FullName
    try {
        $text = Get-Content -Path $path -Raw -Encoding UTF8
    } catch { continue }
    if ($text.Contains('`n')) {
        $escaped = [regex]::Escape('`n')
        $new = $text -replace $escaped, "`r`n"
        Set-Content -Path $path -Value $new -Encoding UTF8
        Write-Host "Fixed: $path"
        $fixed++
    }
}
Write-Host "Total files fixed: $fixed"
