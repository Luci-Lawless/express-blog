var bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
            args: [2, 50],
            msg: 'Please, enter a username between 2 and 50 characters.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      isEmail: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   len: {
      //       args: [8, 50],
      //       msg: 'Please, enter a password with at least 8 characters.'
      //   }
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
     models.user.hasMany(models.post);
  };
  return User;
};
