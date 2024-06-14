import models from "../models/index.js";
import jwt from "jsonwebtoken";
import config from "../config.js";
import * as bcrypt from "../utils/bcrypt.js";
import sendMailToFirstConnection from "./../services/nodeMailer/sendMailer.js";
import generateRandomPassword from "./../services/passwordGenerate.js";
import { default as handleError } from "../utils/error.js";

const controller = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);

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
      handleError(error, res);
    }
  },

  register: async (req, res) => {
    try {
      const { email, lastName, firstName, companyId, idRole, isPostman, password } =
        req.body;

      if (!email || !lastName || !firstName || !companyId || !idRole) {
        return res
          .status(400)
          .json({ result: "", error: "Adresse mail et mot de passe requis" });
      }

      const existingUser = await models.user.findOne({
        where: { email, deletedAt: null },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ result: false, error: "L'adresse mail est déjà utilisée" });
      }

      let passwordToEnter = "";

      if (!isPostman) {
        passwordToEnter = generateRandomPassword(10);
      }

      sendMailToFirstConnection(email, passwordToEnter);

      await models.user.create({
        email: email,
        password: passwordToEnter,
        lastName: lastName,
        firstName: firstName,
        companyId: companyId,
        idRole: idRole,
      });

      res.status(200).json({ result: "register", error: "" });
    } catch (error) {
      handleError(error, res);
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
      handleError(error, res);
    }
  },
};

export default controller;
