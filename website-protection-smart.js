// Website Protection Script for Inksnap Nigeria - SMART VERSION
// This script provides protection while allowing normal website functionality
// Specifically designed to work with product thumbnails and interactive elements

(function() {
    'use strict';
    
    // Protection Level 1: Disable Right-Click Context Menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showProtectionMessage('Right-click is disabled to protect our content.');
        return false;
    });
    
    // Protection Level 2: Disable Common Keyboard Shortcuts
    document.addEventListener('keydown', function(e) {
        // Disable F12 (Developer Tools)
        if (e.key === 'F12') {
            e.preventDefault();
            showProtectionMessage('Developer tools are disabled.');
            return false;
        }
        
        // Disable Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            showProtectionMessage('Developer tools are disabled.');
            return false;
        }
        
        // Disable Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            showProtectionMessage('Console is disabled.');
            return false;
        }
        
        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            showProtectionMessage('View source is disabled.');
            return false;
        }
        
        // Disable Ctrl+S (Save Page)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            showProtectionMessage('Saving this page is not allowed.');
            return false;
        }
        
        // Disable Ctrl+A (Select All)
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            showProtectionMessage('Select all is disabled.');
            return false;
        }
        
        // Disable Ctrl+C (Copy)
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            showProtectionMessage('Copying is disabled.');
            return false;
        }
        
        // Disable Ctrl+P (Print)
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            showProtectionMessage('Printing is disabled.');
            return false;
        }
    });
    
    // Protection Level 3: Disable Text Selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Protection Level 4: Disable Drag and Drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Protection Level 5: Smart Image Protection
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            // Only protect standalone images, not those in interactive elements
            const isInInteractiveElement = img.closest('a, button, .product-card, .clickable');
            
            if (!isInInteractiveElement) {
                img.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    showProtectionMessage('Image right-click is disabled.');
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
    
    // Protection Level 6: Add Smart CSS Protection
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
        
        /* Add subtle watermark overlay */
        .watermark-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 100px,
                rgba(0, 0, 0, 0.01) 100px,
                rgba(0, 0, 0, 0.01) 200px
            );
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
    
    // Protection Level 7: Add subtle watermark overlay
    const watermark = document.createElement('div');
    watermark.className = 'watermark-overlay';
    document.body.appendChild(watermark);
    
    // Protection Level 8: Disable iframe embedding
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
    
    // Protection Level 9: Add copyright notice
    const copyrightNotice = document.createElement('div');
    copyrightNotice.innerHTML = `
        <div style="
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
        ">
            © 2024 Inksnap Nigeria. All rights reserved.
        </div>
    `;
    document.body.appendChild(copyrightNotice);
    
    // Function to show protection messages
    function showProtectionMessage(message) {
        // Remove existing message
        const existingMessage = document.getElementById('protection-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.id = 'protection-message';
        messageDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ff4444;
                color: white;
                padding: 20px;
                border-radius: 10px;
                font-family: Arial, sans-serif;
                font-size: 16px;
                z-index: 10001;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                text-align: center;
                max-width: 400px;
            ">
                <strong>⚠️ Content Protection</strong><br><br>
                ${message}<br><br>
                <small>This website is protected by copyright laws.</small>
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        // Auto-remove message after 3 seconds
        setTimeout(function() {
            if (messageDiv && messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }
    
    // Protection Level 10: Disable text selection on specific elements
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
    
    console.log('🛡️ Inksnap Nigeria Website Protection Active (Smart Version)');
    
})();
