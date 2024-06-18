import models from "../models/index";

const controller = {
  createProject: async (req, res) => {
    try {
      const { nameProject, startingDate, endingDate } = req.body;

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
      });

      res.status(201).json(projectToSave);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la création d'un projet" });
    }
  },
};

export default controller;
