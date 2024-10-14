const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'videodb',
});

app.get('/videos', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM videos');
    res.json(rows);
  } catch (error) {
    console.error('Error retrieving videos:', error);
    res.status(500).json({ error: 'Error retrieving videos' });
  }
});

app.get('/video/:id', async (req, res) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM videos WHERE id = ?', [req.params.id]);
      if (rows.length === 0) {
        console.log(`Video not found for id: ${req.params.id}`);
        return res.status(404).json({ error: 'Video not found' });
      }
  
      console.log('Video record:', rows[0]);
  
      const videoPath = path.join(__dirname, '..', 'videos', rows[0].filename);
      console.log('Attempting to stream video from path:', videoPath);
  
      if (!fs.existsSync(videoPath)) {
        console.error('Video file does not exist:', videoPath);
        return res.status(404).json({ error: 'Video file not found' });
      }
  
      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;
  
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
        const chunksize = (end-start)+1;
        const file = fs.createReadStream(videoPath, {start, end});
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (error) {
      console.error('Error streaming video:', error);
      res.status(500).json({ error: 'Error streaming video', details: error.message });
    }
  });
  
const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Streaming service running on port ${port}`));