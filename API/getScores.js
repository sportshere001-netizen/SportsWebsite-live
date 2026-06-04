export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET');

  const CRICKET_KEY = process.env.CRICKET_API_KEY;
  const FOOTBALL_KEY = process.env.FOOTBALL_API_KEY;

  try {
    const { sport } = request.query;

    if (sport === 'cricket') {
      const res = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${CRICKET_KEY}&offset=0`);
      const data = await res.json();
      return response.status(200).json({ status: "success", matches: data.data || [] });
    }

    if (sport === 'football') {
      const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
        method: 'GET',
        headers: {
          'x-rapidapi-key': FOOTBALL_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      });
      const data = await res.json();
      return response.status(200).json({ status: "success", matches: data.response || [] });
    }

    if (sport === 'nba') {
      const res = await fetch('https://balldontlie.io/api/v1/games?per_page=5');
      const data = await res.json();
      return response.status(200).json({ status: "success", matches: data.data || [] });
    }

    return response.status(400).json({ error: "Invalid sport selection" });
  } catch (error) {
    return response.status(500).json({ error: "Failed to grab live dashboard data" });
  }
}