import Document from "../models/document.js";
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import fileLogger from "../services/fileLogger.js";
import config from "../config.js";

// Fonction pour créer un document en cryptant le contenu
const controller = {
  createDocument: async (req, res) => {
    try {
      const { content, name, type, fileInformationId } = req.body;
      const iv = crypto.randomBytes(16);
      // Génération d'un vecteur d'initialisation (IV) de 16 octets
      const cipher = crypto.createCipheriv('aes-256-cbc', config.api.encryptionKey, iv);
      const buffer = Buffer.from(content, 'base64');

      let encryptedContent = Buffer.concat([cipher.update(buffer), cipher.final()]);

      // Chemin du dossier où vous souhaitez enregistrer le fichier
      const uploadDir = path.join('uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      // Chemin complet du fichier à enregistrer
      const filePath = path.join(uploadDir, `${Date.now()}`);
      fs.writeFileSync(filePath, encryptedContent);

      const newDocument = await Document.create({
        name,
        path: filePath,
        type,
        iv: iv.toString('hex'),
        fileInformationId
      });
      res.status(201).json(newDocument);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },
  // Fonction pour récupérer tous les documents
  getAllDocuments: async (req, res) => {
    try {
      const documents = await Document.findAll();
      res.json(documents);
    } catch (error) {
      fileLogger.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des documents' });
    }
  },
  // Fonction pour récupérer un document par son ID et le décrypter
  getDocumentById: async (id) => {
    try {
      const document = await Document.findOne({ where: { id } });
      if (!document) {
        return res.status(404).json({ message: "Document non trouvé" });
      }
      const filePath = path.join(document.path);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Document non trouvé' });
      }
      const iv = Buffer.from(document.iv, 'hex');

      const encryptedContent = fs.readFileSync(filePath);
      const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY, iv);

      let decryptedContent = Buffer.concat([
        decipher.update(encryptedContent),
      ]);

      // Send the decrypted content as a base64 string
      res.status(200).json({
        id: document.id,
        name: document.name,
        content: decryptedContent.toString('base64'),
        type: document.type,
      });

    } catch (error) {
      fileLogger.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération du document' });
    }
  },

  // Fonction pour récupérer les documents par ID de projet
  getDocumentByProjectId: async (req, res) => {
    const { id } = req.params;
    try {
      const documents = await Document.findAll({ where: { projectId: id } });
      res.json(documents);
    } catch (error) {
      fileLogger.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des documents' });
    }
  },


  // Fonction pour mettre à jour un document
  updateDocument: async (req, res) => {
    const { id } = req.params;
    try {
      const document = await Document.findByPk(id);
      if (!document) {
        return res.status(404).json({ message: "Document non trouvé" });
      }
      const { title, content } = req.body;
      await document.update({
        title,
        content
        // Ajoutez d'autres champs si nécessaire
      });
      res.json(document);
    } catch (error) {
      fileLogger.error(error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du document' });
    }
  },
  // Fonction pour supprimer un document
  deleteDocument: async (req, res) => {
    const { id } = req.params;
    try {
      const document = await Document.findByPk(id);
      if (!document) {
        return res.status(404).json({ message: "Document non trouvé" });
      }
      await document.destroy();
      res.json({ message: "Document supprimé avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la suppression du document" });
    }
  },
};

export default controller;
