const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
app.use(cors());

const VIDEOS_DIR = path.join(__dirname, '..', 'videos');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'videodb',
});

app.post('/write', async (req, res) => {
  const { filename, content } = req.body;
  try {
    await fs.writeFile(path.join(VIDEOS_DIR, filename), content);
    res.json({ message: 'File written successfully' });
  } catch (error) {
    console.error('Error writing file:', error);
    res.status(500).json({ error: 'Error writing file' });
  }
});

app.get('/read/:filename', async (req, res) => {
  try {
    const content = await fs.readFile(path.join(VIDEOS_DIR, req.params.filename), 'utf8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Error reading file' });
  }
});

app.post('/cleanup', async (req, res) => {
  try {
    const files = await fs.readdir(VIDEOS_DIR);
    const [rows] = await pool.execute('SELECT * FROM videos');
    for (const row of rows) {
      if (!files.includes(row.filename)) {
        await pool.execute('DELETE FROM videos WHERE id = ?', [row.id]);
        console.log(`Deleted record for missing file: ${row.filename}`);
      }
    }
    res.json({ message: 'Cleanup completed successfully' });
  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({ error: 'Error during cleanup' });
  }
});

const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`File system service running on port ${port}`));