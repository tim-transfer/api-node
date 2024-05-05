import { Sequelize } from "sequelize";
import sequelize from "../services/sequelize.js";

const model = sequelize.define("role", {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    unique: true,
    allowNull: false,
    autoIncrement: true,
  },
  libelle: {
    type: Sequelize.STRING,
    primaryKey: true,
    unique: false,
  },
  posterLibelle: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },
});

export default model;
