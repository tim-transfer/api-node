import { Sequelize } from "sequelize";
import sequelize from "../services/sequelize.js";
import * as bcrypt from "../utils/bcrypt.js";

const model = sequelize.define(
  "sendMessage",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },    
    },
    messageId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "messages",
        key: "id",
      },    
    },
    messageContentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "messageContents",
        key: "id",
      },    
    }
  }

);

export default model;
