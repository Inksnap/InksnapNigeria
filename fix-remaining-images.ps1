# PowerShell Script to Fix Remaining Product Image Issues
# This script fixes the remaining broken image references

Write-Host "Starting Comprehensive Product Image Fix..." -ForegroundColor Green

# Function to get product name from filename
function Get-ProductName {
    param($filename)
    $name = $filename -replace '\.html$', ''
    $name = $name -replace '-', ' '
    $name = $name -replace '\b\w', { $_.Value.ToUpper() }
    return $name
}

# Function to get image path from filename
function Get-ImagePath {
    param($filename)
    $name = $filename -replace '\.html$', ''
    return "assets/images/products/All-Products/$name/$name-1.jpeg"
}

# Function to fix a single file
function Fix-ProductFile {
    param($filename)
    
    Write-Host "Processing: $filename" -ForegroundColor Yellow
    
    $filePath = Join-Path $PWD $filename
    if (-not (Test-Path $filePath)) {
        Write-Host "File not found: $filename" -ForegroundColor Red
        return
    }
    
    $content = Get-Content $filePath -Raw
    $productName = Get-ProductName $filename
    $imagePath = Get-ImagePath $filename
    
    $changesMade = $false
    
    # Fix 1: Remove broken logo.png references in thumbnails
    if ($content -match 'src="products/logo\.png"') {
        $content = $content -replace '<img[^>]*src="products/logo\.png"[^>]*>', ''
        $changesMade = $true
        Write-Host "  - Removed broken logo.png references" -ForegroundColor Green
    }
    
    # Fix 2: Fix missing assets/images path
    if ($content -match 'src="products/All-Products/') {
        $content = $content -replace 'src="products/All-Products/', 'src="assets/images/products/All-Products/'
        $changesMade = $true
        Write-Host "  - Fixed missing assets/images path" -ForegroundColor Green
    }
    
    # Fix 3: Fix incorrect alt text in thumbnails
    if ($content -match 'alt="Professional Desk Table Calendar Printing Services in Lagos Nigeria"') {
        $content = $content -replace 'alt="Professional Desk Table Calendar Printing Services in Lagos Nigeria"', "alt=`"$productName - Professional Printing Services in Lagos Nigeria`""
        $changesMade = $true
        Write-Host "  - Fixed incorrect thumbnail alt text" -ForegroundColor Green
    }
    
    # Fix 4: Add main product image if missing
    if ($content -match 'class="product-images"' -and -not ($content -match 'id="mainImage" class="main-product-image"')) {
        # Try to find the product images section and add main image
        $pattern = '(class="product-images"[^>]*>)(\s*<div class="thumbnail-gallery">)'
        $replacement = "`$1`n                        <img id=`"mainImage`" class=`"main-product-image`" src=`"$imagePath`" alt=`"$productName - Professional Printing Services in Lagos Nigeria`" loading=`"lazy`" title=`"$productName - High Quality Digital Printing Services`" decoding=`"async`">`n                        `$2"
        
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $replacement
            $changesMade = $true
            Write-Host "  - Added missing main product image" -ForegroundColor Green
        }
    }
    
    # Fix 5: Fix any remaining broken image patterns
    if ($content -match 'decoding="async"loading="lazy"') {
        $content = $content -replace 'decoding="async"loading="lazy"', 'loading="lazy" decoding="async"'
        $changesMade = $true
        Write-Host "  - Fixed malformed image attributes" -ForegroundColor Green
    }
    
    # Save the file if changes were made
    if ($changesMade) {
        Set-Content $filePath $content -NoNewline
        Write-Host "✅ Fixed: $filename" -ForegroundColor Green
        return $true
    } else {
        Write-Host "ℹ️  No changes needed: $filename" -ForegroundColor Cyan
        return $false
    }
}

# Get all HTML files that might have issues
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" | Where-Object { 
    $_.Name -ne "index.html" -and 
    $_.Name -ne "about-us.html" -and 
    $_.Name -ne "contact.html" -and
    $_.Name -ne "faq.html" -and
    $_.Name -ne "order.html" -and
    $_.Name -ne "track-order.html" -and
    $_.Name -ne "stores.html" -and
    $_.Name -ne "image-template.html"
}

$totalFiles = $htmlFiles.Count
$fixedFiles = 0
$processedFiles = 0

Write-Host "Processing $totalFiles HTML files..." -ForegroundColor Yellow

foreach ($file in $htmlFiles) {
    $wasFixed = Fix-ProductFile $file.Name
    if ($wasFixed) {
        $fixedFiles++
    }
    $processedFiles++
    $progress = [math]::Round(($processedFiles / $totalFiles) * 100, 2)
    Write-Progress -Activity "Fixing Product Images" -Status "Processing files..." -PercentComplete $progress
}

Write-Progress -Activity "Fixing Product Images" -Completed

Write-Host "`n=== FIX RESULTS ===" -ForegroundColor Cyan
Write-Host "Total files processed: $processedFiles" -ForegroundColor White
Write-Host "Files fixed: $fixedFiles" -ForegroundColor Green
Write-Host "Files unchanged: $($processedFiles - $fixedFiles)" -ForegroundColor Cyan

Write-Host "`nComprehensive fix completed!" -ForegroundColor Green
