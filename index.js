const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/weather', require('./routes/weather'));
app.use('/air-quality', require('./routes/airQuality'));
app.use('/uv-index', require('./routes/uvIndex'));
app.use('/exchange-rates', require('./routes/exchangeRates'));
app.use('/crypto', require('./routes/crypto'));
app.use('/sports', require('./routes/sports'));
app.use('/news', require('./routes/news'));
app.use('/ip-lookup', require('./routes/ipLookup'));
app.use('/qr-code', require('./routes/qrCode'));
app.use('/facts', require('./routes/facts'));
app.use('/holidays', require('./routes/holidays'));
app.use('/timezone', require('./routes/timezone'));
app.use('/vat-rates', require('./routes/vatRates'));
app.use('/url-shortener', require('./routes/urlShortener'));

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'API Portfolio',
    version: '1.0.0',
    endpoints: [
      '/weather?lat=51.5&lon=-0.1',
      '/air-quality?lat=51.5&lon=-0.1',
      '/uv-index?lat=51.5&lon=-0.1',
      '/exchange-rates?base=USD&target=EUR',
      '/crypto?coin=bitcoin',
      '/sports/football?league=39',
      '/news?topic=technology&lang=en',
      '/ip-lookup?ip=8.8.8.8',
      '/qr-code?text=https://example.com',
      '/facts/random',
      '/holidays?country=IE&year=2025',
      '/timezone?timezone=Europe/Dublin',
      '/vat-rates?country=IE',
      '/url-shortener/shorten',
    ]
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
