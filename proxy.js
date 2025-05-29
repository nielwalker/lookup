const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 5000;

// Replace with your actual bot token
const BOT_TOKEN = 'MTM3NzcxMDU5NjkyMDcwOTI0Mg.G1EP4L.tZK-iGbcxxgkewBnxktoz_mdt1lRISRp-8eYIU';

app.get('/api/user/:id', async (req, res) => {
  const userId = req.params.id;
  const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` }
  });
  const data = await response.json();
  res.json(data);
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
