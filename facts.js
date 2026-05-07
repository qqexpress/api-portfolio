const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const catFacts = [
  "Cats sleep 12-16 hours per day.",
  "A group of cats is called a clowder.",
  "Cats have 32 muscles in each ear.",
  "A cat's nose print is unique, like a human fingerprint.",
  "Cats can jump up to six times their body length.",
];

const spaceFacts = [
  "A day on Venus is longer than a year on Venus.",
  "There are more stars in the universe than grains of sand on Earth.",
  "Neutron stars can spin 600 times per second.",
  "The footprints on the Moon will last 100 million years.",
  "One million Earths could fit inside the Sun.",
];

const historyFacts = [
  "The Great Wall of China took over 1,000 years to build.",
  "Cleopatra lived closer in time to the Moon landing than to the building of the pyramids.",
  "Oxford University is older than the Aztec Empire.",
  "The Viking Age lasted about 300 years.",
  "Ancient Romans used crushed mouse brains as toothpaste.",
];

const allFacts = [...catFacts, ...spaceFacts, ...historyFacts];

// GET /facts/random
router.get('/random', async (req, res) => {
  try {
    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const data = await response.json();
    res.json({ fact: data.text, source: 'uselessfacts' });
  } catch {
    const fact = allFacts[Math.floor(Math.random() * allFacts.length)];
    res.json({ fact, source: 'local' });
  }
});

// GET /facts/category?category=space
router.get('/category', (req, res) => {
  const { category = 'all' } = req.query;
  const map = { cats: catFacts, space: spaceFacts, history: historyFacts, all: allFacts };
  const list = map[category.toLowerCase()] || allFacts;
  const fact = list[Math.floor(Math.random() * list.length)];
  res.json({ fact, category, available_categories: ['cats', 'space', 'history', 'all'] });
});

module.exports = router;
