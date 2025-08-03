import { DataTypes } from "sequelize";
import Sequelize from '../database/sequelize.js';

const Cliente = Sequelize.define("cliente", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    nome: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    email: {
        type: DataTypes.STRING(70),
        allowNull: false
    },

    cpf: {
        type: DataTypes.CHAR(11),
        allowNull: false
    },

    senha: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    telefone: {
        type: DataTypes.CHAR(11),
        allowNull: false
    },

    cnh_num: {
        type: DataTypes.CHAR(11),
        allowNull: false
    },
    foto_url:{
        type: DataTypes.CHAR(255),
        allowNull: true
    }
   

},  { timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default Cliente





