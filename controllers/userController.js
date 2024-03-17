import models from "../models/index.js";

const controller = {
  getAll: async (req, res) => {
    try {
      const select = {
        attributes: [
          "id",
          "lastName",
          "firstName",
          "companyId",
          "email",
          "isAdmin",
          "createdAt",
          "updatedAt",
          "deletedAt",
        ],
      };

      const users = await models.user.findAll(select);
      res.status(200).json({ result: users, error: "" });
    } catch (error) {
      res.status(500).json({ result: false, error: "Erreur interne" });
    }
  },

  getOne: async(req, res) => {
    try {

    }catch(error){
      res.status(500).json({result: false, error: "impossible de récupérer les informations de l'utilisateur ayant pour id : "})
    }
  },
  me: async (req, res) => {
    try {
      const user = await models.user.findOne({ where: { id: req.user.id } });
      res.status(200).json({ result: user, error: "" });
    } catch (error) {
      res.status(500).json({ result: false, error: "Erreur interne" });
    }
  },

  update: async (req, res) => {
    try {
      const { email, lastName, firstName, companyId } = req.body;

      if (!email || !lastName || !firstName || !companyId) {
        return res
          .status(400)
          .json({ result: "", error: "Adresse mail et mot de passe requis" });
      }

      const existingUser = await models.user.findOne({ where: { email } });

      await existingUser.update({
        email: email,
        lastName,
        firstName,
        companyId,
      });

      await existingUser.save();

      res.status(200).json({
        result:
          "L'utilisateur : " + existingUser.email + " a bien été enregistrer.",
      });
    } catch (error) {
      res.status(500).json({
        result: false,
        error:
          "Erreur lors de la modification de l'utilisateur ayant pour id : " +
          id,
      });
    }
  },

  delete: async (req, res) => {
    try {
      let { id } = req.params;

      id = Number(id);

      const user = await models.user.findOne({
        where: { id },
      });

      const rowsDeleted = await user.destroy();
      if (rowsDeleted > 0) {
        res
          .status(200)
          .json({ result: "Utilisateur supprimé avec succès", error: "" });
      } else {
        res.status(404).json({
          result: false,
          error: "Aucun utilisateur trouvé avec cet identifiant",
        });
      }
    } catch (error) {
      res.status(500).json({
        result: false,
        error:
          "Erreur lors de la suppression de l'utilisateur ayant pour id : " +
          id,
      });
    }
  },
};

export default controller;
