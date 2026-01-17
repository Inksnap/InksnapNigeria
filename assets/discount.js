(function(){
    /* Shared discount JS: finds quantity inputs, reads unit price (data-unit-price or hero text),
       injects price summary UI if missing, and updates total + 10% discount for qty>=200. */

    function parsePriceFromText(text){
        if(!text) return null;
        // Find first number like 1,600 or 25000
        const m = text.replace(/,/g,'').match(/(\d+(?:\.\d+)?)/);
        if(!m) return null;
        let val = parseFloat(m[1]);
        // Heuristics: if text contains "/100" or "per 100" scale down
        if(/per\s*100|\/100/i.test(text)){
            return val/100;
        }
        return val;
    }

    function formatNaira(n){
        return Math.round(n).toLocaleString('en-NG');
    }

    function ensureSummary(input, unitPrice){
        let parent = input.closest('.order-form') || input.parentElement;
        if(!parent) parent = document.body;
        let summary = parent.querySelector('.price-summary');
        if(!summary){
            summary = document.createElement('div');
            summary.className = 'price-summary';
            summary.setAttribute('aria-live','polite');
            summary.innerHTML = '<div class="discount-badge" style="display:none">10% OFF for orders of 200+ units</div>' +
                '<div class="muted">Unit price from NGN ' + formatNaira(unitPrice) + (unitPrice>=1000? '':'') + '</div>' +
                '<div class="price-values"><div class="total">Total: NGN <span class="totalPrice">0</span></div>' +
                '<div class="discounted" style="display:none">Discounted: NGN <span class="discountPrice">0</span></div></div>';
            input.insertAdjacentElement('afterend', summary);
        }
        return summary;
    }

    function updateForInput(input){
        const unitAttr = input.getAttribute('data-unit-price');
        let unitPrice = unitAttr ? parseFloat(unitAttr) : null;
        if(!unitPrice){
            // try to find hero-price text
            const hero = document.querySelector('.hero-price') || document.querySelector('.hero .hero-price');
            if(hero) unitPrice = parsePriceFromText(hero.textContent);
            // fallback: try meta offers price
            if(!unitPrice){
                const og = document.querySelector('meta[property="og:price:amount"]');
                if(og) unitPrice = parseFloat(og.getAttribute('content'));
            }
        }
        if(!unitPrice || isNaN(unitPrice)) unitPrice = 0;

        const summary = ensureSummary(input, unitPrice);
        const totalEl = summary.querySelector('.totalPrice');
        const discountEl = summary.querySelector('.discountPrice');
        const discountWrap = summary.querySelector('.discounted');

        function calc(){
            const qty = parseInt(input.value,10) || 0;
            const total = qty * unitPrice;
            totalEl.textContent = formatNaira(total);
            const badge = summary.querySelector('.discount-badge');
            if(qty >= 200){
                const discounted = Math.round(total * 0.9);
                discountWrap.style.display = 'inline-block';
                discountEl.textContent = formatNaira(discounted);
                if(badge) badge.style.display = 'inline-block';
            } else {
                discountWrap.style.display = 'none';
                discountEl.textContent = '0';
                if(badge) badge.style.display = 'none';
            }
        }

        // initial
        calc();
        input.addEventListener('input', calc);
        input.addEventListener('change', calc);
    }

    function init(){
        // Broaden detection: look for number inputs and selects that appear to be quantity controls
        const candidates = Array.from(document.querySelectorAll('input[type="number"], select'));
        const inputs = candidates.filter(el => {
            if (!el.offsetParent) return false; // not visible
            const id = (el.id || '').toLowerCase();
            const name = (el.name || '').toLowerCase();
            const cls = (el.className || '').toLowerCase();
            const label = (el.closest('label') && el.closest('label').textContent) ? el.closest('label').textContent.toLowerCase() : '';
            // heuristics: id/name/class/label contains qty or quantity
            if (id.includes('qty') || name.includes('qty') || id.includes('quantity') || name.includes('quantity') || cls.includes('qty') || cls.includes('quantity') || label.includes('qty') || label.includes('quantity')) return true;
            // also accept inputs inside forms or containers that look like product/order areas
            const container = el.closest('.order-form, .product, .hero, .product-details, .product-form, form[id*="order"], form[class*="order"]');
            if (container) return true;
            return false;
        });

        inputs.forEach(input => {
            try{ updateForInput(input); }catch(e){console.error('discount init error',e);} 
        });
    }

    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', init);
    } else init();
})();

