const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const VIDEOS_DIR = path.join(__dirname, '..', 'videos');

app.post('/write', async (req, res) => {
  const { filename, content } = req.body;
  try {
    await fs.writeFile(path.join(VIDEOS_DIR, filename), content);
    res.json({ message: 'File written successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error writing file' });
  }
});

app.get('/read/:filename', async (req, res) => {
  try {
    const content = await fs.readFile(path.join(VIDEOS_DIR, req.params.filename), 'utf8');
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Error reading file' });
  }
});

app.listen(3003, () => console.log('File system service running on port 3003'));