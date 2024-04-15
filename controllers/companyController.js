import models from "../models/index.js";

const controller = {
  createCompany: async (req, res) => {
    try {
      const { name, address, idUser, siret, direct } = req.body;

      if (!name || !address || !idUser || !siret || !direct) {
        return res.status(400).json({
          message: "Veuillez fournir toutes les informations nécessaires.",
        });
      }

      const savedCompany = await models.company.create({
        name: name,
        address: address,
        userId: idUser,
        siret: siret,
        direct: direct,
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

  updateCompany: async (req, res) => {
    try {
      const { id } = req.params;

      const { name, address, siret, direct } = req.body;

      if (!name || !address || !siret || !direct) {
        return res.status(400).json({
          result: "",
          error:
            "La mise à jour de l'entreprise " +
            name +
            " ayant pour id " +
            id +
            " s'est mal déroulé",
        });
      }

      const existingCompany = await models.company.findOne({ where: { id } });

      await existingCompany.update({
        name: name,
        address: address,
        siret: siret,
        direct: direct,
      });

      await existingCompany.save();

      res.status(200).json({
        result:
          "L'entreprise ayant pour id : " + id + " a bien été mis à jour.",
      });
    } catch (error) {
      res.status(500).json({
        result: false,
        error:
          "Erreur lors de la modification de l'entreprise ayant pour id : " +
          id,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const companies = await models.company.findAll();
      const plainCompanies = companies.map((company) =>
        company.get({ plain: true })
      );
      return res.status(200).json({ result: plainCompanies });
    } catch (error) {
      return res.status(500).json({
        result: false,
        error:
          "Erreur lors de la récupération de tous les entreprises." + error,
      });
    }
  },

  getName: async (req, res) => {
    try {
      const { id } = req.params;

      const company = await models.company.findOne({
        where: { id },
        attributes: ["name"],
      });
      return res.status(200).json({ result: company });
    } catch (error) {
      return res.status(500).json({
        result: false,
        error:
          "Erreur lors de la récupération du nom d'une entreprise." + error,
      });
    }
  },

  getCompanyById: async (req, res) => {
    try {
      const { id } = req.params;

      const company = await models.company.findOne({
        where: { id },
      });

      return res.status(200).json({ result: company });
    } catch (error) {
      return res.status(500).json({
        result: false,
        error:
          "Erreur lors de la récupération du nom d'une entreprise." + error,
      });
    }
  },

  delete: async (req, res) => {
    try {
      let { id } = req.params;

      id = Number(id);

      const company = await models.company.findOne({
        where: { id },
      });

      const rowsDeleted = await company.destroy();

      if (rowsDeleted > 0) {
        res
          .status(200)
          .json({ result: "Entreprise supprimée avec succès", error: "" });
      } else {
        res.status(404).json({
          result: false,
          error: "Aucune entreprise trouvée avec cet identifiant",
        });
      }
    } catch (error) {
      res.status(500).json({
        result: false,
        error:
          `Erreur lors de la suppression de l'entreprise ayant pour id : ` + id,
      });
    }
  },
};

export default controller;
