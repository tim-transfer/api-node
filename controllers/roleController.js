import models from "../models/index.js";
import fileLogger from "../services/fileLogger.js";

const controller = {
  createRole: async (req, res) => {
    try {
      const { libelle, posterLibelle } = req.body;

      if (!libelle || !posterLibelle) {
        return res.status(400).json({
          message:
            "Veuillez fournir les informations nécessaires concernant la création de rôle.",
        });
      }

      const savedRole = await models.role.create({
        libelle: libelle,
        posterLibelle: posterLibelle,
      });

      res.status(201).json(savedRole);
    } catch (error) {
      fileLogger.error(error);
      res.status(500).json({
        result: false,
        message: "Erreur, impossible d'enregistrer le rôle suivant : " + posterLibelle,
      });
    }
  },

  getRoles: async (req, res) => {
    try {
      const roles = await models.role.findAll();

      res
        .status(200)
        .json({ result: roles, message: "Entreprise récupéré avec succès." });
    } catch (error) {
      fileLogger.error(error);
      res.status(404).json({
        result: false,
        error: `Erreur lors de la récupération des rôles, contactez m'administrateur.`,
      });
    }
  },
};

export default controller;
