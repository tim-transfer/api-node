import models from "../models/index.js";
import fileInformationController from "../controllers/fileInformationController.js";
const controller = {
  createProject: async (req, res) => {
    try {
      const { nameProject, startingDate, endingDate, companyId, documents } = req.body;

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
      documents.forEach(async element => {
        await models.fileInformation.create({
          nameFile: element.name,
          isActive: true,
          typeFile: element.type,
          dateLimit: endingDate,
          projectId: projectToSave.id
        })
      });

      res.status(201).json(projectToSave);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la création d'un projet" });
    }
  },

  updateProject: async (req, res) => {
    try {
      const { id } = req.params;
      const { nameProject, startingDate, endingDate } = req.body;

      if (!nameProject || !startingDate || !endingDate) {
        return res.status(400).json({
          result: "",
          error: `La mise à jour du projet ${nameProject} ayant pour id ${id} s'est mal déroulée`,
        });
      }

      const existingProject = await models.project.findOne({ where: { id } });

      await existingProject.update({
        nameProject: nameProject,
        startingDate: startingDate,
        endingDate: endingDate,
      });

      await existingProject.save();

      res.status(200).json({
        result: `Le projet ayant pour id : ${id} a bien été mis à jour.`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        result: false,
        error: `Erreur lors de la modification de le projet ayant pour id : ${id}`,
      });
    }
  },

  getAllProjects: async (req, res) => {
    try {
      const { idCompany } = req.params; // Changement de companyId à idProject
      const projects = await models.project.findAll({
        where: { companyId: idCompany }, // Utilisez idProject pour la correspondance
      });
      return res.status(200).json({ result: projects });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la récupération de tous les projets.",
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
      console.error(error);
      return res.status(500).json({
        result: false,
        error: `Erreur lors de la récupération du projet avec l'id ${id}. ${error}`,
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
          .json({ result: "Projet supprimé avec succès", error: "" });
      } else {
        res.status(404).json({
          result: false,
          error: "Aucun projet trouvé avec cet identifiant",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        result: false,
        error: `Erreur lors de la suppression du projet ayant pour id : ${id}`,
      });
    }
  },

  
};

export default controller;
