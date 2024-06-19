import Document from "../models/document.js";
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import fileLogger from "../services/fileLogger.js";

// Fonction pour créer un document en cryptant le contenu
const controller = {
  createDocument: async (req, res) => {
    try {
      const { content, name, type, projectId } = req.body;
      const iv = crypto.randomBytes(16);
      // Génération d'un vecteur d'initialisation (IV) de 16 octets
      const cipher = crypto.createCipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY, iv);
      const buffer = Buffer.from(content, 'base64');

      let encryptedContent = Buffer.concat([cipher.update(buffer), cipher.final()]);

      // Chemin du dossier où vous souhaitez enregistrer le fichier
      const uploadDir = path.join('uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      // Chemin complet du fichier à enregistrer
      const filePath = path.join(uploadDir, `${Date.now()}-${name}`);
      fs.writeFileSync(filePath, encryptedContent);

      const newDocument = await Document.create({
        name: name,
        path: filePath,
        type: type,
        iv: iv.toString('hex'),
        projectId: projectId
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
  getDocumentById: async (req, res) => {
    const { id } = req.params;
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
      res.setHeader('Content-Disposition', `attachment; filename="${document.name}"`);
      res.setHeader('Content-Type', document.type == 'png' ? 'image/png' : 'application/pdf'); // Changez le type MIME en fonction de votre fichier

      // Envoyer le fichier déchiffré en base64
      res.send(decryptedContent);
    } catch (error) {
      fileLogger.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération du document' });
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
