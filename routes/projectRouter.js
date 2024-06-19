import  controller from "../controllers/projectController.js";
import { Router } from "express";
import passport from "passport";

const router = Router();

router.post(
  "/project",
  passport.authenticate("jwt", { session: false }),
  controller.createProject
);

router.get(
  "/company/projects/:idProject",
  passport.authenticate("jwt", { session: false }),
  controller.getAllProjects
);

export default router;
