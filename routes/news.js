const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  const { topic, lang = 'en', country = 'us', max = 10 } = req.query;

  try {
    let url = `https://gnews.io/api/v4/top-headlines?lang=${lang}&country=${country}&max=${max}&apikey=demo`;
    if (topic) url += `&topic=${topic}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.articles) {
      return res.status(502).json({
        error: 'News API limit reached or invalid parameters.',
        tip: 'Sign up for a free GNews API key at gnews.io and set GNEWS_API_KEY in environment variables.',
      });
    }

    res.json({
      total: data.totalArticles,
      articles: data.articles.map(a => ({
        title: a.title,
        description: a.description,
        source: a.source.name,
        url: a.url,
        published_at: a.publishedAt,
        image: a.image,
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
