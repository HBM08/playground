require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const HttpError = require('./models/http-error');
const usersRouter = require('./routes/users-routes');
const healthRouter = require('./routes/health-route');
const { sequelize } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(healthRouter);
app.use('/api/users/', usersRouter);

app.use((req, res, next) => {
  throw new HttpError('Sorry, could not find this route.', 404);
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred.' });
});

sequelize
  .authenticate()
  .then(() => {
    console.log('DB connection has been established successfully.');
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}\n`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });