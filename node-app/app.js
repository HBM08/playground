require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

const Sequelize = require('sequelize');
const DISABLE_SEQUELIZE_DEFAULTS = {
  timestamps: false,
  freezeTableName: true,
};

const { DataTypes } = Sequelize;
const sequelize = new Sequelize({
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  host: process.env.DEV_HOST,
  port: process.env.DB_PORT,
  password: process.env.POSTGRES_PASSWORD,
  dialect: process.env.DB_TYPE
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