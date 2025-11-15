import { DataTypes, Sequelize } from "sequelize";  
import sequelize from "../database/conexao_database.js"; 

const Guincheiro = sequelize.define("guincheiro", {
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
        allowNull: false,
        unique: true
    },

    cpf: {
        type: DataTypes.CHAR(11),
        allowNull: false,
        unique: true,
        validate: {
            len: [11, 11]  
        }
    },

    senha: {
        type: DataTypes.STRING(30),
        allowNull: false
    },

    telefone: {
        type: DataTypes.CHAR(11),
        allowNull: false,
        validate: {
            len: [11, 11]  
        }
    },

    foto_url:{
        type: DataTypes.STRING(255),
        allowNull: true
    }, 

    cnh_num: {
        type: DataTypes.CHAR(11),
        allowNull: false,
        validate: {
            len: [11, 11] 
        }
    },


},  { timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default Guincheiro