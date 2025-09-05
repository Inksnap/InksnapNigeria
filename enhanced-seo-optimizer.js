const fs = require('fs');
const path = require('path');

console.log('🚀 Enhanced SEO Optimizer for Inksnap Nigeria');
console.log('🎯 Targeting: Lagos State + All Over Nigeria');
console.log('❌ Removing: All Somolu references');
console.log('');

// Function to recursively find all HTML files
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'scripts') {
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Function to optimize SEO for each file
function optimizeSeo(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath, '.html');
        
        console.log(`🔄 Optimizing: ${fileName}`);
        
        // Remove any Somolu references
        content = content.replace(/somolu/gi, 'Lagos');
        content = content.replace(/Somolu/gi, 'Lagos');
        content = content.replace(/SOMOLU/gi, 'LAGOS');
        
        // Extract the main service/product name from filename
        const serviceName = fileName
            .replace(/-/g, ' ')
            .replace(/\b(print|printing|html)\b/g, '')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        // Generate optimized title for homepage
        if (fileName === 'index') {
            const optimizedTitle = `Inksnap Nigeria - Best Printing Company in Lagos State & Nationwide | Professional Printing Services`;
            content = content.replace(
                /<title>.*?<\/title>/,
                `<title>${optimizedTitle}</title>`
            );
        } else {
            // Generate optimized title for other pages
            const optimizedTitle = `${serviceName} - Professional ${serviceName} Services in Lagos State & Nationwide | Inksnap Nigeria`;
            content = content.replace(
                /<title>.*?<\/title>/,
                `<title>${optimizedTitle}</title>`
            );
        }
        
        // Generate optimized description
        const optimizedDescription = `Professional ${serviceName} services in Lagos State, Nigeria with nationwide delivery. Best ${serviceName} in Lagos, professional printing company, fast delivery, competitive prices, quality guaranteed. Serving all areas of Lagos State and customers all over Nigeria.`;
        
        // Generate optimized keywords
        const optimizedKeywords = `${serviceName} Lagos State Nigeria, ${serviceName} Lagos, printing company Lagos State, printing services Lagos, printing near me, printing Lagos, printing Nigeria, Lagos State printing, Nigeria printing, local printing Lagos, printing company near me, best printing Lagos State, professional printing Lagos, fast printing Lagos, quality printing Lagos, affordable printing Lagos, printing delivery Lagos, nationwide printing services, printing all over Nigeria, Lagos State printing company`;
        
        // Update meta tags
        content = content.replace(
            /<meta name="description" content=".*?"/,
            `<meta name="description" content="${optimizedDescription}"`
        );
        
        content = content.replace(
            /<meta name="keywords" content=".*?"/,
            `<meta name="keywords" content="${optimizedKeywords}"`
        );
        
        // Update Open Graph tags
        if (fileName === 'index') {
            const ogTitle = `Inksnap Nigeria - Best Printing Company in Lagos State & Nationwide | Professional Printing Services`;
            const ogDescription = `Professional printing services in Lagos State, Nigeria with nationwide delivery. Best printing company in Lagos, fast delivery, competitive prices, quality guaranteed.`;
            
            content = content.replace(
                /<meta property="og:title" content=".*?"/,
                `<meta property="og:title" content="${ogTitle}"`
            );
            
            content = content.replace(
                /<meta property="og:description" content=".*?"/,
                `<meta property="og:description" content="${ogDescription}"`
            );
        } else {
            content = content.replace(
                /<meta property="og:title" content=".*?"/,
                `<meta property="og:title" content="${optimizedTitle}"`
            );
            
            content = content.replace(
                /<meta property="og:description" content=".*?"/,
                `<meta property="og:description" content="${optimizedDescription}"`
            );
        }
        
        // Update Twitter Card tags
        if (fileName === 'index') {
            const twitterTitle = `Inksnap Nigeria - Best Printing Company in Lagos State & Nationwide | Professional Printing Services`;
            const twitterDescription = `Professional printing services in Lagos State, Nigeria with nationwide delivery. Best printing company in Lagos, fast delivery, competitive prices, quality guaranteed.`;
            
            content = content.replace(
                /<meta name="twitter:title" content=".*?"/,
                `<meta name="twitter:title" content="${twitterTitle}"`
            );
            
            content = content.replace(
                /<meta name="twitter:description" content=".*?"/,
                `<meta name="twitter:description" content="${twitterDescription}"`
            );
        } else {
            content = content.replace(
                /<meta name="twitter:title" content=".*?"/,
                `<meta name="twitter:title" content="${optimizedTitle}"`
            );
            
            content = content.replace(
                /<meta name="twitter:description" content=".*?"/,
                `<meta name="twitter:description" content="${optimizedDescription}"`
            );
        }
        
        // Update structured data descriptions
        content = content.replace(
            /"description": ".*?"/g,
            `"description": "${optimizedDescription}"`
        );
        
        // Update product schema names
        content = content.replace(
            /"name": ".*?printing company in Lagos Nigeria.*?"/g,
            `"name": "${optimizedTitle}"`
        );
        
        // Update local business schema descriptions
        content = content.replace(
            /"description": "printing company in Lagos Nigeria"/g,
            `"description": "${optimizedDescription}"`
        );
        
        // Update service area schemas to focus on Lagos State
        content = content.replace(
            /"addressLocality": "Lagos"/g,
            `"addressLocality": "Lagos State"`
        );
        
        content = content.replace(
            /"addressRegion": "Lagos, Nigeria"/g,
            `"addressRegion": "Lagos State, Nigeria"`
        );
        
        // Update FAQ questions to be more specific
        content = content.replace(
            /"name": ".*?Professional.*?Services in Lagos Nigeria.*?"/g,
            `"name": "What are your ${serviceName} prices in Lagos State?"`
        );
        
        // Update content sections to focus on Lagos State
        content = content.replace(
            /all areas of Lagos/g,
            `all areas of Lagos State`
        );
        
        content = content.replace(
            /Lagos, Nigeria/g,
            `Lagos State, Nigeria`
        );
        
        // Add breadcrumb schema if not present
        if (!content.includes('BreadcrumbList') && fileName !== 'index') {
            const breadcrumbSchema = `
        <!-- Breadcrumb Schema -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://inksnapng.com/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Products",
                    "item": "https://inksnapng.com/products.html"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "${serviceName}",
                    "item": "https://inksnapng.com/${fileName}.html"
                }
            ]
        }
        </script>`;
            
            // Insert before closing head tag
            content = content.replace('</head>', `${breadcrumbSchema}\n    </head>`);
        }
        
        // Write the optimized content back to file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Optimized: ${fileName}`);
        
    } catch (error) {
        console.error(`❌ Error optimizing ${filePath}:`, error.message);
    }
}

