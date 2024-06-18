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
    allowNull: true,
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
  position: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },
  extensionFile: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },
  companyId: {
    type: Sequelize.BIGINT,
    allowNull: false,
    references: {
      model: "companies",
      key: "id",
    },
  },
});

export default model;
