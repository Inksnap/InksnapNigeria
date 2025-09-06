// Website Protection Script for Inksnap Nigeria - ENHANCED VERSION
// This script provides protection against HTTrack, Cyotek WebCopy, and other scraping tools
// Enhanced protection with bot detection and anti-scraping measures

(function() {
    'use strict';
    
    // Advanced Bot Detection - Detect HTTrack, Cyotek WebCopy, and other scraping tools
    function detectScrapingTools() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Allow legitimate search engines
        const allowedBots = [
            'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 
            'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp'
        ];
        
        const isAllowedBot = allowedBots.some(bot => userAgent.includes(bot));
        if (isAllowedBot) {
            return false; // Don't block legitimate search engines
        }
        
        const suspiciousPatterns = [
            'httrack', 'cyotek', 'webcopy', 'wget', 'curl', 'python-requests',
            'scrapy', 'beautifulsoup', 'selenium', 'phantomjs', 'headless',
            'bot', 'crawler', 'spider', 'scraper', 'downloader', 'mirror'
        ];
        
        const isSuspicious = suspiciousPatterns.some(pattern => userAgent.includes(pattern));
        
        // Check for missing browser features that scraping tools often lack
        const hasBrowserFeatures = (
            typeof window.chrome !== 'undefined' ||
            typeof window.safari !== 'undefined' ||
            (typeof window.opera !== 'undefined' && window.opera.version) ||
            (typeof window.navigator !== 'undefined' && window.navigator.userAgent.includes('Mozilla'))
        );
        
        // Check for JavaScript execution capabilities
        const hasJSFeatures = (
            typeof document.addEventListener === 'function' &&
            typeof window.setTimeout === 'function' &&
            typeof window.console !== 'undefined'
        );
        
        return isSuspicious || !hasBrowserFeatures || !hasJSFeatures;
    }
    
    // Enhanced protection if scraping tool detected
    if (detectScrapingTools()) {
        // Redirect to a different page or show error
        window.location.href = 'about:blank';
        document.body.innerHTML = '<h1>Access Denied</h1><p>Automated tools are not allowed.</p>';
        return;
    }
    
    // Protection Level 1: Disable Right-Click Context Menu (ULTRA SILENT)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Protection Level 2: Disable Common Keyboard Shortcuts (ULTRA SILENT)
    document.addEventListener('keydown', function(e) {
        // Disable F12 (Developer Tools)
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+S (Save Page)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+A (Select All)
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+C (Copy)
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+P (Print)
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            return false;
        }
    });
    
    // Protection Level 3: Disable Text Selection (ULTRA SILENT)
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Protection Level 4: Disable Drag and Drop (ULTRA SILENT)
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Protection Level 5: Smart Image Protection (ULTRA SILENT)
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            // Only protect standalone images, not those in interactive elements
            const isInInteractiveElement = img.closest('a, button, .product-card, .clickable');
            
            if (!isInInteractiveElement) {
                img.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    return false;
                });
                
                img.addEventListener('dragstart', function(e) {
                    e.preventDefault();
                    return false;
                });
                
                // Add protection styles only to standalone images
                img.style.userSelect = 'none';
                img.style.webkitUserSelect = 'none';
                img.style.mozUserSelect = 'none';
                img.style.msUserSelect = 'none';
            }
        });
    });
    
    // Protection Level 6: Add Smart CSS Protection (ULTRA SILENT)
    const style = document.createElement('style');
    style.textContent = `
        /* Disable text selection globally */
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        
        /* Allow text selection on form inputs */
        input, textarea, select {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
        
        /* Protect standalone images only */
        img:not(.product-image img):not(.thumbnail img):not(.gallery img) {
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
        }
        
        /* Allow clicks on product cards and interactive elements */
        .product-card, .product-card *, 
        .clickable, .clickable *,
        a, button, .btn, .button,
        .thumbnail, .gallery,
        .product-image, .product-image * {
            pointer-events: auto !important;
            cursor: pointer !important;
        }
        
        /* Hide text selection */
        ::selection {
            background: transparent !important;
        }
        
        ::-moz-selection {
            background: transparent !important;
        }
        
        /* Disable printing */
        @media print {
            * {
                display: none !important;
            }
            
            body::before {
                content: "This content is protected and cannot be printed.";
                display: block !important;
                text-align: center;
                font-size: 24px;
                margin-top: 50px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Protection Level 7: Disable iframe embedding (ULTRA SILENT)
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
    
    // Protection Level 8: Disable text selection on specific elements (ULTRA SILENT)
    const protectedElements = document.querySelectorAll('h1, h2, h3, p, span, div');
    protectedElements.forEach(function(element) {
        // Don't disable selection on interactive elements
        if (!element.closest('a, button, .product-card, .clickable')) {
            element.style.userSelect = 'none';
            element.style.webkitUserSelect = 'none';
            element.style.mozUserSelect = 'none';
            element.style.msUserSelect = 'none';
        }
    });
    
    // Protection Level 9: Disable console access (ULTRA SILENT)
    (function() {
        const noop = function() {};
        const methods = ['log', 'debug', 'info', 'warn', 'error', 'trace', 'dir', 'group', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd', 'count', 'clear', 'assert'];
        methods.forEach(function(method) {
            console[method] = noop;
        });
    })();
    
    // Advanced Protection Level 10: Dynamic Content Protection
    function protectDynamicContent() {
        // Obfuscate critical content
        const criticalElements = document.querySelectorAll('h1, h2, h3, .product-info, .pricing');
        criticalElements.forEach(function(element) {
            if (element.textContent) {
                const originalText = element.textContent;
                element.setAttribute('data-original', originalText);
                // Temporarily hide content
                element.style.visibility = 'hidden';
                
                // Restore content after a delay (only for real browsers)
                setTimeout(function() {
                    element.style.visibility = 'visible';
                }, 100);
            }
        });
    }
    
    // Advanced Protection Level 11: Anti-Debugging
    let devtools = {open: false, orientation: null};
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            if (!devtools.open) {
                devtools.open = true;
                // Redirect or show error
                window.location.href = 'about:blank';
            }
        }
    }, 500);
    
    // Advanced Protection Level 12: Mouse Movement Detection
    let mouseMovements = 0;
    let lastMouseTime = Date.now();
    document.addEventListener('mousemove', function() {
        mouseMovements++;
        lastMouseTime = Date.now();
        
        // If too many rapid movements (automated behavior)
        if (mouseMovements > 1000 && (Date.now() - lastMouseTime) < 1000) {
            window.location.href = 'about:blank';
        }
    });
    
    // Advanced Protection Level 13: Timing Attack Protection
    const startTime = Date.now();
    setTimeout(function() {
        const loadTime = Date.now() - startTime;
        // If page loads too quickly (typical of scraping tools)
        if (loadTime < 100) {
            window.location.href = 'about:blank';
        }
    }, 1000);
    
    // Advanced Protection Level 14: Canvas Fingerprinting
    function generateCanvasFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Canvas fingerprint test', 2, 2);
        return canvas.toDataURL();
    }
    
    // Check if canvas fingerprinting works (scraping tools often don't support this)
    try {
        const fingerprint = generateCanvasFingerprint();
        if (!fingerprint || fingerprint.length < 100) {
            window.location.href = 'about:blank';
        }
    } catch (e) {
        window.location.href = 'about:blank';
    }
    
    // Advanced Protection Level 15: WebGL Detection
    function hasWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }
    
    if (!hasWebGLSupport()) {
        // Many scraping tools don't support WebGL
        window.location.href = 'about:blank';
    }
    
    // Initialize dynamic content protection
    document.addEventListener('DOMContentLoaded', protectDynamicContent);
    
    // No console log message - completely silent
    
})();