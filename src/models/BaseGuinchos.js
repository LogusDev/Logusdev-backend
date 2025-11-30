import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../database/conexao_database.js";

const BaseGuinchos = sequelize.define(
  "BaseGuinchos",
  {
    marca: DataTypes.STRING,
    modelo: DataTypes.STRING,
    ano_fabricacao: DataTypes.INTEGER,
    capacidade: DataTypes.DECIMAL,
    comprimento_plataforma: DataTypes.DECIMAL
  },
  {
    tableName: "baseGuinchos", 
    timestamps: false
  }
);


export default BaseGuinchos;

