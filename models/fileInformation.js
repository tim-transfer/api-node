import sequelize from "../services/sequelize.js";
import { Sequelize } from "sequelize";

const model = sequelize.define("fileInformation", {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    unique: true,
    allowNull: false,
    autoIncrement: true,
  },
  nameFile: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },
  typeFile: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },

  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    unique: false,
  },
  dateLimit: {
    type: Sequelize.DATE,
    allowNull: false,
    unique: false,
  },
  projectId: {
    type: Sequelize.BIGINT,
    allowNull: true,
    references: false,
    references: {
      model: "projects",
      key: "id",
    },
  },
});

export default model;
