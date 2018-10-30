const Sequelize = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');
const User = require('./user');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  storage: './session.postgres'
});

const Post = sequelize.define('post', {
  post_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING
  },
  post: {
    type: Sequelize.TEXT
  }
});

sequelize.sync();

module.exports = {
  Post
}
