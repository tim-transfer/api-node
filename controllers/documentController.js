import Document from "../models/document.js";
import crypto from "crypto";
// Fonction pour créer un document
// Fonction pour créer un document en cryptant le contenu
const controller = {
  createDocument: async (req, res) => {
    try {
      const { title, content } = req.body;

      // Cryptage du contenu
      const cipher = crypto.createCipher(
        "aes-256-cbc",
        process.env.ENCRYPTION_KEY
      );
      let encryptedContent = cipher.update(content, "utf8", "hex");
      encryptedContent += cipher.final("hex");

      const newDocument = await Document.create({
        title,
        content: encryptedContent,
        // Ajoutez d'autres champs si nécessaire
      });
      res.status(201).json(newDocument);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la création du document" });
    }
  },
  // Fonction pour récupérer tous les documents
  getAllDocuments: async (req, res) => {
    try {
      const documents = await Document.findAll();
      res.json(documents);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des documents" });
    }
  },
  // Fonction pour récupérer un document par son ID et le décrypter
  getDocumentById: async (req, res) => {
    const { id } = req.params;
    try {
      const document = await Document.findByPk(id);
      if (!document) {
        return res.status(404).json({ message: "Document non trouvé" });
      }

      // Décryptage du contenu
      const decipher = crypto.createDecipher(
        "aes-256-cbc",
        process.env.ENCRYPTION_KEY
      );
      let decryptedContent = decipher.update(document.content, "hex", "utf8");
      decryptedContent += decipher.final("utf8");

      // Retourne le document avec le contenu décrypté
      res.json({ ...document.toJSON(), content: decryptedContent });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération du document" });
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
        content,
        // Ajoutez d'autres champs si nécessaire
      });
      res.json(document);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour du document" });
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
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du document" });
    }
  },
};
export default controller;
