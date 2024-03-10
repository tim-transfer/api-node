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
  userId: {
    type: Sequelize.BIGINT,
    references: {
        model: 'user', //model auquel est relié le user
        key: 'id', //clé primaire du user
     }
  },
});

export default model;
