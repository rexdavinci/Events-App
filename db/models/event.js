'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    description: DataTypes.STRING,
    date: DataTypes.DATE
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
    Event.belongsTo(models.User,{
      foreignKey: 'creator',
      onDelete: 'cascade',
      constraints: false
    })

    Event.belongsToMany(models.User, {
      through: 'Booking',
      foreignKey: 'bookedEvent',
      as: 'bookers',
      constraints: false
    })
  };
  return Event;
};