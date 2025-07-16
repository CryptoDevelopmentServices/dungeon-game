import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/advc_game.sqlite',
  logging: false,
});
