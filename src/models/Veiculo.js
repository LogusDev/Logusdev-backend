import { DataTypes, ENUM, Sequelize } from "sequelize";  
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
        type: DataTypes.CHAR(8),
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
    categoria:{
        type:ENUM("sedan","suv","hatch","picape", "coupe", "van", "minivan", "perua"),
        allowNull:false
    },

    cor: {
        type: DataTypes.STRING(15),
        allowNull: true
    },

    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false
    },

    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "cliente_id" 
    }
    
}, {
    timestamps: false 
});


Cliente.hasMany(Veiculo, {
    foreignKey: "cliente_id",
    as: "veiculos"
});

Veiculo.belongsTo(Cliente, {
    foreignKey: "cliente_id",
    as: "cliente"
});

export default Veiculo;
