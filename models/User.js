// models/SocialAccount.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
  });
 module.exports = User;