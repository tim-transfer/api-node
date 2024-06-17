import { Router } from "express";
import controller from "../controllers/projectController.js";
import passport from "passport";
import { restrict } from "../services/middleware.js";

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
  "/projects",
  passport.authenticate("jwt", { session: false }),
  controller.getAll
);

router.get(
  "/project/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getProjectById
);

router.delete(
  "/project/:id",
  passport.authenticate("jwt", { session: false }),
  restrict("1"),
  controller.delete
);



export default router;
