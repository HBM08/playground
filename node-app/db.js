const Sequelize = require('sequelize');
const DISABLE_SEQUELIZE_DEFAULTS = {
  timestamps: false,
  freezeTableName: true,
};

const sequelize = new Sequelize({
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  host: process.env.DEV_HOST,
  port: process.env.DB_PORT,
  password: process.env.POSTGRES_PASSWORD,
  dialect: process.env.DB_TYPE
});

// automatically sync all models
sequelize.sync();

module.exports = { sequelize, Sequelize}