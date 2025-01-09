const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/UserRoutes');
const { app, server } = require('./socket/index');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// const app = express();

app.use(cors({ credentials: true, origin: ['https://sonorous.vercel.app', 'http://localhost:3000'] }));

// Use fileUpload middleware before bodyParser
app.use(fileUpload());

// Set larger limits for JSON payloads
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Cookie parser must come after body parsers
app.use(cookieParser());

// Your routes and other middlewares
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: "server running at " + PORT });
});
app.use('/api', router);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("server running at " + PORT);
  });
});
