import { DataTypes } from "sequelize";
import Sequelize from "../database/conexao_database.js";
import Guincheiro from "./Guincheiro.js";
import Cliente from "./Cliente.js";
import Veiculo from "./Veiculo.js";

const Chamado = Sequelize.define("chamado", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    latitude_inicial: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
    },

    longitude_inicial: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
    },

    latitude_final: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
    },

    longitude_final: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
    },

    status_chamado: {
        type: DataTypes.ENUM("aguardando", "em andamento", "cancelado", "concluído"),
        allowNull: false
    },

    descricao: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    requisitado_em: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
        
    },

    completado_em: {
        type: DataTypes.DATE,
        allowNull: true
    },

    carro_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    guincheiro_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }

},  {
        tableName: 'chamados',
        timestamps: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
});



Chamado.belongsTo(Veiculo, {
    foreignKey: 'carro_id',
    as: 'veiculo'
});

Chamado.belongsTo(Guincheiro, {
    foreignKey: 'guincheiro_id',
    as: 'guincheiro'
});

Chamado.belongsTo(Cliente, {
    foreignKey: 'cliente_id',
    as: 'cliente'
});



export default Chamado