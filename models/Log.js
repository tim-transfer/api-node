import sequelize from "../services/sequelize.js";
import { Sequelize } from "sequelize";

// Modèle de log
const Log = sequelize.define("Log", {
  level: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
});

// Synchronisation du modèle
sequelize
  .sync()
  .then(() => {
    console.log("Modèle de log synchronisé avec la base de données");
  })
  .catch((err) =>
    console.error("Erreur lors de la synchronisation du modèle:", err)
  );

export default Log;
