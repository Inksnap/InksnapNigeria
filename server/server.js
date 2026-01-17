const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: path.join(__dirname, 'uploads/') });
const app = express();
app.use(express.json());

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// POST /api/edit-image
// Expects form-data: 'image' file, 'prompt' text, 'template' text
app.post('/api/edit-image', upload.single('image'), async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.IMAGE_API_KEY;
  if(!apiKey){
    return res.status(501).json({ error: 'No API key configured on server. Set OPENAI_API_KEY in .env.' });
  }

  if(!req.file){
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  const prompt = req.body.prompt || '';
  const template = req.body.template || '';

  // Example: forward to OpenAI Image Edit endpoint. Adjust per provider's API.
  try{
    const form = new FormData();
    form.append('image', fs.createReadStream(req.file.path));
    form.append('prompt', prompt + ' | apply to template: ' + template);
    // NOTE: This uses a hypothetical images/edits endpoint. Replace with your provider's API.
    const resp = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: form
    });

    if(!resp.ok){
      const text = await resp.text();
      return res.status(resp.status).send(text);
    }

    // Some providers return image data directly or an URL. Here we expect binary image data.
    const buffer = await resp.buffer();
    // send image as blob back to client
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  }catch(err){
    console.error('edit-image error', err);
    res.status(500).json({ error: 'Server error while calling image API.' });
  } finally {
    // cleanup temporary file
    if(req.file && req.file.path){ fs.unlink(req.file.path, ()=>{}); }
  }
});

const port = process.env.PORT || 3001;
app.listen(port, ()=> console.log('Mockup proxy server listening on', port));
