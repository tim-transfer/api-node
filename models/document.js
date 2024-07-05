import sequelize from "../services/sequelize.js";
import { Sequelize } from "sequelize";

const model = sequelize.define("document", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  path: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  type: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  iv: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

export default model;
