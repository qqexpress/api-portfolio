const express = require('express');
const fetch = require('node-fetch');
const { nanoid } = require('nanoid');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => res.json({ name: 'API Portfolio', version: '1.0.0' }));

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });
  try {
    const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7');
    const d = await r.json();
    res.json({ current: d.current_weather, forecast: d.daily, timezone: d.timezone });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/air-quality', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });
  try {
    const r = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + lat + '&longitude=' + lon + '&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone&timezone=auto');
    const d = await r.json();
    res.json({ location: { lat, lon }, current: d.current, timezone: d.timezone });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/uv-index', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });
  try {
    const r = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + lat + '&longitude=' + lon + '&current=uv_index&timezone=auto');
    const d = await r.json();
    const uv = d.current.uv_index;
    const level = uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : uv <= 7 ? 'High' : uv <= 10 ? 'Very High' : 'Extreme';
    res.json({ uv_index: uv, risk_level: level, time: d.current.time });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/exchange-rates', async (req, res) => {
  const base = req.query.base || 'USD';
  const target = req.query.target;
  try {
    const r = await fetch('https://api.frankfurter.app/latest?base=' + base.toUpperCase());
    const d = await r.json();
    if (target) return res.json({ base: d.base, target: target.toUpperCase(), rate: d.rates[target.toUpperCase()], date: d.date });
    res.json(d);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/exchange-rates/historical', async (req, res) => {
  const base = req.query.base || 'USD';
  const date = req.query.date;
  if (!date) return res.status(400).json({ error: 'date required (YYYY-MM-DD)' });
  try {
    const r = await fetch('https://api.frankfurter.app/' + date + '?base=' + base.toUpperCase());
    const d = await r.json();
    res.json(d);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/crypto', async (req, res) => {
  const coin = req.query.coin || 'bitcoin';
  const currency = req.query.currency || 'usd';
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/coins/' + coin.toLowerCase());
    if (!r.ok) return res.status(404).json({ error: 'Coin not found' });
    const d = await r.json();
    res.json({ id: d.id, name: d.name, symbol: d.symbol.toUpperCase(), price: d.market_data.current_price[currency], market_cap: d.market_data.market_cap[currency], change_24h: d.market_data.price_change_percentage_24h });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/crypto/top', async (req, res) => {
  const limit = req.query.limit || 10;
  const currency = req.query.currency || 'usd';
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=' + currency + '&order=market_cap_desc&per_page=' + limit + '&page=1');
    const d = await r.json();
    res.json(d.map(function(c) { return { rank: c.market_cap_rank, name: c.name, symbol: c.symbol.toUpperCase(), price: c.current_price, change_24h: c.price_change_percentage_24h }; }));
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/sports/football', async (req, res) => {
  const league = req.query.league || 39;
  try {
    const r = await fetch('https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=' + league + '&s=2023-2024');
    const d = await r.json();
    if (!d.table) return res.status(404).json({ error: 'League not found' });
    res.json({ league_id: league, standings: d.table.map(function(t) { return { position: t.intRank, team: t.strTeam, played: t.intPlayed, points: t.intPoints }; }) });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/news', async (req, res) => {
  const lang = req.query.lang || 'en';
  const country = req.query.country || 'us';
  const topic = req.query.topic || '';
  try {
    let url = 'https://gnews.io/api/v4/top-headlines?lang=' + lang + '&country=' + country + '&max=10&apikey=demo';
    if (topic) url += '&topic=' + topic;
    const r = await fetch(url);
    const d = await r.json();
    if (!d.articles) return res.status(502).json({ error: 'News API limit reached. Get a free key at gnews.io' });
    res.json({ total: d.totalArticles, articles: d.articles });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/ip-lookup', async (req, res) => {
  const ip = req.query.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  try {
    const r = await fetch('http://ip-api.com/json/' + ip + '?fields=status,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,query');
    const d = await r.json();
    if (d.status === 'fail') return res.status(400).json({ error: 'Invalid IP' });
    res.json(d);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/qr-code', (req, res) => {
  const text = req.query.text;
  const size = req.query.size || 200;
  if (!text) return res.status(400).json({ error: 'text required' });
  const url = 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size + '&data=' + encodeURIComponent(text);
  res.json({ qr_code_url: url, text: text, size: size });
});

app.get('/facts/random', async (req, res) => {
  try {
    const r = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const d = await r.json();
    res.json({ fact: d.text });
  } catch (e) { res.json({ fact: 'The moon is moving away from Earth at 3.8cm per year.' }); }
});

app.get('/facts/category', (req, res) => {
  const cat = req.query.category || 'all';
  const facts = {
    space: ['A day on Venus is longer than a year on Venus.', 'One million Earths could fit inside the Sun.', 'Neutron stars can spin 600 times per second.'],
    cats: ['Cats sleep 12-16 hours per day.', 'A group of cats is called a clowder.', 'Cats have 32 muscles in each ear.'],
    history: ['Oxford University is older than the Aztec Empire.', 'The Viking Age lasted about 300 years.', 'Cleopatra lived closer to the Moon landing than to the pyramids.']
  };
  const list = facts[cat] || [].concat(facts.space, facts.cats, facts.history);
  res.json({ fact: list[Math.floor(Math.random() * list.length)], category: cat });
});

app.get('/holidays', async (req, res) => {
  const country = req.query.country || 'IE';
  const year = req.query.year || new Date().getFullYear();
  try {
    const r = await fetch('https://date.nager.at/api/v3/PublicHolidays/' + year + '/' + country.toUpperCase());
    if (!r.ok) return res.status(404).json({ error: 'Country not found' });
    const d = await r.json();
    res.json({ country: country.toUpperCase(), year: year, total: d.length, holidays: d });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/timezone', async (req, res) => {
  const tz = req.query.timezone || 'UTC';
  try {
    const r = await fetch('http://worldtimeapi.org/api/timezone/' + tz);
    if (!r.ok) return res.status(404).json({ error: 'Timezone not found' });
    const d = await r.json();
    res.json({ timezone: d.timezone, datetime: d.datetime, utc_offset: d.utc_offset, dst: d.dst });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/vat-rates', async (req, res) => {
  const country = req.query.country;
  try {
    const url = country ? 'https://vatcomply.com/rates?country_code=' + country.toUpperCase() : 'https://vatcomply.com/rates';
    const r = await fetch(url);
    const d = await r.json();
    res.json(d);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

const urlStore = {};
app.post('/url-shortener/shorten', (req, res) => {
  const url = req.body.url;
  if (!url) return res.status(400).json({ error: 'url required' });
  const id = nanoid(7);
  urlStore[id] = { original: url, clicks: 0, created_at: new Date().toISOString() };
  res.json({ short_url: 'https://' + req.headers.host + '/url-shortener/r/' + id, original_url: url });
});
app.get('/url-shortener/r/:id', (req, res) => {
  const e = urlStore[req.params.id];
  if (!e) return res.status(404).json({ error: 'Not found' });
  e.clicks++;
  res.redirect(e.original);
});

app.get('/world-cup/info', (req, res) => {
  res.json({ tournament: 'FIFA World Cup 2026', hosts: ['USA', 'Canada', 'Mexico'], start: 'June 11 2026', final: 'July 19 2026', total_teams: 48, total_matches: 104, final_venue: 'MetLife Stadium, New Jersey', defending_champion: 'Argentina' });
});
app.get('/world-cup/groups', (req, res) => {
  res.json({ groups: { A: ['Qatar','Ecuador','Senegal','Netherlands'], B: ['England','Iran','USA','Wales'], C: ['Argentina','Saudi Arabia','Mexico','Poland'], D: ['France','Australia','Denmark','Tunisia'], E: ['Spain','Costa Rica','Germany','Japan'], F: ['Belgium','Canada','Morocco','Croatia'], G: ['Brazil','Serbia','Switzerland','Cameroon'], H: ['Portugal','Ghana','Uruguay','South Korea'] } });
});
app.get('/world-cup/venues', (req, res) => {
  res.json({ venues: [ { stadium: 'MetLife Stadium', city: 'New York', country: 'USA', capacity: 82500 }, { stadium: 'AT&T Stadium', city: 'Dallas', country: 'USA', capacity: 80000 }, { stadium: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 87523 }, { stadium: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: 54500 } ] });
});
app.get('/world-cup/facts', (req, res) => {
  const facts = ['The 2026 World Cup is the first with 48 teams.', 'It is hosted by USA, Canada and Mexico.', 'MetLife Stadium hosts the final.', '104 matches will be played in total.', 'This is the first World Cup in North America since 1994.'];
  res.json({ fact: facts[Math.floor(Math.random() * facts.length)] });
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));
