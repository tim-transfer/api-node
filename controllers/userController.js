import models from "../models/index.js";
import fileLogger from "../services/fileLogger.js";

const controller = {
  getAll: async (req, res) => {
    try {

      const { role } = req.query;
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
        include: [
          {
            model: models.company,
            throught: { attributes: ["companyId"] },
          }
        ]
      };

      const users = await models.user.findAll(select);
      const roleData = await models.role.findOne({ where: { libelle: role } });

      if (role) {
        const filteredUsers = users.filter(user => user.dataValues.idRole === roleData.dataValues.id).map(user => { return { ...user.dataValues, role: roleData.dataValues.libelle } });

        return res.status(200).json({ result: filteredUsers, error: "" });
      } else {
        return res.status(200).json({ result: users.map(user => { return { ...user.dataValues, role: roleData.dataValues.libelle } }), error: "" });
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ result: false, error: "Erreur interne" });
    }
  },

  getOne: async (req, res) => {
    const { id } = req.params;
    try {

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
      fileLogger.error(error);
      res.status(500).json({
        result: false,
        error:
          "impossible de récupérer les informations de l'utilisateur ayant pour id : " +
          id
      });
    }
  },
  me: async (req, res) => {
    try {
      const user = await models.user.findOne({ where: { id: req.user.id } });
      const role = await models.role.findOne({ where: { id: user.idRole } });

      res.status(200).json({ result: { ...user.dataValues, role }, error: "" });
    } catch (error) {
      fileLogger.error(error);
      res.status(500).json({ result: false, error: "Erreur interne" });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;

      const existingUser = await models.user.findOne({ where: { id } });

      await existingUser.update(req.body);

      await existingUser.save();

      res.status(200).json({
        result:
          "L'utilisateur : " + existingUser.email + " a bien été enregistrer.",
      });
    } catch (error) {
      fileLogger.error(error);
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
      fileLogger.error(error);
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
      fileLogger.error(error);
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
