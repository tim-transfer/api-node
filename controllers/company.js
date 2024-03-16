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

      const savedCompany = await models.company.create({
        name: name,
        address: address,
        userId: idUser,
      });

      res.status(201).json(savedCompany);
    } catch (error) {
      res.status(500).json({
        result: false,
        message: "Erreur, impossible d'enregistrer une nouvelle company.",
        error: error,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const select = {
        attributes: ["id", "name"],
      };

      const companies = await models.company.findAll(select);
      const plainCompanies = companies.map(company => company.get({ plain: true }));
      return res.status(200).json({ result: plainCompanies});
    } catch (error) {
      return res
        .status(500)
        .json({
          result: false,
          error: "Erreur lors de la récupération de tous les entreprises." + error,
        });
    }
  },
};

export default controller;
