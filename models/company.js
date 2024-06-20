import sequelize from "../services/sequelize.js";
import { Sequelize } from "sequelize";

const model = sequelize.define("company", {
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
  address: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false,
  },
  siret: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  },
  contact: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  },
  contactPhoneNumber: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  },
  contactMailAddress: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  }
});

export default model;
