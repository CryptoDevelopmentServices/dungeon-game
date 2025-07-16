import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  walletAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
