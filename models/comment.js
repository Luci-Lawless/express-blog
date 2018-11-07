const Sequelize = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');
const Post = require('./post');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  storage: './session.postgres'
});

const Comment = sequelize.define('comment', {
  comment_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  comment_body: {
    type: Sequelize.TEXT,
    notEmpty: true,
    allowNull: false
  }
});

Comment.associate = function (models) {
   models.Comment.belongsTo(models.Post, {
     onDelete: "CASCADE",
     foreignKey: {
       allowNull: false
     }
   });
 };

// Create table
sequelize.sync()
  .then(() => console.log('Comment table created!'))
  .catch(error => console.log('An error has occured', error));

module.exports = {
  Comment
}
