const Sequelize = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');
const Post = require('./post');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  storage: './session.postgres'
});

const User = sequelize.define('user', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        isEmail: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

sequelize.sync();

module.exports = {
  User
};
