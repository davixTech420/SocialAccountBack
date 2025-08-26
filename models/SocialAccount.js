// models/SocialAccount.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

  const SocialAccount = sequelize.define("SocialAccount", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    platform: {
      type: DataTypes.ENUM("youtube", "facebook", "instagram", "tiktok"),
      allowNull: false
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    clientSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pageId: { // Facebook/Instagram lo necesitan
      type: DataTypes.STRING,
      allowNull: true
    },
    channelId: { // YouTube lo necesita
      type: DataTypes.STRING,
      allowNull: true
    },
    extraData: { // JSON con cualquier otro dato
      type: DataTypes.JSON,
      allowNull: true
    }
  });
 module.exports = SocialAccount;