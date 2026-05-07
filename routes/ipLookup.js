const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  const ip = req.query.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const url = `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'fail') {
      return res.status(400).json({ error: data.message || 'Invalid IP address' });
    }

    res.json({
      ip: data.query,
      country: data.country,
      country_code: data.countryCode,
      region: data.regionName,
      city: data.city,
      zip: data.zip,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      isp: data.isp,
      org: data.org,
      as: data.as,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to lookup IP' });
  }
});

module.exports = router;
