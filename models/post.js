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
// Post.belongsTo(User);
// // force: true will drop the table if it already exists
// Post.sync({force: true}).then(() => {
//   // Table created
//   return Post.create({
//     title: Post.addTitle,
//     post: Post.addPost
//   });
// });

sequelize.sync();

module.exports = {
  Post
}
