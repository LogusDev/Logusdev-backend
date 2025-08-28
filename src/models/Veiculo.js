import { DataTypes, Sequelize } from "sequelize";  
import sequelize from "../database/conexao_database.js"; 
import Cliente from "./Cliente.js";

const Veiculo = sequelize.define("veiculo", {
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
    }
}, {
    timestamps: false 
});


Cliente.hasOne(Veiculo, {
    foreignKey: "cliente_id",
    as: "veiculo"
});

Veiculo.belongsTo(Cliente, {
    foreignKey: "cliente_id",
    as: "cliente"
});

export default Veiculo;
