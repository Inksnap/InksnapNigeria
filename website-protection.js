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

    // --- Mockup injector: add Generate Mockup button + modal on pages that include this script ---
    document.addEventListener('DOMContentLoaded', function(){
        try{
            // don't inject if page already declares a mockup modal
            if(document.getElementById('mockupModal')) return;

            // find a logical insertion point: first form with type=submit or .order-form
            var insertionPoint = null;
            var forms = document.querySelectorAll('form');
            for(var i=0;i<forms.length;i++){
                var f = forms[i];
                if(f.querySelector('input[type=submit], button[type=submit]') || f.classList.contains('order-form')){ insertionPoint = f; break; }
            }
            if(!insertionPoint) return;

            // create button
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'openMockup';
            btn.textContent = 'Generate Mockup';
            btn.style.cssText = 'background:#2563eb;color:#fff;border:none;padding:10px 14px;border-radius:8px;cursor:pointer;margin-left:8px';

            // attempt to append near submit button
            var submit = insertionPoint.querySelector('input[type=submit], button[type=submit]');
            if(submit && submit.parentNode){ submit.parentNode.insertBefore(btn, submit.nextSibling); }
            else { insertionPoint.appendChild(btn); }

            // build modal HTML (same structure used elsewhere)
            var modal = document.createElement('div'); modal.id = 'mockupModal';
            modal.style.cssText = 'display:none;position:fixed;inset:0;z-index:2000;align-items:center;justify-content:center;background:rgba(0,0,0,0.6)';
            modal.innerHTML = '\n                <div style="width:92%;max-width:980px;height:84%;background:#0f1724;border-radius:10px;position:relative;overflow:hidden;box-shadow:0 18px 60px rgba(2,6,23,0.7);color:#fff;padding:18px">\n                    <button id="closeMockup" aria-label="Close mockup" style="position:absolute;top:12px;right:12px;z-index:20;background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.06);padding:8px 10px;border-radius:6px;cursor:pointer">Close</button>\n                    <div style="display:flex;gap:16px;height:100%">\n                        <div style="width:360px;padding:12px;border-right:1px solid rgba(255,255,255,0.04);overflow:auto">\n                            <h3 style="margin:0 0 8px">Generate Mockup</h3>\n                            <div style="font-size:13px;color:#cbd5e1;margin-bottom:12px">Upload your design and enter a short prompt describing the realistic style you want (e.g. "photoreal, soft shadow, high gloss").</div>\n                            <label style="font-size:13px;color:#9aa4b2">Upload design</label>\n                            <input id="modalUpload" type="file" accept="image/*" style="width:100%;margin-bottom:8px">\n                            <label style="font-size:13px;color:#9aa4b2">Prompt</label>\n                            <textarea id="mockupPrompt" rows="4" placeholder="e.g. photorealistic, soft shadow, high gloss, center" style="width:100%;padding:8px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,0.06);color:#e6eef8"></textarea>\n                            <label style="font-size:13px;color:#9aa4b2;margin-top:12px">Template</label>\n                            <select id="modalTpl" style="width:100%;padding:8px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,0.06);color:#e6eef8;margin-bottom:12px">\n                                <option value="paperbag">Paper Bag</option>\n                                <option value="poster">Poster</option>\n                                <option value="tshirt">T-Shirt</option>\n                                <option value="mug">Mug</option>\n                            </select>\n                            <div style="display:flex;gap:8px;margin-top:10px">\n                                <label style="display:flex;align-items:center;gap:8px;margin:0 8px 0 0;color:#cbd5e1">\n                                    <input id="useAI" type="checkbox" style="transform:scale(1.05)"> Use AI Edits\n                                </label>\n                                <button id="generateMockup" style="flex:1;background:#10b981;border:none;padding:10px;border-radius:8px;color:#fff;cursor:pointer">Generate</button>\n                                <button id="downloadMockup" style="background:transparent;border:1px solid rgba(255,255,255,0.06);padding:10px;border-radius:8px;color:#fff;cursor:pointer">Download</button>\n                            </div>\n                            <div style="font-size:12px;color:#9aa4b2;margin-top:14px">Note: For fully AI-driven image edits you'll need to connect an external image-edit API (not enabled here). This tool will composite your upload into the chosen template and apply prompt-driven visual tweaks as a fallback.</div>\n                        </div>\n                        <div style="flex:1;display:flex;flex-direction:column;gap:8px;padding:12px">\n                            <div style="flex:1;border-radius:8px;background:linear-gradient(180deg,#eef4fb,#fff);padding:8px;display:flex;align-items:center;justify-content:center;overflow:hidden">\n                                <div id="modalPreviewArea" style="width:100%;height:100%"></div>\n                            </div>\n                            <div style="display:flex;gap:8px;align-items:center;justify-content:flex-end">\n                                <button id="applyFilterDemo" style="background:transparent;border:1px solid rgba(0,0,0,0.06);padding:8px;border-radius:8px;cursor:pointer;color:#0f1724;background:#fff">Quick Style</button>\n                            </div>\n                        </div>\n                    </div>\n                </div>';

            document.body.appendChild(modal);

            // modal handlers
            var closeBtn = document.getElementById('closeMockup');
            closeBtn.addEventListener('click', function(){ modal.style.display='none'; document.body.style.overflow=''; });
            modal.addEventListener('click', function(e){ if(e.target === modal){ modal.style.display='none'; document.body.style.overflow=''; } });

            btn.addEventListener('click', function(){ modal.style.display='flex'; document.body.style.overflow='hidden'; });

            // wire generate/download logic (reuse server endpoint)
            var genBtn = document.getElementById('generateMockup');
            var downloadBtn = document.getElementById('downloadMockup');
            var uploadInput = document.getElementById('modalUpload');
            var promptInput = document.getElementById('mockupPrompt');
            var tplSelect = document.getElementById('modalTpl');
            var preview = document.getElementById('modalPreviewArea');
            var useAICheck = document.getElementById('useAI');

            function svgToPng(svgEl, cb){ try{ var serializer = new XMLSerializer(); var s = serializer.serializeToString(svgEl); var blob = new Blob([s], {type:'image/svg+xml;charset=utf-8'}); var url = URL.createObjectURL(blob); var img = new Image(); img.onload = function(){ var c = document.createElement('canvas'); c.width = svgEl.viewBox.baseVal.width; c.height = svgEl.viewBox.baseVal.height; var ctx = c.getContext('2d'); ctx.fillStyle='#f0f3f9'; ctx.fillRect(0,0,c.width,c.height); ctx.drawImage(img,0,0); URL.revokeObjectURL(url); cb(c); }; img.onerror = function(){ URL.revokeObjectURL(url); cb(null); }; img.src = url; }catch(err){ cb(null); } }

            function createTemplateSVG(name){ try{ var ns='http://www.w3.org/2000/svg'; var svg=document.createElementNS(ns,'svg'); svg.setAttribute('width','720'); svg.setAttribute('height','640'); svg.setAttribute('viewBox','0 0 720 640'); var defs=document.createElementNS(ns,'defs'); var clip=document.createElementNS(ns,'clipPath'); clip.setAttribute('id','mclip'); var rect=document.createElementNS(ns,'rect'); rect.setAttribute('x','160');rect.setAttribute('y','120');rect.setAttribute('width','400');rect.setAttribute('height','400');rect.setAttribute('rx','8'); clip.appendChild(rect); defs.appendChild(clip); svg.appendChild(defs); if(name==='paperbag'){ var bag=document.createElementNS(ns,'rect'); bag.setAttribute('x','120');bag.setAttribute('y','80');bag.setAttribute('width','480');bag.setAttribute('height','480');bag.setAttribute('fill','#fff');bag.setAttribute('rx','6');svg.appendChild(bag);} else if(name==='tshirt'){ var shirt=document.createElementNS(ns,'rect'); shirt.setAttribute('x','160');shirt.setAttribute('y','120');shirt.setAttribute('width','400');shirt.setAttribute('height','400');shirt.setAttribute('fill','#fff');svg.appendChild(shirt);} else if(name==='mug'){ var mug=document.createElementNS(ns,'rect'); mug.setAttribute('x','160');mug.setAttribute('y','200');mug.setAttribute('width','320');mug.setAttribute('height','240');mug.setAttribute('fill','#fff');svg.appendChild(mug);} else { var poster=document.createElementNS(ns,'rect'); poster.setAttribute('x','120');poster.setAttribute('y','80');poster.setAttribute('width','480');poster.setAttribute('height','480');poster.setAttribute('fill','#fff');svg.appendChild(poster);} var img=document.createElementNS(ns,'image'); img.setAttribute('id','mDesign'); img.setAttribute('x','160'); img.setAttribute('y','120'); img.setAttribute('width','400'); img.setAttribute('height','400'); img.setAttribute('clip-path','url(#mclip)'); svg.appendChild(img); return svg;}catch(e){return null;} }

            genBtn.addEventListener('click', async function(){
                var f = uploadInput.files && uploadInput.files[0];
                var prompt = promptInput.value || '';
                var tpl = tplSelect.value || 'paperbag';
                var useAI = useAICheck && useAICheck.checked;
                if(!f){ alert('Please upload your design first.'); return; }
                if(useAI){
                    try{
                        genBtn.disabled = true; genBtn.textContent = 'Generating...';
                        var form = new FormData(); form.append('image', f); form.append('prompt', prompt); form.append('template', tpl);
                        var apiEndpoint = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:3001/api/edit-image' : '/api/edit-image';
                        var resp = await fetch(apiEndpoint, { method: 'POST', body: form });
                        genBtn.disabled = false; genBtn.textContent = 'Generate';
                        if(!resp.ok){ var txt = await resp.text(); alert('AI edit failed: '+txt); return; }
                        var blob = await resp.blob(); var url = URL.createObjectURL(blob); var img = new Image(); img.onload = function(){ preview.innerHTML=''; preview.appendChild(img); URL.revokeObjectURL(url); }; img.src = url;
                    }catch(err){ genBtn.disabled = false; genBtn.textContent = 'Generate'; alert('AI request failed. Check server config.'); }
                    return;
                }
                // fallback
                var url = URL.createObjectURL(f); var img = new Image(); img.onload = function(){ var svg = createTemplateSVG(tpl); if(!svg){ alert('Preview failed'); return; } var svgImg = svg.querySelector('#mDesign'); svgImg.setAttributeNS('http://www.w3.org/1999/xlink','href', url); svgToPng(svg, function(canvas){ if(!canvas){ alert('Preview failed.'); return; } preview.innerHTML=''; preview.appendChild(canvas); URL.revokeObjectURL(url); }); }; img.onerror = function(){ alert('Could not load image.'); }; img.src = url;
            });

            downloadBtn.addEventListener('click', function(){ var cvs = preview.querySelector('canvas'); var img = preview.querySelector('img'); if(cvs){ var a = document.createElement('a'); a.href = cvs.toDataURL('image/png'); a.download = 'mockup.png'; a.click(); return; } if(img){ var c = document.createElement('canvas'); c.width = img.naturalWidth || 720; c.height = img.naturalHeight || 640; var ctx = c.getContext('2d'); ctx.drawImage(img,0,0,c.width,c.height); var a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'mockup.png'; a.click(); return; } alert('No generated mockup to download.'); });

            var demo = document.getElementById('applyFilterDemo'); if(demo) demo.addEventListener('click', function(){ promptInput.value = 'photoreal, soft shadow, high gloss'; });

        }catch(e){ console.error('mockup injector error', e); }
    });
})();
