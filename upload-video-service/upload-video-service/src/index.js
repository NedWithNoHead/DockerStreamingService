const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'videos/' });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }

  const { filename, originalname } = req.file;
  const newPath = path.join('videos', originalname);

  fs.renameSync(req.file.path, newPath);

  try {
    await pool.execute(
      'INSERT INTO videos (filename, originalname, path) VALUES (?, ?, ?)',
      [filename, originalname, newPath]
    );
    res.status(201).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving video information' });
  }
});

app.listen(3001, () => console.log('Upload service running on port 3001'));