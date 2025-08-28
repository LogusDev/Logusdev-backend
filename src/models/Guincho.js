import { DataTypes, Sequelize } from "sequelize";  
import sequelize from "../database/conexao_database.js"; 
import Guincheiro from './Guincheiro.js'

const Guincho = sequelize.define("guincho", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    placa: {
        type: DataTypes.CHAR(7),
        allowNull: false
    },

    marca: {
        type: DataTypes.STRING(15),
        allowNull: false
    },

    modelo: {
        type: DataTypes.STRING(40),
        allowNull: false
    },

    ano_fabricacao: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    capacidade: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    comprimento_plataforma: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }

}, {
    timestamps: false
});

Guincheiro.hasOne(Guincho, {
    foreignKey: 'guincheiro_id',
    as: 'guincho'
});

Guincho.belongsTo(Guincheiro, {
    foreignKey: 'guincheiro_id',
    as: 'guincheiro'
});

export default Guincho;