import { DataTypes, Sequelize } from "sequelize";  
import sequelize from "../database/conexao_database.js"; 
import Guincheiro from "./Guincheiro.js";

const ValoresGuincho = sequelize.define("valores_guincho", {
    idValor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    idGuincheiro: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    valorSaida: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    valorKm: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    dataRegistro: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }

}, {
    tableName: 'ValoresGuincho',
    timestamps: false
});

ValoresGuincho.belongsTo(Guincheiro, {
    foreignKey: 'idGuincheiro',
    as: 'guincheiro'
});

Guincheiro.hasMany(ValoresGuincho, {
    foreignKey: 'idGuincheiro',
    as: 'valoresGuincho'
});

export default ValoresGuincho;

