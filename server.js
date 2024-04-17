require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const File = require('./models/File');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies

const upload = multer({ dest: "uploads" })

const mongoURL = process.env.MONGODB_URI;

// Connect to MongoDB database using Mongoose
mongoose.connect(mongoURL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Serve static files from the 'public' folder.
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set('view engine', 'ejs');


// Routes

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', upload.single("file"), async (req, res) => {
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname,
        size: req.file.size,
    }
    if (req.body.password !== "" && req.body.password != null ) {
        fileData.password = await bcrypt.hash(req.body.password, 10);
    }
    const file = await File.create(fileData)

    res.render('index', { fileLink: `${req.headers.origin}/download/${file.id}` })
});

app.route('/download/:id').get(handleDownload).post(handleDownload);

async function handleDownload(req, res) {
    const file = await File.findById(req.params.id);
    if (file.password != null) {
        if (req.body.password == null) {
            res.render('password')
            return
        }

        if (!await bcrypt.compare(req.body.password, file.password)) {
            res.render('password', { error: true })
            return
        }
}
    file.downloadCount++;
    await file.save();
    res.download(file.path, file.originalName);
}
    










const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;

