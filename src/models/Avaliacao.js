import { DataTypes, Sequelize } from "sequelize";  
import sequelize from "../database/conexao_database.js"; 
import Cliente from "./Cliente.js";
import Chamado from "./Chamado.js";
import Guincheiro from "./Guincheiro.js";

const Avaliacao = sequelize.define("avaliacoes", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    nota: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },

    comentario: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },

    data_avaliacao: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
    }
},
    {
        tableName:'avaliacoes',
        timestamps:false
    });

Avaliacao.belongsTo(Guincheiro, {
    foreignKey: 'guincheiro_id',
    as: 'guincheiro'
});

Avaliacao.belongsTo(Cliente, {
    foreignKey: 'cliente_id',
    as: 'cliente'
});

Avaliacao.belongsTo(Chamado, {
    foreignKey: 'chamado_id',
    as: 'chamado'
});

export default Avaliacao

