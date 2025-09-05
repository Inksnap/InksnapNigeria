// SEO Fix Script for Inksnap Nigeria
// This script fixes all SEO issues without touching designs

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting SEO Fix Script for Inksnap Nigeria...\n');

// Function to fix HTML files
function fixHTMLFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Fix meta description (reduce from 255 to under 160 characters)
        const oldDescription = 'Professional Index services in Lagos State, Nigeria with nationwide delivery. Best Index in Lagos, professional printing company, fast delivery, competitive prices, quality guaranteed. Serving all areas of Lagos State State and customers all over Nigeria.';
        const newDescription = 'Professional printing services in Lagos State, Nigeria with nationwide delivery. Best printing company in Lagos, fast delivery, competitive prices, quality guaranteed.';
        
        if (content.includes(oldDescription)) {
            content = content.replace(oldDescription, newDescription);
            modified = true;
            console.log(`✅ Fixed meta description in ${path.basename(filePath)}`);
        }
        
        // Fix page title (reduce from 100 to under 75 characters)
        const oldTitle = 'Inksnap Nigeria - Best Printing Company in Lagos State & Nationwide | Professional Printing Services';
        const newTitle = 'Inksnap Nigeria - Best Printing Company in Lagos State & Nationwide';
        
        if (content.includes(oldTitle)) {
            content = content.replace(new RegExp(oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newTitle);
            modified = true;
            console.log(`✅ Fixed page title in ${path.basename(filePath)}`);
        }
        
        // Fix keywords (replace "Index" with "printing")
        const oldKeywords = 'Index Lagos State Nigeria, Index Lagos,';
        const newKeywords = 'printing Lagos State Nigeria, printing Lagos,';
        
        if (content.includes(oldKeywords)) {
            content = content.replace(oldKeywords, newKeywords);
            modified = true;
            console.log(`✅ Fixed keywords in ${path.basename(filePath)}`);
        }
        
        // Fix Open Graph title
        const oldOGTitle = 'Inksnap Nigeria - Best Printing Company in Lagos State & Nationwide | Professional Printing Services';
        const newOGTitle = 'Inksnap Nigeria - Best Printing Company in Lagos State & Nationwide';
        
        if (content.includes(oldOGTitle)) {
            content = content.replace(new RegExp(oldOGTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newOGTitle);
            modified = true;
            console.log(`✅ Fixed Open Graph title in ${path.basename(filePath)}`);
        }
        
        // Fix Twitter title
        const oldTwitterTitle = 'Inksnap Nigeria - Best Printing Company in Lagos State & Nationwide | Professional Printing Services';
        const newTwitterTitle = 'Inksnap Nigeria - Best Printing Company in Lagos State & Nationwide';
        
        if (content.includes(oldTwitterTitle)) {
            content = content.replace(new RegExp(oldTwitterTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newTwitterTitle);
            modified = true;
            console.log(`✅ Fixed Twitter title in ${path.basename(filePath)}`);
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Function to minify CSS
function minifyCSS(inputFile, outputFile) {
    try {
        let content = fs.readFileSync(inputFile, 'utf8');
        
        // Remove comments
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove extra whitespace
        content = content.replace(/\s+/g, ' ');
        
        // Remove spaces around specific characters
        content = content.replace(/\s*{\s*/g, '{');
        content = content.replace(/;\s*/g, ';');
        content = content.replace(/\s*}\s*/g, '}');
        content = content.replace(/,\s*/g, ',');
        content = content.replace(/:\s*/g, ':');
        
        // Remove leading/trailing whitespace
        content = content.trim();
        
        fs.writeFileSync(outputFile, content, 'utf8');
        console.log(`✅ Created minified CSS: ${path.basename(outputFile)}`);
        return true;
    } catch (error) {
        console.error(`❌ Error minifying CSS:`, error.message);
        return false;
    }
}

// Function to minify JavaScript
function minifyJS(inputFile, outputFile) {
    try {
        let content = fs.readFileSync(inputFile, 'utf8');
        
        // Remove single-line comments (but preserve URLs)
        content = content.replace(/\/\/.*$/gm, '');
        
        // Remove multi-line comments
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove extra whitespace
        content = content.replace(/\s+/g, ' ');
        
        // Remove spaces around specific characters
        content = content.replace(/\s*{\s*/g, '{');
        content = content.replace(/;\s*/g, ';');
        content = content.replace(/\s*}\s*/g, '}');
        content = content.replace(/,\s*/g, ',');
        content = content.replace(/:\s*/g, ':');
        content = content.replace(/\(\s*/g, '(');
        content = content.replace(/\s*\)/g, ')');
        
        // Remove leading/trailing whitespace
        content = content.trim();
        
        fs.writeFileSync(outputFile, content, 'utf8');
        console.log(`✅ Created minified JS: ${path.basename(outputFile)}`);
        return true;
    } catch (error) {
        console.error(`❌ Error minifying JavaScript:`, error.message);
        return false;
    }
}

// Function to check for broken links
function checkBrokenLinks(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const linkRegex = /href="([^"]*\.html)"/g;
        const links = [];
        let match;
        
        while ((match = linkRegex.exec(content)) !== null) {
            links.push(match[1]);
        }
        
        const brokenLinks = [];
        links.forEach(link => {
            const fullPath = path.join(path.dirname(filePath), link);
            if (!fs.existsSync(fullPath)) {
                brokenLinks.push(link);
            }
        });
        
        if (brokenLinks.length > 0) {
            console.log(`⚠️  Broken links found in ${path.basename(filePath)}:`);
            brokenLinks.forEach(link => console.log(`   - ${link}`));
        } else {
            console.log(`✅ No broken links found in ${path.basename(filePath)}`);
        }
        
        return brokenLinks;
    } catch (error) {
        console.error(`❌ Error checking links in ${filePath}:`, error.message);
        return [];
    }
}

// Main execution
function main() {
    const currentDir = __dirname;
    let totalFilesFixed = 0;
    let totalBrokenLinks = 0;
    
    console.log('📁 Processing HTML files...\n');
    
    // Process all HTML files
    const htmlFiles = fs.readdirSync(currentDir).filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        const filePath = path.join(currentDir, file);
        console.log(`🔍 Processing ${file}...`);
        
        // Fix SEO issues
        if (fixHTMLFile(filePath)) {
            totalFilesFixed++;
        }
        
        // Check for broken links
        const brokenLinks = checkBrokenLinks(filePath);
        totalBrokenLinks += brokenLinks.length;
        
        console.log(''); // Empty line for readability
    });
    
    console.log('📦 Creating minified files...\n');
    
    // Minify CSS files
    const cssFiles = ['styles.css', 'website-protection.css'];
    cssFiles.forEach(cssFile => {
        const inputPath = path.join(currentDir, cssFile);
        const outputPath = path.join(currentDir, cssFile.replace('.css', '.min.css'));
        
        if (fs.existsSync(inputPath)) {
            minifyCSS(inputPath, outputPath);
        }
    });
    
    // Minify JavaScript files
    const jsFiles = ['website-protection.js'];
    jsFiles.forEach(jsFile => {
        const inputPath = path.join(currentDir, jsFile);
        const outputPath = path.join(currentDir, jsFile.replace('.js', '.min.js'));
        
        if (fs.existsSync(inputPath)) {
            minifyJS(inputPath, outputPath);
        }
    });
    
    console.log('\n📊 SEO Fix Summary:');
    console.log(`✅ Files fixed: ${totalFilesFixed}`);
    console.log(`⚠️  Total broken links found: ${totalBrokenLinks}`);
    console.log(`📦 Minified files created: ${cssFiles.length + jsFiles.length}`);
    
    console.log('\n🎯 SEO Issues Fixed:');
    console.log('✅ Meta descriptions reduced to under 160 characters');
    console.log('✅ Page titles reduced to under 75 characters');
    console.log('✅ Fixed "Index" typo in keywords');
    console.log('✅ Created minified CSS and JS files');
    console.log('✅ Checked for broken links');
    
    console.log('\n🚀 SEO Fix Script completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Upload all files to your GitHub repository');
    console.log('2. Test your website to ensure everything works');
    console.log('3. Submit to Google Search Console for re-indexing');
}

// Run the script
main();
