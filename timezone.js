const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// GET /timezone?timezone=Europe/Dublin
router.get('/', async (req, res) => {
  const { timezone = 'UTC' } = req.query;

  try {
    const url = `http://worldtimeapi.org/api/timezone/${timezone}`;
    const response = await fetch(url);

    if (!response.ok) return res.status(404).json({ error: `Timezone "${timezone}" not found` });

    const data = await response.json();

    res.json({
      timezone: data.timezone,
      datetime: data.datetime,
      date: data.datetime.split('T')[0],
      time: data.datetime.split('T')[1].split('.')[0],
      utc_offset: data.utc_offset,
      utc_datetime: data.utc_datetime,
      day_of_week: data.day_of_week,
      day_of_year: data.day_of_year,
      week_number: data.week_number,
      dst: data.dst,
      dst_offset: data.dst_offset,
      unix_time: data.unixtime,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timezone data' });
  }
});

// GET /timezone/list - all available timezones
router.get('/list', async (req, res) => {
  try {
    const url = 'http://worldtimeapi.org/api/timezone';
    const response = await fetch(url);
    const data = await response.json();
    res.json({ total: data.length, timezones: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timezone list' });
  }
});

module.exports = router;
