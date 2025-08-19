import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_USER, {
  logging: false,
});

export default sequelize;
