import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_HOST || "sqlite::memory:", {
  logging: false,
});

export default sequelize;
