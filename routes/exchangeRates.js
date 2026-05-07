const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  const { base = 'USD', target } = req.query;
  try {
    const url = `https://api.frankfurter.app/latest?base=${base.toUpperCase()}`;
    const response = await fetch(url);
    const data = await response.json();

    if (target) {
      const rate = data.rates[target.toUpperCase()];
      if (!rate) return res.status(404).json({ error: `Currency ${target} not found` });
      return res.json({ base: data.base, target: target.toUpperCase(), rate, date: data.date });
    }

    res.json({ base: data.base, date: data.date, rates: data.rates });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
});

router.get('/historical', async (req, res) => {
  const { base = 'USD', target, date } = req.query;
  if (!date) return res.status(400).json({ error: 'date is required (YYYY-MM-DD)' });

  try {
    const url = `https://api.frankfurter.app/${date}?base=${base.toUpperCase()}`;
    const response = await fetch(url);
    const data = await response.json();

    if (target) {
      const rate = data.rates[target.toUpperCase()];
      if (!rate) return res.status(404).json({ error: `Currency ${target} not found` });
      return res.json({ base: data.base, target: target.toUpperCase(), rate, date: data.date });
    }

    res.json({ base: data.base, date: data.date, rates: data.rates });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch historical rates' });
  }
});

module.exports = router;
