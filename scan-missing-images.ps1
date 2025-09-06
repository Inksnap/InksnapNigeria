# PowerShell Script to Scan for Pages Without Product Pictures
# This script identifies pages that still have missing or broken product images

Write-Host "Starting Product Image Scan..." -ForegroundColor Green

# Function to check if a file has proper main product image
function Test-ProductImage {
    param($filePath)
    
    if (-not (Test-Path $filePath)) {
        return @{ HasImage = $false; Issue = "File not found" }
    }
    
    $content = Get-Content $filePath -Raw
    
    # Check for broken main image patterns
    $brokenPatterns = @(
        'decoding="async"loading="lazy"',
        '<img[^>]*decoding="async" decoding="async">',
        '<img[^>]*src=""[^>]*>',
        '<img[^>]*src="[^"]*logo\.png"[^>]*>',
        '<img[^>]*alt="[^"]*Desk Table Calendar[^"]*"[^>]*>'
    )
    
    foreach ($pattern in $brokenPatterns) {
        if ($content -match $pattern) {
            return @{ HasImage = $false; Issue = "Broken image pattern: $pattern" }
        }
    }
    
    # Check for proper main product image
    if ($content -match 'id="mainImage" class="main-product-image"') {
        return @{ HasImage = $true; Issue = "Has proper main image" }
    }
    
    # Check for any main product image
    if ($content -match 'class="main-product-image"') {
        return @{ HasImage = $true; Issue = "Has main image (may need verification)" }
    }
    
    return @{ HasImage = $false; Issue = "No main product image found" }
}

# Function to check thumbnail issues
function Test-ThumbnailIssues {
    param($filePath)
    
    $content = Get-Content $filePath -Raw
    $issues = @()
    
    # Check for incorrect alt text
    if ($content -match 'alt="Professional Desk Table Calendar Printing Services in Lagos Nigeria"') {
        $issues += "Incorrect thumbnail alt text"
    }
    
    # Check for broken thumbnail paths
    if ($content -match 'src="products/logo\.png"') {
        $issues += "Broken thumbnail path (logo.png)"
    }
    
    # Check for missing assets path
    if ($content -match 'src="products/All-Products/') {
        $issues += "Missing assets/images path"
    }
    
    return $issues
}

# Get all HTML files
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" | Where-Object { $_.Name -ne "index.html" -and $_.Name -ne "about-us.html" -and $_.Name -ne "contact.html" }

$totalFiles = $htmlFiles.Count
$filesWithIssues = @()
$filesWithoutMainImage = @()
$filesWithThumbnailIssues = @()

Write-Host "Scanning $totalFiles HTML files..." -ForegroundColor Yellow

foreach ($file in $htmlFiles) {
    $imageTest = Test-ProductImage $file.FullName
    $thumbnailIssues = Test-ThumbnailIssues $file.FullName
    
    if (-not $imageTest.HasImage) {
        $filesWithoutMainImage += @{
            File = $file.Name
            Issue = $imageTest.Issue
        }
    }
    
    if ($thumbnailIssues.Count -gt 0) {
        $filesWithThumbnailIssues += @{
            File = $file.Name
            Issues = $thumbnailIssues
        }
    }
    
    if (-not $imageTest.HasImage -or $thumbnailIssues.Count -gt 0) {
        $filesWithIssues += $file.Name
    }
}

# Display results
Write-Host "`n=== SCAN RESULTS ===" -ForegroundColor Cyan
Write-Host "Total files scanned: $totalFiles" -ForegroundColor White
Write-Host "Files with issues: $($filesWithIssues.Count)" -ForegroundColor $(if ($filesWithIssues.Count -eq 0) { "Green" } else { "Red" })
Write-Host "Files without main image: $($filesWithoutMainImage.Count)" -ForegroundColor $(if ($filesWithoutMainImage.Count -eq 0) { "Green" } else { "Red" })
Write-Host "Files with thumbnail issues: $($filesWithThumbnailIssues.Count)" -ForegroundColor $(if ($filesWithThumbnailIssues.Count -eq 0) { "Green" } else { "Red" })

if ($filesWithoutMainImage.Count -gt 0) {
    Write-Host "`n=== FILES WITHOUT MAIN PRODUCT IMAGE ===" -ForegroundColor Red
    foreach ($file in $filesWithoutMainImage) {
        Write-Host "❌ $($file.File) - $($file.Issue)" -ForegroundColor Red
    }
}

if ($filesWithThumbnailIssues.Count -gt 0) {
    Write-Host "`n=== FILES WITH THUMBNAIL ISSUES ===" -ForegroundColor Yellow
    foreach ($file in $filesWithThumbnailIssues) {
        Write-Host "⚠️  $($file.File)" -ForegroundColor Yellow
        foreach ($issue in $file.Issues) {
            Write-Host "   - $issue" -ForegroundColor Yellow
        }
    }
}

if ($filesWithIssues.Count -eq 0) {
    Write-Host "`n🎉 ALL FILES HAVE PROPER PRODUCT IMAGES!" -ForegroundColor Green
} else {
    Write-Host "`n=== SUMMARY OF ISSUES ===" -ForegroundColor Red
    Write-Host "Files needing attention: $($filesWithIssues.Count)" -ForegroundColor Red
    Write-Host "`nFiles with issues:" -ForegroundColor Red
    foreach ($file in $filesWithIssues) {
        Write-Host "  - $file" -ForegroundColor Red
    }
}

# Generate detailed report
$reportPath = "image-scan-report.txt"
$report = @"
PRODUCT IMAGE SCAN REPORT
Generated: $(Get-Date)
Total Files Scanned: $totalFiles
Files with Issues: $($filesWithIssues.Count)
Files without Main Image: $($filesWithoutMainImage.Count)
Files with Thumbnail Issues: $($filesWithThumbnailIssues.Count)

FILES WITHOUT MAIN PRODUCT IMAGE:
"@

foreach ($file in $filesWithoutMainImage) {
    $report += "`n- $($file.File): $($file.Issue)"
}

$report += "`n`nFILES WITH THUMBNAIL ISSUES:"
foreach ($file in $filesWithThumbnailIssues) {
    $report += "`n- $($file.File):"
    foreach ($issue in $file.Issues) {
        $report += "`n  * $issue"
    }
}

$report += "`n`nALL FILES WITH ISSUES:"
foreach ($file in $filesWithIssues) {
    $report += "`n- $file"
}

Set-Content -Path $reportPath -Value $report
Write-Host "`n📄 Detailed report saved to: $reportPath" -ForegroundColor Cyan

Write-Host "`nScan completed!" -ForegroundColor Green
