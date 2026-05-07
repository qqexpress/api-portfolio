const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// GET /crypto?coin=bitcoin
// GET /crypto/top?limit=10
// GET /crypto/price?coins=bitcoin,ethereum&currency=usd
router.get('/', async (req, res) => {
  const { coin = 'bitcoin', currency = 'usd' } = req.query;
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}`;
    const response = await fetch(url);
    if (!response.ok) return res.status(404).json({ error: `Coin "${coin}" not found` });
    const data = await response.json();

    res.json({
      id: data.id,
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      current_price: data.market_data.current_price[currency],
      currency: currency.toUpperCase(),
      market_cap: data.market_data.market_cap[currency],
      volume_24h: data.market_data.total_volume[currency],
      price_change_24h_pct: data.market_data.price_change_percentage_24h,
      price_change_7d_pct: data.market_data.price_change_percentage_7d,
      ath: data.market_data.ath[currency],
      atl: data.market_data.atl[currency],
      last_updated: data.last_updated,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch crypto data' });
  }
});

router.get('/top', async (req, res) => {
  const { limit = 10, currency = 'usd' } = req.query;
  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1`;
    const response = await fetch(url);
    const data = await response.json();

    res.json(data.map(c => ({
      rank: c.market_cap_rank,
      id: c.id,
      name: c.name,
      symbol: c.symbol.toUpperCase(),
      price: c.current_price,
      market_cap: c.market_cap,
      change_24h_pct: c.price_change_percentage_24h,
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top coins' });
  }
});

module.exports = router;
