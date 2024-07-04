import { where } from "sequelize";
import models from "../models/index.js";
import fileLogger from "../services/fileLogger.js";

const controller = {
  getAll: async (req, res) => {
    try {
      // Récupérer tous les messages
      let messages = await models.message.findAll();
  
      // Transformer les messages avec les données des projets, entreprises et documents associés
      let messagePromises = messages.map(async (message) => {
        const project = await models.project.findByPk(message.projectId);
        const company = await models.company.findByPk(message.companyId);
        const document = await models.document.findByPk(message.documentId);
        
        return {
          ...message.dataValues,
          projectName: project ? project.name : null,
          companyName: company ? company.name : null,
          documentName: document ? document.name : null,
        };
      });
  
      // Attendre la résolution de toutes les promesses
      let results = await Promise.all(messagePromises);
  
      // Envoyer la réponse
      res.status(200).json({ result: results, error: "" });
    } catch (error) {
      // Gérer les erreurs
      console.error(error);
      res.status(500).json({ result: [], error: "Une erreur est survenue lors de la récupération des messages." });
    }
  },
    getMessages: async (req, res) => {
    const { id } = req.params;
    try {

      const message = await models.sendMessage.findAll({where: {messageId: id}})

      res.status(200).json({ result: message });
    } catch (error) {
      fileLogger.error(error);
      res.status(500).json({
        result: false,
        error:
          "impossible de récupérer les informations de l'utilisateur ayant pour id : " +
          id
      });
    }
  },
  getContentMessages: async (req, res) => {
    const { id } = req.params;
    try {
      const messages = await models.messageContent.findAll({
        where: { id: id },
        order: [['createdAt', 'ASC']]
      });
  
      res.status(200).json({ result: messages });
    } catch (error) {
      console.error(error); // Remplacez `fileLogger.error(error)` par `console.error(error)` si `fileLogger` n'est pas défini
      res.status(500).json({
        result: false,
        error: "Impossible de récupérer les informations de l'utilisateur ayant pour id : " + id
      });
    }
  },
  createMessage: async (req, res) => {
    try {
      const { content, messageId, userId } = req.body;

      const messageContentToSave = await models.messageContent.create({
        content: content,
      });
      const messageToSave = await models.sendMessage.create({
        userId: userId,
        messageId: messageId,
        messageContentId: messageContentToSave.id
      })
      res.status(200).json({ result: messageToSave });
    } catch (error) {
      fileLogger.error(error);
      res.status(500).json({
        result: false,
        error:
          "Erreur"
      });
    }
  },

};

export default controller;
