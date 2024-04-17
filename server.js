const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies

// Serve static files from the 'public' folder.
app.use(express.static('public'));

// view engine setup
app.set('view engine', 'ejs');
app

app.get('/', (req, res) => {
    res.render('index');
});










const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

