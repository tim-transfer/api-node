import models from "../models/index.js";

const controller = {
  createProject: async (req, res) => {
    try {
      const { nameProject, startingDate, endingDate, companyId } = req.body;

      if (!nameProject || !startingDate || !endingDate) {
        return res.status(400).json({
          message:
            "Veuillez fournir toutes les informations nécessaires pour la création d'un plan de fichier.",
        });
      }

      const projectToSave = await models.project.create({
        nameProject: nameProject,
        startingDate: startingDate,
        endingDate: endingDate,
        companyId: companyId,
        isActive: true,
      });

      res.status(201).json(projectToSave);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la création d'un projet" });
    }
  },

  getAllProjects: async (req, res) => {
    try {
      const { idProject } = req.params; // Changement de companyId à idProject

      const projects = await models.project.findAll({
        where: { companyId: idProject }, // Utilisez idProject pour la correspondance
      });

      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la récupération de tous les projets.",
      });
    }
  },
};

export default controller;
