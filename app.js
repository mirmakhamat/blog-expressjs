const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const http = require('http');
const config = require('config');
const mongoose = require('mongoose');

const router = require('./router.js');

const app = express();

app.use(fileUpload({}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const port = config.get('serverPort') || 3000
app.set('port', port);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(router)

const server = http.createServer(app);

const start = async () => {
  try {
    await mongoose.set('strictQuery', true);
    await mongoose.connect(config.get('MONGODB_URI'))
    server.listen(port);
    console.log(`Server ${port} da ishga tushdi`)
  } catch (e) {
    console.error('error', e)
  }
}

start();