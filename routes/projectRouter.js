import { Router } from "express";
import controller from "../controllers/projectController.js";
import passport from "passport";

const router = Router();

router.post(
  "/project",
  passport.authenticate("jwt", { session: false }),
  controller.createProject
);

router.patch(
  "/project/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateProject
);

router.get(
  "/company/projects/:idCompany",
  passport.authenticate("jwt", { session: false }),
  controller.getAllProjects
);

router.get(
  "/project/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getProjectById
);

router.delete(
  "/project/:id",
  passport.authenticate("jwt", { session: false }),
  controller.delete
);

export default router;