/* Advanced product enhancements: lightbox, share bar, delivery estimator, keyboard nav */
(function(){
    // Lightbox
    const lb = document.createElement('div'); lb.className = 'lightbox-overlay'; lb.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button><button class="lb-prev" aria-label="Previous">&#8249;</button><img class="lb-image" alt=""/><button class="lb-next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(lb);
    const lbImage = lb.querySelector('.lb-image');
    const lbClose = lb.querySelector('.lb-close');
    const lbPrev = lb.querySelector('.lb-prev');
    const lbNext = lb.querySelector('.lb-next');

    let gallery = [];
    function buildGallery(){
        gallery = Array.from(document.querySelectorAll('.main-product-image, .product-card img, .thumbnail-image')).filter(img=>img && img.src);
    }
    buildGallery();

    function openLightbox(idx){
        if(idx<0||idx>=gallery.length) return;
        lb.classList.add('show');
        currentIdx = idx;
        lbImage.src = gallery[currentIdx].dataset.fullSrc || gallery[currentIdx].src;
        lbImage.alt = gallery[currentIdx].alt || '';
        lbImage.focus && lbImage.focus();
    }

    function closeLightbox(){ lb.classList.remove('show'); lbImage.src=''; }
    function prev(){ openLightbox((currentIdx-1+gallery.length)%gallery.length); }
    function next(){ openLightbox((currentIdx+1)%gallery.length); }
    let currentIdx = 0;

    document.addEventListener('click', function(e){
        const target = e.target.closest('img');
        if(target && (target.classList.contains('main-product-image') || target.classList.contains('thumbnail-image') || target.closest('.product-card'))){
            buildGallery();
            const idx = gallery.indexOf(target.closest('img'));
            openLightbox(idx>=0?idx:0);
        }
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', prev);
    lbNext.addEventListener('click', next);
    lb.addEventListener('click', function(e){ if(e.target===lb){ closeLightbox(); } });
    document.addEventListener('keydown', function(e){ if(!lb.classList.contains('show')) return; if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowLeft') prev(); if(e.key==='ArrowRight') next(); });

    // Share bar
    (function(){
        try{
            const share = document.createElement('div'); share.className='share-bar';
            const url = encodeURIComponent(location.href);
            const title = encodeURIComponent(document.title || '');
            const wa = document.createElement('a'); wa.className='share-btn'; wa.href = 'https://wa.me/?text=' + title + '%20' + url; wa.setAttribute('aria-label','Share on WhatsApp'); wa.target='_blank'; wa.rel='noopener'; wa.innerHTML = '<i class="fab fa-whatsapp"></i>';
            const fb = document.createElement('a'); fb.className='share-btn'; fb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + url; fb.setAttribute('aria-label','Share on Facebook'); fb.target='_blank'; fb.rel='noopener'; fb.innerHTML = '<i class="fab fa-facebook-f"></i>';
            const tw = document.createElement('a'); tw.className='share-btn'; tw.href = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title; tw.setAttribute('aria-label','Share on Twitter'); tw.target='_blank'; tw.rel='noopener'; tw.innerHTML = '<i class="fab fa-twitter"></i>';
            share.appendChild(wa); share.appendChild(fb); share.appendChild(tw);
            document.body.appendChild(share);
        }catch(e){console.error('share bar', e)}
    })();

    // Delivery estimator removed per user request

    // Smooth scroll helpers: keep existing panel buttons usable
    document.addEventListener('click', function(e){
        const btn = e.target.closest('.panel-quote, .panel-enquire, .panel-quote, a.cta-button, a.cta');
        if(!btn) return;
        const target = document.querySelector('.order-form') || document.querySelector('form');
        if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'center'}); }
    });

})();

/* Recently Viewed, Loyalty Points */
 (function(){
    const STORAGE_RECENT = 'inksnap_recent_v1';

    function readRecent(){ try{ return JSON.parse(localStorage.getItem(STORAGE_RECENT) || '[]') }catch(e){return []} }
    function writeRecent(v){ try{ localStorage.setItem(STORAGE_RECENT, JSON.stringify(v||[])); }catch(e){} }

    // Recently viewed: track on product pages
    function trackRecent(){
        const title = (document.querySelector('.product-hero h1') && document.querySelector('.product-hero h1').textContent.trim()) || document.title;
        const img = (document.querySelector('.main-product-image') && document.querySelector('.main-product-image').src) || '';
        const url = location.pathname + location.search;
        if(!title) return;
        let recent = readRecent(); recent = recent.filter(r=>r.url!==url); recent.unshift({title,img,url,t:Date.now()}); recent = recent.slice(0,12); writeRecent(recent);
    }

    function renderRecentRow(){ const recent = readRecent(); if(recent.length===0) return; const container = document.querySelector('.recent-row');
        if(!container){ // try to inject under product details
            const details = document.querySelector('.product-details .container, .product-hero .container, .details-grid');
            if(!details) return; const wrap = document.createElement('div'); wrap.className='recent-row'; details.appendChild(wrap);
        }
        const row = document.querySelector('.recent-row'); row.innerHTML=''; readRecent().forEach(r=>{ const el=document.createElement('a'); el.className='recent-item'; el.href = r.url; el.innerHTML = '<img src="'+(r.img||'')+'"><div style="font-weight:700;font-size:13px;margin-top:6px">'+(r.title.length>36? r.title.slice(0,36)+'...': r.title)+'</div>'; row.appendChild(el); }); }

    // Loyalty points: show near hero/summary
    function renderLoyaltyBadge(){
        const unitText = (document.querySelector('[data-unit-price]') && document.querySelector('[data-unit-price]').getAttribute('data-unit-price')) || (document.querySelector('.hero-price') && document.querySelector('.hero-price').textContent) || '';
        let val = 0; const m = String(unitText).replace(/,/g,'').match(/(\d+(?:\.\d+)?)/); if(m) val = parseFloat(m[1]);
        const points = Math.floor((val||0)/1000 * 10); // heuristic: 10 points per NGN1,000
        if(points<=0) return;
        const target = document.querySelector('.price-summary') || document.querySelector('.hero-price') || document.querySelector('.product-info h2');
        if(!target) return; if(target.querySelector('.loyalty-badge')) return;
        const el = document.createElement('span'); el.className='loyalty-badge'; el.textContent = 'Earn ~' + points + ' pts';
        target.appendChild(el);
    }

    function init(){ try{ trackRecent(); renderRecentRow(); renderLoyaltyBadge(); }catch(e){console.error('recent/loyalty init',e);} }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Global product estimate enhancer: injects a compact estimated-total element next to quantity inputs
   and updates it based on unit price, paper type, and binding selections when present. */
(function(){
    function formatNGN(n){ return 'NGN ' + (Math.round(n)||0).toLocaleString('en-NG'); }

    function getPaperMultiplier(val){
        if(!val) return 1;
        val = String(val).toLowerCase();
        if(val.indexOf('250gsm')>-1) return 1.12;
        if(val.indexOf('300gsm')>-1) return 1.25;
        return 1;
    }

    function getBindingExtra(val){
        if(!val) return 0;
        val = String(val).toLowerCase();
        if(val.indexOf('wire')>-1) return 40;
        if(val.indexOf('spiral')>-1) return 60;
        if(val.indexOf('twin')>-1) return 80;
        return 0;
    }

    function ensureEstimateEl(input){
        const container = input.closest('.order-form') || input.parentElement || document.body;
        let el = container.querySelector('.price-estimate');
        if(!el){
            el = document.createElement('div');
            el.className = 'price-estimate';
            el.setAttribute('aria-live','polite');
            el.innerHTML = 'Estimated total: <strong class="estimate-value">NGN 0</strong>';
            input.insertAdjacentElement('afterend', el);
        }
        return el;
    }

    function attachTo(input){
        try{
            const estimateEl = ensureEstimateEl(input);
            const estimateValue = estimateEl.querySelector('.estimate-value');
            const unit = parseFloat(input.getAttribute('data-unit-price') || input.dataset.unitPrice || '0') || 0;
            const form = input.closest('form') || document;
            const paper = form.querySelector('select[id*=paper], select[name*=paper]');
            const binding = form.querySelector('select[id*=bind], select[name*=bind], select[id*=binding], select[name*=binding]');

            function update(){
                const qty = Math.max(0, parseInt(input.value,10) || 0);
                const pm = getPaperMultiplier(paper && paper.value);
                const be = getBindingExtra(binding && binding.value);
                const total = Math.round((unit * pm + be) * qty);
                estimateValue.textContent = formatNGN(total);
            }

            input.addEventListener('input', update);
            if(paper) paper.addEventListener('change', update);
            if(binding) binding.addEventListener('change', update);
            update();
        }catch(e){console.error('estimate attach', e)}
    }

    function init(){
        const candidates = Array.from(document.querySelectorAll('input[type="number"]'));
        candidates.forEach(inp=>{
            const id=(inp.id||'').toLowerCase();
            const name=(inp.name||'').toLowerCase();
            const cls=(inp.className||'').toLowerCase();
            const label = (inp.closest('label') && inp.closest('label').textContent) ? inp.closest('label').textContent.toLowerCase() : '';
            if(id.includes('qty')||name.includes('qty')||id.includes('quantity')||name.includes('quantity')||cls.includes('qty')||cls.includes('quantity')||label.includes('qty')||label.includes('quantity')|| inp.hasAttribute('data-unit-price')){
                attachTo(inp);
            }
        });
    }

    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

// Minimal shared sticky panel injector
(function(){
    try{
        function findQuantity(){
            return document.querySelector('input[data-unit-price], input[type="number"]#quantity, input[type="number"][name*="qty"], input[type="number"][name*="quantity"]');
        }
        function createPanel(unit){
            if(document.querySelector('.sticky-order-panel')) return null;
            const panel = document.createElement('div'); panel.className = 'sticky-order-panel';
            panel.innerHTML = '<div class="row"><div>Unit</div><div>NGN <span class="unit">'+Math.round(unit).toLocaleString('en-NG')+'</span></div></div>'+
                              '<div class="row"><div>Total</div><div>NGN <span class="total">0</span></div></div>'+
                              '<div class="row discount-row" style="display:none"><div>Discounted</div><div>NGN <span class="discount">0</span></div></div>'+
                              '<div class="row qty"><input type="number" min="1" value="1" class="panel-qty-input" aria-label="Quantity"></div>'+
                              '<div class="cta"><button class="primary panel-enquire">Enquire</button><button class="ghost panel-quote">Quote</button></div>';
            document.body.appendChild(panel);
            return panel;
        }

        function attachSync(panel, mainQty, unit){
            if(!panel) return;
            const panelQty = panel.querySelector('.panel-qty-input');
            const totalEl = panel.querySelector('.total');
            const discountEl = panel.querySelector('.discount');
            const discountRow = panel.querySelector('.discount-row');
            function calc(fromPanel){
                const qty = parseInt(fromPanel?panelQty.value:(mainQty?mainQty.value:panelQty.value),10)||0;
                const total = Math.round(qty * unit);
                totalEl.textContent = total.toLocaleString('en-NG');
                if(qty>=200){ const d = Math.round(total*0.9); discountEl.textContent = d.toLocaleString('en-NG'); discountRow.style.display = 'flex'; } else { discountRow.style.display = 'none'; }
                if(mainQty && fromPanel) mainQty.value = panelQty.value;
                if(panelQty && !fromPanel && mainQty) panelQty.value = mainQty.value;
            }
            panelQty.addEventListener('input', ()=>calc(true));
            if(mainQty) mainQty.addEventListener('input', ()=>calc(false));
            calc(false);
            panel.querySelector('.panel-enquire').addEventListener('click', ()=>{ window.location.hash = '#squareBirthdayQuoteForm'; });
            panel.querySelector('.panel-quote').addEventListener('click', ()=>{ const f=document.getElementById('squareBirthdayQuoteForm'); if(f) f.scrollIntoView({behavior:'smooth'}); });
        }

        if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
        function run(){
            try{
                const mainQty = findQuantity();
                if(!mainQty) return;
                const unit = parseFloat(mainQty.getAttribute('data-unit-price') || mainQty.dataset.unitPrice || (document.querySelector('meta[property="og:price:amount"]') && document.querySelector('meta[property="og:price:amount"]').getAttribute('content')) || 0) || 0;
                if(!unit) return;
                if(window.innerWidth <= 991) return; // desktop only
                const panel = createPanel(unit);
                attachSync(panel, mainQty, unit);
            }catch(e){console.error('sticky inject', e)}
        }
    }catch(e){console.error('sticky panel init',e)}
})();

// Compact bottom banner: show on every page load until the user explicitly dismisses it
(function(){
    try{
        const DISMISS_KEY = 'inksnap_discount_popup_dismissed_v1';

        function shouldShow(){
            try{
                // Show unless the user has dismissed the banner explicitly
                return localStorage.getItem(DISMISS_KEY) !== '1';
            }catch(e){return true}
        }

        function markDismissed(){ try{ localStorage.setItem(DISMISS_KEY, '1'); }catch(e){} }

        function makeBanner(){
            const wrap = document.createElement('div'); wrap.className = 'discount-bottom-banner';
            const badge = document.createElement('div'); badge.className = 'badge'; badge.textContent = '10% OFF';
            const content = document.createElement('div'); content.className = 'content';
            const h = document.createElement('h4'); h.textContent = '10% off on bulk orders';
            const p = document.createElement('p'); p.innerHTML = 'Save <strong>10%</strong> on orders of <strong>200+</strong> copies — discount applied automatically.';
            content.appendChild(h); content.appendChild(p);
            const actions = document.createElement('div'); actions.className = 'actions';
            const primary = document.createElement('button'); primary.className = 'primary'; primary.textContent = 'Shop Now';
            // Do not mark dismissed on primary click so banner can reappear on other pages until closed
            primary.addEventListener('click', ()=>{ try{ wrap.remove(); window.location.href = window.location.pathname }catch(e){} });
            const close = document.createElement('button'); close.className = 'close'; close.innerHTML = '&times;'; close.addEventListener('click', ()=>{ try{ markDismissed(); wrap.remove() }catch(e){} });
            actions.appendChild(primary); actions.appendChild(close);
            wrap.appendChild(badge); wrap.appendChild(content); wrap.appendChild(actions);
            return wrap;
        }

        function showIfNeeded(){ if(!shouldShow()) return; const b = makeBanner(); document.body.appendChild(b); try{ b.querySelector('.primary').focus(); }catch(e){} }

        if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showIfNeeded); else showIfNeeded();
    }catch(e){console.error('banner init',e)}
})();

// WhatsApp notifier: show a short tooltip/pulse on the WhatsApp button on every page load
(function(){
    try{
        const NOTIFY_CLASS = 'whatsapp-notify';
        const SHOW_MS = 5000;

        function makeNotify(){
            const el = document.createElement('div');
            el.className = NOTIFY_CLASS;
            el.innerHTML = '<span class="pulse" aria-hidden="true"></span><span class="note">Chat with us on WhatsApp</span>';
            return el;
        }

        function attach(){
            // prefer our combined widget button, fallback to common selectors
            const btn = document.querySelector('.chat-widgets .whatsapp-btn') || document.querySelector('.whatsapp-float, .whatsapp-float a, .floating-whatsapp a, a[href*="wa.me"]');
            if(!btn) return;

            // ensure styles only added once
            if(!document.getElementById('whatsapp-notify-styles')){
                const s = document.createElement('style'); s.id = 'whatsapp-notify-styles';
                s.textContent = '\n.'+NOTIFY_CLASS+'{position:fixed;right:90px;bottom:86px;display:flex;align-items:center;gap:8px;pointer-events:none;z-index:100002}\n.'+NOTIFY_CLASS+' .pulse{width:12px;height:12px;border-radius:50%;background:#25D366;box-shadow:0 0 0 rgba(37,211,102,0.7);animation:wp-pulse 1.6s infinite}\n@keyframes wp-pulse{0%{transform:scale(0.9);box-shadow:0 0 0 0 rgba(37,211,102,0.6)}70%{transform:scale(1);box-shadow:0 0 0 14px rgba(37,211,102,0)}100%{transform:scale(0.9);box-shadow:0 0 0 0 rgba(37,211,102,0)}}\n.'+NOTIFY_CLASS+' .note{background:rgba(0,0,0,0.8);color:#fff;padding:6px 8px;border-radius:6px;font-size:0.9rem;pointer-events:auto}\n@media (max-width:480px){.'+NOTIFY_CLASS+'{right:74px;bottom:100px}}';
                document.head.appendChild(s);
            }

            // append to body so notifier is fixed relative to viewport (not stuck in footer)
            const notify = makeNotify();
            document.body.appendChild(notify);

            // auto-hide after SHOW_MS unless clicked
            let timeout = setTimeout(()=>{ try{ notify.remove(); }catch(e){} }, SHOW_MS);

            // remove notify if user clicks whatsapp link/button
            const clickTarget = btn.tagName === 'A' ? btn : (btn.querySelector('a') || btn);
            clickTarget.addEventListener('click', ()=>{ try{ notify.remove(); clearTimeout(timeout); }catch(e){} });
        }

        if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach); else attach();
    }catch(e){console.error('whatsapp notify', e)}
})();

/* Advanced social and upsell widgets removed per user request */
(function(){
    function initAll(){ try{ /* advanced social/upsell widgets disabled */ }catch(e){console.error('advanced init',e);} }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initAll); else initAll();
})();
