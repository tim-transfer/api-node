import passport from "passport";
import Controller from "../controllers/roleController.js";

import { Router } from "express";

const router = Router();

router.get(
  "/roles",
  passport.authenticate("jwt", { session: false }),
  Controller.getRoles
);

router.post(
  "/role",
  passport.authenticate("jwt", { session: false}),
  Controller.createRole
)

export default router;
