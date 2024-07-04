import { Sequelize } from "sequelize";
import sequelize from "../services/sequelize.js";
import * as bcrypt from "../utils/bcrypt.js";

const model = sequelize.define(
  "message",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
    },
    companyId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "companies",
        key: "id",
      },    
    },
    projectId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },    
    },
    documentId: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: "documents",
        key: "id",
      },      
    }
  }

);

export default model;
