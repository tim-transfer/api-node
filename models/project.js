import sequelize from "../services/sequelize.js";
import { Sequelize } from "sequelize";

const model = sequelize.define("project", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  closedAt: {
    type: Sequelize.DATE,
    allowNull: true,
    unique: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false
  },
  companyId: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
});

export default model;
