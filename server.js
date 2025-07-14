const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));

app.get('/api/get-id', async (req, res) => {
  const link = req.query.link;
  if (!link) return res.status(400).json({ error: 'Thiếu link' });

  try {
    const response = await axios.get(link, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const fbMeta = $('meta[property="al:android:url"]').attr('content');
    const fbId = fbMeta?.match(/id=(\d{5,})/)?.[1];
    const tiktokId = html.match(/"id":"(\d{5,})"/)?.[1];

    const finalId = fbId || tiktokId;
    res.json({ id: finalId || null });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi gọi đến link' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
