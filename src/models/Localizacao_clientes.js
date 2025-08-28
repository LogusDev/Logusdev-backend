import { DataTypes, Sequelize } from "sequelize";  
import sequelize from "../database/conexao_database.js"; 
import Cliente from "./Cliente.js";

const Lc = sequelize.define('localizacao_clientes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    latitude: {
        type: DataTypes.DECIMAL(10, 8)
    },

    longitude: {
        type: DataTypes.DECIMAL(10, 8)
    }
});

Cliente.hasOne(Lc, {
    foreignKey: "cliente_id",
    as: "loc_cliente"
});

Lc.belongsTo(Cliente, {
    foreignKey: "cliente_id",
    as: "cliente"
}),

{   timestamps: true,
    updatedAt: 'updated_at'
}

export default Lc;