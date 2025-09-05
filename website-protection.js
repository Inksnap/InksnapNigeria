// Website Protection Script for Inksnap Nigeria - ULTRA SILENT VERSION
// This script provides protection WITHOUT showing ANY messages or notices
// Completely invisible protection that doesn't interfere with user experience

(function() {
    'use strict';
    
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
    
    // No console log message - completely silent
    
})();