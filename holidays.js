const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// GET /holidays?country=IE&year=2025
router.get('/', async (req, res) => {
  const { country = 'IE', year = new Date().getFullYear() } = req.query;

  try {
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${country.toUpperCase()}`;
    const response = await fetch(url);

    if (!response.ok) return res.status(404).json({ error: `No holidays found for country "${country}"` });

    const data = await response.json();

    res.json({
      country: country.toUpperCase(),
      year: parseInt(year),
      total: data.length,
      holidays: data.map(h => ({
        date: h.date,
        name: h.name,
        local_name: h.localName,
        type: h.types,
        global: h.global,
        counties: h.counties || null,
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch holidays' });
  }
});

// GET /holidays/countries - list all supported countries
router.get('/countries', async (req, res) => {
  try {
    const url = 'https://date.nager.at/api/v3/AvailableCountries';
    const response = await fetch(url);
    const data = await response.json();
    res.json({ total: data.length, countries: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch supported countries' });
  }
});

module.exports = router;
