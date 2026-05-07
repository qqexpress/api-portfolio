const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const urlStore = {};

router.post('/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url is required in request body' });

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const id = nanoid(7);
  urlStore[id] = { original: url, created_at: new Date().toISOString(), clicks: 0 };

  const host = req.headers.host;
  res.json({
    short_url: `https://${host}/url-shortener/r/${id}`,
    short_id: id,
    original_url: url,
    created_at: urlStore[id].created_at,
  });
});

router.get('/r/:id', (req, res) => {
  const entry = urlStore[req.params.id];
  if (!entry) return res.status(404).json({ error: 'Short URL not found' });
  entry.clicks++;
  res.redirect(entry.original);
});

router.get('/stats/:id', (req, res) => {
  const entry = urlStore[req.params.id];
  if (!entry) return res.status(404).json({ error: 'Short URL not found' });
  res.json({ id: req.params.id, ...entry });
});

module.exports = router;
