# API Portfolio

A collection of 14 data APIs ready to sell on RapidAPI.

## Endpoints

### 🌍 Weather & Environment
- `GET /weather?lat=51.5&lon=-0.1` — Current weather + 7-day forecast
- `GET /air-quality?lat=51.5&lon=-0.1` — PM2.5, PM10, CO, NO2, Ozone
- `GET /uv-index?lat=51.5&lon=-0.1` — UV index + risk level + hourly forecast

### 💱 Finance & Crypto
- `GET /exchange-rates?base=USD&target=EUR` — Live currency rates
- `GET /exchange-rates/historical?base=USD&date=2024-01-01` — Historical rates
- `GET /crypto?coin=bitcoin` — Crypto price, market cap, 24h change
- `GET /crypto/top?limit=10` — Top 10 coins by market cap

### ⚽ Sports
- `GET /sports/football?league=39` — Football standings (39 = Premier League)
- `GET /sports/nba?team=lakers` — NBA team info

### 📰 News
- `GET /news?topic=technology&lang=en&country=us` — Top headlines

### 🛠️ Utilities
- `GET /ip-lookup?ip=8.8.8.8` — IP geolocation + ISP info
- `GET /qr-code?text=https://example.com&size=200` — QR code image
- `GET /qr-code/url?text=https://example.com` — QR code URL
- `GET /facts/random` — Random fun fact
- `GET /facts/category?category=space` — Facts by category
- `GET /holidays?country=IE&year=2025` — Public holidays by country
- `GET /holidays/countries` — All supported countries
- `GET /timezone?timezone=Europe/Dublin` — Current time in timezone
- `GET /timezone/list` — All timezones
- `GET /vat-rates?country=IE` — EU VAT rates
- `GET /vat-rates/validate?vat_number=IE6388047V` — VAT number validation
- `POST /url-shortener/shorten` — Shorten a URL
- `GET /url-shortener/r/:id` — Redirect short URL
- `GET /url-shortener/stats/:id` — Click stats

## Deployment

1. Push this repo to GitHub
2. Connect to Render.com (free tier)
3. Set start command: `node index.js`
4. List each endpoint group on RapidAPI
