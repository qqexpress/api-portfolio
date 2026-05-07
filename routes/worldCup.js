const express = require('express');
const router = express.Router();

const groups = {
  A: { teams: ['Qatar', 'Ecuador', 'Senegal', 'Netherlands'] },
  B: { teams: ['England', 'Iran', 'USA', 'Wales'] },
  C: { teams: ['Argentina', 'Saudi Arabia', 'Mexico', 'Poland'] },
  D: { teams: ['France', 'Australia', 'Denmark', 'Tunisia'] },
  E: { teams: ['Spain', 'Costa Rica', 'Germany', 'Japan'] },
  F: { teams: ['Belgium', 'Canada', 'Morocco', 'Croatia'] },
  G: { teams: ['Brazil', 'Serbia', 'Switzerland', 'Cameroon'] },
  H: { teams: ['Portugal', 'Ghana', 'Uruguay', 'South Korea'] },
};

const venues = [
  { stadium: 'MetLife Stadium', city: 'New York/New Jersey', country: 'USA', capacity: 82500 },
  { stadium: 'AT&T Stadium', city: 'Dallas', country: 'USA', capacity: 80000 },
  { stadium: 'SoFi Stadium', city: 'Los Angeles', country: 'USA', capacity: 70240 },
  { stadium: 'Hard Rock Stadium', city: 'Miami', country: 'USA', capacity: 65326 },
  { stadium: 'Levi\'s Stadium', city: 'San Francisco', country: 'USA', capacity: 68500 },
  { stadium: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', capacity: 76416 },
  { stadium: 'Gillette Stadium', city: 'Boston', country: 'USA', capacity: 65878 },
  { stadium: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', capacity: 69796 },
  { stadium: 'Seattle Sounders FC Stadium', city: 'Seattle', country: 'USA', capacity: 72000 },
  { stadium: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: 54500 },
  { stadium: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: 45736 },
  { stadium: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 87523 },
  { stadium: 'Estadio AKRON', city: 'Guadalajara', country: 'Mexico', capacity: 49850 },
  { stadium: 'Estadio Monterrey', city: 'Monterrey', country: 'Mexico', capacity: 51350 },
];

const facts = [
  "The 2026 FIFA World Cup will be the first to feature 48 teams, up from 32.",
  "It is jointly hosted by USA, Canada, and Mexico — the first World Cup with 3 host nations.",
  "The tournament runs from June 11 to July 19, 2026.",
  "MetLife Stadium in New Jersey will host the final.",
  "104 matches will be played in total across 16 host cities.",
  "Brazil holds the record for most World Cup wins with 5 titles.",
  "The expanded format means 104 games, up from 64 in previous tournaments.",
  "This will be the first World Cup held in North America since 1994.",
];

// GET /world-cup/groups
router.get('/groups', (req, res) => {
  res.json({
    tournament: 'FIFA World Cup 2026',
    hosts: ['USA', 'Canada', 'Mexico'],
    dates: { start: '2026-06-11', final: '2026-07-19' },
    total_teams: 48,
    groups,
  });
});

// GET /world-cup/groups/:id
router.get('/groups/:id', (req, res) => {
  const group = groups[req.params.id.toUpperCase()];
  if (!group) return res.status(404).json({ error: 'Group not found. Valid groups: A-H' });
  res.json({ group: req.params.id.toUpperCase(), ...group });
});

// GET /world-cup/venues
router.get('/venues', (req, res) => {
  const { country } = req.query;
  const filtered = country
    ? venues.filter(v => v.country.toLowerCase() === country.toLowerCase())
    : venues;
  res.json({ total: filtered.length, venues: filtered });
});

// GET /world-cup/facts
router.get('/facts', (req, res) => {
  const fact = facts[Math.floor(Math.random() * facts.length)];
  res.json({ fact, tournament: 'FIFA World Cup 2026' });
});

// GET /world-cup/info
router.get('/info', (req, res) => {
  res.json({
    tournament: 'FIFA World Cup 2026',
    hosts: ['USA', 'Canada', 'Mexico'],
    dates: { start: 'June 11, 2026', final: 'July 19, 2026' },
    total_teams: 48,
    total_matches: 104,
    host_cities: 16,
    final_venue: 'MetLife Stadium, New York/New Jersey',
    defending_champion: 'Argentina',
    first_expanded_tournament: true,
  });
});

module.exports = router;
