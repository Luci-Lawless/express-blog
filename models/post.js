const Sequelize = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');
const User = require('./user');
const Comment = require('./comment');
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

Post.associate = function (models) {
   models.Post.belongsTo(models.User, {
     onDelete: "CASCADE",
     foreignKey: {
       allowNull: false
     }
   });
 };

 Post.associate = function(models) {
    models.Post.hasMany(models.Comment);
 };

// Create table
sequelize.sync()
  .then(() => console.log('Posts table created!'))
  .catch(error => console.log('An error has occured', error));

module.exports = {
  Post
}
