const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' });

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7`;
    const response = await fetch(url);
    const data = await response.json();

    res.json({
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      current: {
        temperature_c: data.current_weather.temperature,
        windspeed_kmh: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode,
        is_day: data.current_weather.is_day === 1,
        time: data.current_weather.time,
      },
      forecast_7_days: data.daily.time.map((date, i) => ({
        date,
        max_temp_c: data.daily.temperature_2m_max[i],
        min_temp_c: data.daily.temperature_2m_min[i],
        precipitation_mm: data.daily.precipitation_sum[i],
      })),
      timezone: data.timezone,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
