const Sequelize = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');
const bcrypt = require('bcrypt');
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
}, {
  hooks: {
    beforeCreate: (user) => {
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(user.password, salt);
    }
  }
});
User.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password,this.password)
}

User.associate = function(models) {
   models.User.hasMany(models.Post);
};

// Create table
sequelize.sync()
  .then(() => console.log('Users table created!'))
  .catch(error => console.log('An error has occured', error));

module.exports = User;
