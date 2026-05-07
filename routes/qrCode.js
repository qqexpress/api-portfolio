const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  const { text, size = 200, format = 'png' } = req.query;
  if (!text) return res.status(400).json({ error: 'text parameter is required' });

  try {
    const encoded = encodeURIComponent(text);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&format=${format}`;

    const response = await fetch(qrUrl);
    if (!response.ok) return res.status(502).json({ error: 'Failed to generate QR code' });

    res.setHeader('Content-Type', `image/${format}`);
    response.body.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

router.get('/url', (req, res) => {
  const { text, size = 200, format = 'png' } = req.query;
  if (!text) return res.status(400).json({ error: 'text parameter is required' });

  const encoded = encodeURIComponent(text);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&format=${format}`;

  res.json({ qr_code_url: qrUrl, text, size: parseInt(size), format });
});

module.exports = router;
