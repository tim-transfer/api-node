import { Router } from "express";
import controller from "../controllers/authController.js";
import passport from "passport";
import { restrict } from "../services/middleware.js";

const router = Router();

router.post("/auth/login", controller.login);

router.put('/auth/register', passport.authenticate("jwt", { session: false }), restrict("1"), controller.register);

router.post('/auth/checkSignUpToken', controller.checkSignUpToken);

router.put('/auth/signUpConfirmation', controller.signUpConfirmation);

router.post("/auth/refreshToken", controller.refreshToken);

export default router;
