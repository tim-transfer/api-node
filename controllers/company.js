import models from "../models/index.js";

const controller = {
  createCompany: async (req, res) => {
    try {
      const { name, address, idUser } = req.body;

      if (!name || !address || !idUser) {
        return res.status(400).json({
          message: "Veuillez fournir toutes les informations nécessaires.",
        });
      }


      const savedCompany = await models.company.create({name: name, address: address, userId: idUser})

      res.status(201).json(savedCompany);
    } catch (error) {
      res.status(500).json({
        result: false,
        message: "Erreur, impossible d'enregistrer une nouvelle company.",
        error: error
      });
    }
  },
};

export default controller;
