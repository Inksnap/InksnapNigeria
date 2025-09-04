// Website Protection Script for Inksnap Nigeria
// This script implements multiple layers of protection against copying

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
        
        // Disable Ctrl+V (Paste)
        if (e.ctrlKey && e.key === 'v') {
            e.preventDefault();
            showProtectionMessage('Pasting is disabled.');
            return false;
        }
        
        // Disable Ctrl+X (Cut)
        if (e.ctrlKey && e.key === 'x') {
            e.preventDefault();
            showProtectionMessage('Cutting is disabled.');
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
    
    // Protection Level 5: Disable Image Right-Click and Drag
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                showProtectionMessage('Image right-click is disabled.');
                return false;
            });
            
            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
            
            // Add watermark overlay to images
            img.style.position = 'relative';
            img.style.userSelect = 'none';
            img.style.webkitUserSelect = 'none';
            img.style.mozUserSelect = 'none';
            img.style.msUserSelect = 'none';
        });
    });
    
    // Protection Level 6: Detect Developer Tools
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                showProtectionMessage('Developer tools detected. Please close them to continue.');
                // Optionally redirect or disable functionality
                // window.location.href = 'about:blank';
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // Protection Level 7: Disable Print Screen
    document.addEventListener('keyup', function(e) {
        if (e.key === 'PrintScreen') {
            navigator.clipboard.writeText('').then(function() {
                showProtectionMessage('Screenshots are not allowed.');
            });
        }
    });
    
    // Protection Level 8: Add CSS to prevent selection
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        
        img {
            pointer-events: none !important;
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
        }
        
        /* Hide text selection */
        ::selection {
            background: transparent !important;
        }
        
        ::-moz-selection {
            background: transparent !important;
        }
        
        /* Disable image dragging */
        img {
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
        }
        
        /* Add watermark overlay */
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
                rgba(0, 0, 0, 0.03) 100px,
                rgba(0, 0, 0, 0.03) 200px
            );
        }
    `;
    document.head.appendChild(style);
    
    // Protection Level 9: Add watermark overlay
    const watermark = document.createElement('div');
    watermark.className = 'watermark-overlay';
    document.body.appendChild(watermark);
    
    // Protection Level 10: Disable iframe embedding
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
    
    // Protection Level 11: Add copyright notice
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
    
    // Protection Level 12: Disable console access
    (function() {
        const noop = function() {};
        const methods = ['log', 'debug', 'info', 'warn', 'error', 'trace', 'dir', 'group', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd', 'count', 'clear', 'assert'];
        methods.forEach(function(method) {
            console[method] = noop;
        });
    })();
    
    // Protection Level 13: Add mouse tracking to detect suspicious behavior
    let mouseMovements = 0;
    document.addEventListener('mousemove', function() {
        mouseMovements++;
        if (mouseMovements > 1000) { // Suspicious amount of mouse movement
            showProtectionMessage('Suspicious activity detected.');
        }
    });
    
    // Protection Level 14: Disable text selection on specific elements
    const protectedElements = document.querySelectorAll('h1, h2, h3, p, span, div');
    protectedElements.forEach(function(element) {
        element.style.userSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.mozUserSelect = 'none';
        element.style.msUserSelect = 'none';
    });
    
    console.log('🛡️ Inksnap Nigeria Website Protection Active');
    
})();
