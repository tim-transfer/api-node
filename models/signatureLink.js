import { DataTypes } from 'sequelize';
import sequelize from "../services/sequelize.js";

const model = sequelize.define('signatureLink', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    documentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Document', 
            key: 'id'
        }
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

export default model;