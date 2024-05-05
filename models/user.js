import { Sequelize } from "sequelize";
import sequelize from "../services/sequelize.js";
import * as bcrypt from "../utils/bcrypt.js";

const model = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    companyId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    consecutiveAuthFailedAttempts: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastAuthFailedAttempt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    idRole: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    }
  },
  {
    hooks: {
      beforeValidate: bcrypt.hashPassword,
    },
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
  }
);

export default model;
