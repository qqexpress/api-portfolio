const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// GET /vat-rates?country=IE
router.get('/', async (req, res) => {
  const { country } = req.query;

  try {
    const url = country
      ? `https://vatcomply.com/rates?country_code=${country.toUpperCase()}`
      : 'https://vatcomply.com/rates';

    const response = await fetch(url);
    if (!response.ok) return res.status(404).json({ error: `VAT data not found for "${country}"` });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch VAT rates' });
  }
});

// GET /vat-rates/validate?vat_number=IE6388047V
router.get('/validate', async (req, res) => {
  const { vat_number } = req.query;
  if (!vat_number) return res.status(400).json({ error: 'vat_number is required' });

  try {
    const url = `https://vatcomply.com/vat?vat_number=${encodeURIComponent(vat_number)}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to validate VAT number' });
  }
});

module.exports = router;
