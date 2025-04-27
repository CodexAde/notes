const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'image_data');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const count = fs.readdirSync(path.join(__dirname, 'image_data')).length;
        const filename = count === 0 ? 'image' + ext : `image${count}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Store notes in memory (you might want to use a database in production)
const notes = {};

// Upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
        filename: req.file.filename,
        path: '/image_data/' + req.file.filename
    });
});

// Save notes endpoint
app.post('/save-notes', (req, res) => {
    const { imagePath, notes: noteText } = req.body;
    notes[imagePath] = noteText;
    res.json({ success: true });
});

// Get notes endpoint
app.get('/get-notes/:imagePath', (req, res) => {
    const noteText = notes[req.params.imagePath] || '';
    res.json({ notes: noteText });
});

// Get all images endpoint
app.get('/images', (req, res) => {
    const imageDir = path.join(__dirname, 'image_data');
    if (!fs.existsSync(imageDir)) {
        return res.json({ images: [] });
    }
    const images = fs.readdirSync(imageDir)
        .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
        .map(file => ({
            path: '/image_data/' + file,
            notes: notes['/image_data/' + file] || ''
        }));
    res.json({ images });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});