import { DataTypes } from "sequelize";
import sequelize from "../database/conexao_database.js";
import Chamado from "./Chamado.js";

const Mensagem = sequelize.define("mensagem", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    chamado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'chamado',
            key: 'id'
        }
    },
    mensagem: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sender_nome: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    sender_tipo: {
        type: DataTypes.ENUM("cliente", "guincheiro"),
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Chamado.hasMany(Mensagem, { foreignKey: 'chamado_id' });
Mensagem.belongsTo(Chamado, { foreignKey: 'chamado_id' });

export default Mensagem;

