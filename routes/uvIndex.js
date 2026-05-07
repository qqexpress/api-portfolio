const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' });

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=uv_index,uv_index_clear_sky&hourly=uv_index&timezone=auto&forecast_days=3`;
    const response = await fetch(url);
    const data = await response.json();

    const uvLevel = (uv) => {
      if (uv <= 2) return 'Low';
      if (uv <= 5) return 'Moderate';
      if (uv <= 7) return 'High';
      if (uv <= 10) return 'Very High';
      return 'Extreme';
    };

    res.json({
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      current: {
        uv_index: data.current.uv_index,
        uv_index_clear_sky: data.current.uv_index_clear_sky,
        risk_level: uvLevel(data.current.uv_index),
        time: data.current.time,
      },
      hourly_forecast: data.hourly.time.slice(0, 24).map((t, i) => ({
        time: t,
        uv_index: data.hourly.uv_index[i],
        risk_level: uvLevel(data.hourly.uv_index[i]),
      })),
      timezone: data.timezone,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch UV index data' });
  }
});

module.exports = router;
