import models from "../models/index.js";
import jwt from "jsonwebtoken";
import config from "../config.js";
import * as bcrypt from "../utils/bcrypt.js";
import { default as handleError } from "../utils/error.js";
import fileLogger from "../services/fileLogger.js";
import mailService from "../services/mailService.js";
import sequelize from "../services/sequelize.js";

const controller = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          result: false,
          error: "Adresse mail et mot de passe requis",
        });
      }

      const user = await models.user.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          result: false,
          error: "L'adresse mail ne correspond à aucun compte",
        });
      }

      const blockEndTime = new Date(
        user?.lastAuthFailedAttempt?.getTime() +
        config.api.authBlockDurationInMinutes * 60000
      );
      const remainingBlockTimeInMinutes = Math.ceil(
        (blockEndTime - new Date().getTime()) / 60000
      );

      if (
        user.consecutiveAuthFailedAttempts >=
        config.api.authAttemptsBeforeBlock &&
        blockEndTime > new Date()
      ) {
        return res.status(401).json({
          result: false,
          error: `${translations.tooManyAuthFail} ${utils.language.plural(
            "minute",
            remainingBlockTimeInMinutes
          )}`,
        });
      }

      const isPasswordCorrect = await bcrypt.comparePasswords(
        password,
        user.password
      );
      if (isPasswordCorrect) {
        const payload = {
          id: user.id,
          email: user.email,
          password: user.password,
        };
        const token = jwt.sign(payload, config.jwt.secret, {
          expiresIn: config.jwt.expiresIn,
        });

        user.consecutiveAuthFailedAttempts = 0;
        user.lastAuthFailedAttempt = null;

        if (!user.refreshToken) {
          const refreshToken = jwt.sign(payload, config.jwt.refreshSecret);
          user.refreshToken = refreshToken;
        }

        await user.save();

        res.status(200).json({
          result: true,
          idUser: user.id,
          user: user,
          token: `Bearer ${token}`,
          refreshToken: `Bearer ${user.refreshToken}`,
          error: "",
        });
      } else {
        if (
          user.consecutiveAuthFailedAttempts >=
          config.api.authAttemptsBeforeBlock
        ) {
          res.status(401).json({ result: false, error: "Trop de tentatives" });
        } else {
          if (blockEndTime < new Date()) {
            user.consecutiveAuthFailedAttempts = 0;
            user.lastAuthFailedAttempt = null;
            await user.save();
          } else {
            user.consecutiveAuthFailedAttempts += 1;
            user.lastAuthFailedAttempt = new Date();
            await user.save();
          }
          res
            .status(401)
            .json({ result: false, error: "Mot de passe incorrect" });
        }
      }
    } catch (error) {
      fileLogger.error(error);
      handleError(error, res);
    }
  },

  register: async (req, res) => {
    try {
      const { email, role, companyId } = req.body;

      if (!email) {
        return res.status(400).json({ result: '', error: 'Adresse mail requis' });
      }

      const existingUser = await models.user.findOne({ where: { email } });

      const roleData = await models.role.findOne({ where: { libelle: role } });

      if (existingUser) {
        return res.status(400).json({ result: false, error: 'L\'adresse mail est déjà utilisée' });
      }

      let newUser = await models.user.create({ email, companyId, idRole: roleData.id });
      let token = jwt.sign({ id: newUser.id, email: newUser.email }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
      await mailService.sendSignUpMail(email, `${config.app.url}/register?token=${token}`);


      res.status(200).json({ result: newUser, error: '' });
    } catch (error) {
      console.log(error);
      handleError(error, res);
    }
  },

  checkSignUpToken: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ result: false, error: 'Token requis' });
      }

      jwt.verify(token, config.jwt.secret, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ result: false, error: 'Token invalide' });
        }

        const user = await models.user.findOne({ where: { id: decoded.id } });

        if (!user) {
          return res.status(404).json({ result: false, error: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ result: user, error: '' });
      });

    } catch (error) {
      handleError(error, res);
    }

  },

  signUpConfirmation: async (req, res) => {
    const { id, password, email, firstName, lastName } = req.body;

    //const translations = await utils.language.getTranslations(req);
    const user = await models.user.findByPk(id);

    if (user.email === email) {
      await sequelize.transaction(async (t) => {
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = password;
        user.accountCreationDate = new Date();
        await user.save({ transaction: t });

        res.status(200).json({ result: user, error: '' });
      });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res
          .status(400)
          .json({ result: false, error: "Refresh token requis" });
      } else {
        jwt.verify(
          refreshToken,
          config.jwt.refreshSecret,
          async (err, decoded) => {
            if (err) {
              return res
                .status(401)
                .json({ result: false, error: "Refresh token invalide" });
            }

            const user = await models.user.findOne({
              where: { id: decoded.id },
            });

            if (!user) {
              return res
                .status(404)
                .json({ result: false, error: "Utilisateur non trouvé" });
            }

            const payload = {
              id: user.id,
              email: user.email,
              password: user.password,
            };
            const token = jwt.sign(payload, config.jwt.secret, {
              expiresIn: config.jwt.expiresIn,
            });

            user.refreshToken = jwt.sign(payload, config.jwt.refreshSecret);
            await user.save();

            res.status(200).json({
              result: true,
              token: `Bearer ${token}`,
              refreshToken: `Bearer ${user.refreshToken}`,
              error: "",
            });
          }
        );
      }
    } catch (error) {
      fileLogger.error(error);
      handleError(error, res);
    }
  },
};

export default controller;
