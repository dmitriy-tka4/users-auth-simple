import express from 'express';
import nunjucks from 'nunjucks';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import indexRoute from './routes/index.route.js';
import signupRoute from './routes/signup.route.js';
import loginRoute from './routes/login.route.js';
import profileRoute from './routes/profile.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('views', path.resolve(__dirname, 'views'));
nunjucks.configure('views', {
  express: app,
  noCache: true // for dev
});
app.set('view engine', 'njk');

app.use('/', indexRoute);
app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/profile', profileRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let error = new Error('Not found');
  error.status = 404;

  next(error);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  // err.status - нет, сейчас всегда статус 500
  // статус добавляет пакет http-errors (кт не используется сейчас для генерации ошибок)
  // можно добавить его вручную
  // e.status = 404;

  // render the error page
  res.render('error.njk', { error: err });
});

const start = async () => {
  await mongoose.connect('mongodb://localhost:27017/users3');

  app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
};

start();
