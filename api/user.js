import fetch from 'node-fetch';

export default async (req, res) => {
  const { id } = req.query;
  const BOT_TOKEN = process.env.BOT_TOKEN; // Set this in your Vercel dashboard

  if (!id) {
    return res.status(400).json({ error: 'Missing user id' });
  }
  if (!BOT_TOKEN) {
    return res.status(500).json({ error: 'Bot token not set in environment variables' });
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/users/${id}`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user from Discord API' });
  }
};
