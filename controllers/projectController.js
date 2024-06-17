import models from "../models/index.js";
import fileLogger from "../services/fileLogger.js";

const controller = {
  createProject: async (req, res) => {
    try {
      const { name, companyId, status } = req.body;

      if (!name || !companyId || !status ) {
        return res.status(400).json({
          message: "Veuillez fournir toutes les informations nécessaires.",
        });
      }

      const savedProject = await models.project.create({
        name: name,
        companyId: companyId,
        status: status
        });

      res.status(201).json(savedProject);
    } catch (error) {
      fileLogger.error(error);
      res.status(500).json({
        result: false,
        message: "Erreur, impossible d'enregistrer une nouvelle company.",
        error: error,
      });
    }
  },

  updateProject: async (req, res) => {
    try {
      const { id } = req.params;

      const { name, companyId, status } = req.body;

      if (!name || !companyId || !status) {
        return res.status(400).json({
          result: "",
          error:
            "La mise à jour du projet " +
            name +
            " ayant pour id " +
            id +
            " s'est mal déroulé",
        });
      }

      const existingProject= await models.project.findOne({ where: { id } });

      await existingProject.update({
        name: name,
        companyId: companyId,
        status: status
      });

      await existingProject.save();

      res.status(200).json({
        result:
          "Le projet ayant pour id : " + id + " a bien été mis à jour.",
      });
    } catch (error) {
      fileLogger.error(error);
      res.status(500).json({
        result: false,
        error:
          "Erreur lors de la modification de le projet ayant pour id : " +
          id,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const projects = await models.project.findAll();
      const plainProjects = projects.map((project) =>
        project.get({ plain: true })
      );
      return res.status(200).json({ result: plainProjects });
    } catch (error) {
      fileLogger.error(error);
      return res.status(500).json({
        result: false,
        error:
          "Erreur lors de la récupération de tous les entreprises." + error,
      });
    }
  },

  getProjectById: async (req, res) => {
    try {
      const { id } = req.params;

      const project = await models.project.findOne({
        where: { id },
      });

      return res.status(200).json({ result: project });
    } catch (error) {
      fileLogger.error(error);
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

      const project = await models.project.findOne({
        where: { id },
      });

      const rowsDeleted = await project.destroy();

      if (rowsDeleted > 0) {
        res
          .status(200)
          .json({ result: "Projet supprimée avec succès", error: "" });
      } else {
        res.status(404).json({
          result: false,
          error: "Aucune projet trouvée avec cet identifiant",
        });
      }
    } catch (error) {
      fileLogger.error(error);
      res.status(500).json({
        result: false,
        error:
          `Erreur lors de la suppression de le projet ayant pour id : ` + id,
      });
    }
  },
};

export default controller;
