const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

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
    const newFilename = filename + '.mp4';  
    fs.renameSync(path.join(__dirname, '../videos', filename), path.join(__dirname, '../videos', newFilename));
    const filePath = path.join('videos', newFilename);
  
    try {
      await pool.execute(
        'INSERT INTO videos (filename, originalname, path) VALUES (?, ?, ?)',
        [newFilename, originalname, filePath]
      );
      console.log('Uploaded file:', { filename: newFilename, originalname, path: filePath });
      res.status(201).json({ message: 'Video uploaded successfully' });
    } catch (error) {
      console.error('Error saving video information:', error);
      res.status(500).json({ error: 'Error saving video information' });
    }
  });

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Upload service running on port ${port}`));