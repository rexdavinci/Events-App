'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Event,{
      foreignKey: 'creator',
      as: 'events',
      onDelete: 'cascade',
      constraints: false // alleviates cyclic dependencies due to db.sync(). It won't matter which table is created first now
    })

    User.belongsToMany(models.Event, {
      through: 'Booking',
      foreignKey: 'booker',
      as: 'booked'
    })
  };
  return User;
};
