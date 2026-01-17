$root = 'C:\Users\USER\OneDrive\Documents\InksnapNigeria-main (5)\InksnapNigeria-main'
$files = Get-ChildItem -Path $root -Recurse -Filter *.html -ErrorAction SilentlyContinue
$updatedCount = 0
$annotatedCount = 0
foreach ($f in $files) {
    $path = $f.FullName
    try {
        $text = Get-Content -Path $path -Raw -Encoding UTF8
    } catch { continue }

    if ($text -match 'data-unit-price') { continue }

    $price = $null
    # 1) meta og:price:amount
    $m = [regex]::Match($text, 'property=["\'']og:price:amount["\'']\s+content=["\'']([^"\'']+)["\'']', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($m.Success) { $price = $m.Groups[1].Value }

    # 2) JSON-LD offers.price or offers.price
    if (-not $price) {
        $m = [regex]::Match($text, '"offers"\s*:\s*\{[\s\S]*?"price"\s*:\s*"?([0-9.,]+)"?', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($m.Success) { $price = $m.Groups[1].Value }
    }

    # 3) generic price markers (NGN 1,600 or NGN1,600)
    if (-not $price) {
        $m = [regex]::Match($text, 'NGN\s*([0-9,]+)', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($m.Success) { $price = $m.Groups[1].Value }
    }

    if ($price) {
        # normalize
        $price = $price -replace ',',''
    } else {
        continue
    }

    $orig = $text
    $madeChange = $false

    # primary: add to inputs/selects with id or name containing qty or quantity or bagQuantity
    $pattern = '(<(?:input|select)[^>]*\b(?:id|name)\s*=\s*"[^"]*(?:qty|quantity|bagQuantity)[^"]*"[^>]*)(?<!data-unit-price)>'
    $repl = '$1 data-unit-price="' + $price + '">'
    $new = [regex]::Replace($text, $pattern, $repl, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($new -ne $text) { $text = $new; $madeChange = $true }

    # secondary: if no change, add to first input[type="number"] or first select
    if (-not $madeChange) {
        $m2 = [regex]::Match($text, '<(input[^>]*type=\"number\"[^>]*)(?<!data-unit-price)>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($m2.Success) {
            $rep2 = $m2.Groups[1].Value + ' data-unit-price="' + $price + '">'
            $text = $text -replace [regex]::Escape($m2.Value), $rep2, 1
            $madeChange = $true
        } else {
            $m3 = [regex]::Match($text, '<(select[^>]*)(?<!data-unit-price)>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
            if ($m3.Success) {
                $rep3 = $m3.Groups[1].Value + ' data-unit-price="' + $price + '">'
                $text = $text -replace [regex]::Escape($m3.Value), $rep3, 1
                $madeChange = $true
            }
        }
    }

    if ($madeChange -and $text -ne $orig) {
        try {
            Set-Content -Path $path -Value $text -Encoding UTF8
            Write-Host "Annotated: $path with price $price"
            $annotatedCount++
        } catch { Write-Host "Failed write: $path" }
    }
}
Write-Host "Total files annotated: $annotatedCount"
