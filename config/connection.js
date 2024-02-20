const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASS,
  {
    host: 'localhost',
    dialect: 'postgres',
    port: 5433
  }
);

module.exports = sequelize;