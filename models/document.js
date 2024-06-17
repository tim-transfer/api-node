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
    allowNull: false
  },
  iv: {
    type: Sequelize.STRING,
    allowNull: false
  },
  projectId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
        model: 'projects', 
        key: 'id'
    }
},
  // Ajoutez d'autres champs comme nécessaire
});

export default model;
