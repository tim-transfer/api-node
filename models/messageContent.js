import { Sequelize } from "sequelize";
import sequelize from "../services/sequelize.js";

const model = sequelize.define(
  "messageContent",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }

);

export default model;
