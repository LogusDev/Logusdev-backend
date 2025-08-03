import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL || "sqlite::memory:", {
  logging: false,
});

export default sequelize;
