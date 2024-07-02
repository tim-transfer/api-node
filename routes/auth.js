import { Router } from "express";
import controller from "../controllers/authController.js";

const router = Router();

router.post("/auth/login", controller.login);

router.put('/auth/register', controller.register);

router.post("/auth/refreshToken", controller.refreshToken);

export default router;
