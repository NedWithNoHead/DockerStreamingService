const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

const dir = 'file_system_service';

// creates the file system if it doesnt exist
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'file_system_service/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

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
  const filePath = path.join('file_system_service', filename);
  
  try {
    await pool.execute(
      'INSERT INTO file_system_service (filename, originalname, path) VALUES (?, ?, ?)',
      [filename, originalname, filePath]
    );
    console.log('Uploaded file:', { filename, originalname, path: filePath });
    res.status(201).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    console.error('Error saving video information:', error);
    res.status(500).json({ error: 'Error saving video information' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Upload service running on port ${port}`));