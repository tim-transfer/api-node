import models from "../models/index.js";
const controller = {
  createFileInformation: async (req, res) => {
    try {
      const {
        nameFile,
        isActive,
        position,
        companyId,
        dateButoire,
        extensionFile,
      } = req.body;

      if (
        !nameFile ||
        !isActive ||
        !position ||
        !companyId ||
        !dateButoire ||
        !extensionFile
      ) {
        return res.status(400).json({
          message:
            "Veuillez fournir toutes les informations nécessaires pour la création d'un plan de fichier.",
        });
      }

      const fileInformation = await models.fileInformation.create({
        nameFile: nameFile,
        isActive: isActive,
        position: Number(position),
        companyId: Number(companyId),
        dateLimit: new Date(dateButoire),
        extensionFile: extensionFile,
      });

      res.status(201).json(fileInformation);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la création de FileInformation" });
    }
  },
  getFileInformationByIdCompany: async (req, res) => {
    try {
      const { id } = req.params;

      const fileInformations = await models.fileInformation.findAll({
        where: { companyId: id },
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
};

export default controller;
