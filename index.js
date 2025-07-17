const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

// Hardcoded OneSignal credentials (for demo; use env vars for production)
const ONESIGNAL_APP_ID = '431f196b-6ebd-43fa-a089-5450fa50f20d';
const ONESIGNAL_REST_API_KEY = 'cqkj6x2jduthnh3wcrjo53mpm';

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('OneSignal Notification Backend is running!');
});

app.post('/send-notification', async (req, res) => {
  const { playerId, title, message } = req.body;
  if (!playerId || !title || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        include_player_ids: [playerId],
        headings: { en: title },
        contents: { en: message },
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`OneSignal backend running on port ${PORT}`);
});
