// var sequelize = require('./index');
module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('comment', {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    comment_author: {
      type: DataTypes.STRING,
      notEmpty: true,
      allowNull: false
    },
    guest_email: {
      type: DataTypes.STRING,
      notEmpty: true,
      unique: true,
      isEmail: true,
      allowNull: false
    },
    comment_body: {
      type: DataTypes.TEXT,
      notEmpty: true,
      allowNull: false
    }
  });

  Comment.associate = function (models) {
     models.comment.belongsTo(models.post, {
       onDelete: "CASCADE",
       foreignKey: {
         allowNull: false
       }
     });
   };

   return Comment;
};
