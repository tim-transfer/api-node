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
          "idRole",
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

  getOne: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await models.user.findOne({
        where: { id },
        attributes: [
          "id",
          "lastName",
          "firstName",
          "companyId",
          "email",
          "idRole",
        ],
      });

      res.status(200).json({ result: user });
    } catch (error) {
      res.status(500).json({
        result: false,
        error:
          "impossible de récupérer les informations de l'utilisateur ayant pour id : " +
          id,
      });
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
      const { id } = req.params;

      const { email, lastName, firstName, companyId, idRole } = req.body;

      if (!email || !lastName || !firstName || !companyId || !idRole) {
        return res
          .status(400)
          .json({ result: "", error: "Adresse mail et mot de passe requis" });
      }

      const existingUser = await models.user.findOne({ where: { id } });

      await existingUser.update({
        email: email,
        lastName,
        firstName,
        companyId,
        idRole,
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

  changePassword: async (req, res) => {
    try {
      const { id } = req.params;

      const newId = Number(id);

      const newPassword = req.body.user.password;

      const user = await models.user.findOne({
        where: { id: newId },
      });

      user.isFirstConnection = false;
      user.password = newPassword;

      const result = await user.save();

      res.status(200).json({
        result: result,
        message: "Utilisateur modifié avec succès.",
        error: "",
      });
    } catch (error) {
      res.status(500).json({
        result: false,
        error:
          "Erreur lors du changement de mot de passe avec l'utilisateur ayant pour id : " +
          id,
      });
    }
  },
};

export default controller;