// Function to create enhanced sitemap
function createEnhancedSitemap(htmlFiles) {
    try {
        const baseUrl = 'https://inksnapng.com';
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
        
        // Add homepage with highest priority
        sitemap += `
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>`;
        
        // Add other pages
        htmlFiles.forEach(filePath => {
            const fileName = path.basename(filePath, '.html');
            if (fileName !== 'index') {
                const priority = getPriority(fileName);
                const changefreq = getChangeFreq(fileName);
                
                sitemap += `
    <url>
        <loc>${baseUrl}/${fileName}.html</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`;
            }
        });
        
        sitemap += `
</urlset>`;
        
        fs.writeFileSync('sitemap.xml', sitemap, 'utf8');
        console.log('✅ Created enhanced sitemap.xml');
        
    } catch (error) {
        console.error('❌ Error creating sitemap:', error.message);
    }
}

// Helper function to determine page priority
function getPriority(fileName) {
    const highPriority = ['products', 'services', 'contact', 'quotes'];
    const mediumPriority = ['about-us', 'blog', 'faq'];
    
    if (highPriority.includes(fileName)) return '0.9';
    if (mediumPriority.includes(fileName)) return '0.8';
    return '0.7';
}

// Helper function to determine change frequency
function getChangeFreq(fileName) {
    const weekly = ['products', 'blog'];
    const monthly = ['services', 'about-us', 'contact', 'faq'];
    
    if (weekly.includes(fileName)) return 'weekly';
    if (monthly.includes(fileName)) return 'monthly';
    return 'monthly';
}

// Main execution
function main() {
    try {
        console.log('🔍 Finding HTML files...');
        const htmlFiles = findHtmlFiles('.');
        console.log(`📁 Found ${htmlFiles.length} HTML files`);
        console.log('');
        
        console.log('🚀 Starting SEO optimization...');
        htmlFiles.forEach(optimizeSeo);
        console.log('');
        
        console.log('🗺️ Creating enhanced sitemap...');
        createEnhancedSitemap(htmlFiles);
        console.log('');
        
        console.log('🎉 SEO optimization completed successfully!');
        console.log('');
        console.log('📋 Next steps:');
        console.log('   1. Submit sitemap.xml to Google Search Console');
        console.log('   2. Set up Google My Business profile');
        console.log('   3. Monitor search rankings for improvements');
        console.log('   4. Focus on Lagos State and nationwide keywords');
        console.log('');
        console.log('🎯 Your site is now optimized for:');
        console.log('   ✅ Lagos State (all areas)');
        console.log('   ✅ Nationwide delivery');
        console.log('   ✅ Local SEO in Lagos');
        console.log('   ✅ Extended reach across Nigeria');
        console.log('   ❌ Removed all Somolu references');
        
    } catch (error) {
        console.error('❌ Error during optimization:', error.message);
    }
}

// Run the optimizer
main();
