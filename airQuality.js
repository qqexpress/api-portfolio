const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// GET /air-quality?lat=51.5&lon=-0.1
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' });

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,dust,uv_index&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();

    res.json({
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      current: {
        pm2_5: data.current.pm2_5,
        pm10: data.current.pm10,
        carbon_monoxide: data.current.carbon_monoxide,
        nitrogen_dioxide: data.current.nitrogen_dioxide,
        ozone: data.current.ozone,
        dust: data.current.dust,
        uv_index: data.current.uv_index,
        time: data.current.time,
      },
      units: data.current_units,
      timezone: data.timezone,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch air quality data' });
  }
});

module.exports = router;
