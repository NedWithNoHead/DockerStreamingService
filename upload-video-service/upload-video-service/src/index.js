const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const upload = multer({ dest: 'videos/' });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'videodb',
});

app.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }

  const { filename, originalname } = req.file;
  const newPath = path.join('videos', originalname);

  try {
    await pool.execute(
      'INSERT INTO videos (filename, originalname, path) VALUES (?, ?, ?)',
      [filename, originalname, newPath]
    );
    res.status(201).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    console.error('Error saving video information:', error);
    res.status(500).json({ error: 'Error saving video information' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Upload service running on port ${port}`));