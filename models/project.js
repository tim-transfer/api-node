import { Sequelize } from "sequelize";

const model = sequelize.define("project", {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    unique: true,
    allowNull: false,
    autoIncrement: true,
  },
  nameProject: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
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
