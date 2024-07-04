import models from "../models/index.js";
const controller = {
  createFileInformation: async (req, res) => {
    try {
      const { endingDate, documents } = req.body;

      documents.forEach(async element => {


        if (
          !element.name ||
          // !isActive ||
          !element.type ||
          !endingDate ||
          !projectId
        ) {
          return res.status(400).json({
            message:
              "Veuillez fournir toutes les informations nécessaires pour la création d'un plan de fichier.",
          });
        }

        const fileInformation = await models.fileInformation.create({
          nameFile: nameFile,
          isActive: isActive,
          typeFile: typeFile,
          dateLimit: new Date(dateLimit),
          projectId: Number(projectId),
        });
      });
      res.status(201).json(fileInformation);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la création de FileInformation" });
    }
  },
  getFileInformationByIdProject: async (req, res) => {
    try {
      const { id } = req.params;

      const fileInformations = await models.fileInformation.findAll({
        where: { projectId: id }, include: { model: models.document }
      });

      return res.status(200).json({ result: fileInformations });
    } catch (error) {
      return res.status(500).json({
        result: false,
        error:
          "Erreur lors de la récupération d'information d'un fichier en fonction en fonction de l'id de l'entreprise",
      });
    }
  },
  delete: async (req, res) => {
    let { id } = req.params;
    try {
  
      id = Number(id);
  
      const fileInformation = await models.fileInformation.findOne({
        where: { id },
      });
  
    const rowsDeleted = await fileInformation.destroy();
  
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
}

export default controller;
