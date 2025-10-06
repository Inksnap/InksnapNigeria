(function(){
    "use strict";

    const ua = navigator.userAgent.toLowerCase();
    const disallowed = [
        'httrack',
        'cyotek',
        'webcopy',
        'wget',
        'python-requests',
        'scrapy',
        'beautifulsoup',
        'phantomjs'
    ];

    if (disallowed.some(term => ua.includes(term))) {
        console.warn('Potential automated tool detected.');
    }
})();
