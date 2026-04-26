const express = require('express');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.post('/generate', async (req, res) => {
  try {
    const { image } = req.body;

    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64, 'base64');

    const formData = new FormData();
    formData.append('image', imageBuffer, { filename: 'photo.jpg', contentType: 'image/jpeg' });
    formData.append('prompt', 'anime art portrait, studio ghibli style, detailed anime face, vibrant colors, cel shading');
    formData.append('negative_prompt', 'realistic, photo, blurry, ugly, deformed');
    formData.append('output_format', 'jpeg');

    console.log('Calling Stability AI...');

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/control/structure',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_KEY}`,
          Accept: 'image/*',
          ...formData.getHeaders(),
        },
        responseType: 'arraybuffer',
      }
    );

    const resultBase64 = `data:image/jpeg;base64,${Buffer.from(response.data).toString('base64')}`;
    console.log('Done!');
    res.json({ imageUrl: resultBase64 });

  } catch (error) {
    const msg = error.response ? error.response.data.toString() : error.message;
    console.error('Error:', msg);
    res.status(500).json({ error: msg });
  }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
