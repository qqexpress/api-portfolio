const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// GET /sports/football?league=39  (39 = Premier League)
// GET /sports/football/teams?league=39
router.get('/football', async (req, res) => {
  const { league = 39 } = req.query;
  try {
    const url = `https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${league}&s=2023-2024`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.table) return res.status(404).json({ error: 'League not found or no data available' });

    res.json({
      league_id: league,
      season: '2023-2024',
      standings: data.table.map(t => ({
        position: t.intRank,
        team: t.strTeam,
        played: t.intPlayed,
        won: t.intWin,
        drawn: t.intDraw,
        lost: t.intLoss,
        goals_for: t.intGoalsFor,
        goals_against: t.intGoalsAgainst,
        goal_difference: t.intGoalDifference,
        points: t.intPoints,
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch football data' });
  }
});

// GET /sports/nba?team=lakers
router.get('/nba', async (req, res) => {
  const { team } = req.query;
  try {
    let url = 'https://www.balldontlie.io/api/v1/teams';
    if (team) url += `?search=${team}`;
    const response = await fetch(url);
    const data = await response.json();

    res.json({
      teams: data.data.map(t => ({
        id: t.id,
        name: t.full_name,
        abbreviation: t.abbreviation,
        city: t.city,
        conference: t.conference,
        division: t.division,
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch NBA data' });
  }
});

module.exports = router;
