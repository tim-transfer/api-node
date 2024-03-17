import { Router } from "express";
import Controller from "../controllers/userController.js";
import passport from "passport";
import { restrict } from "../services/middleware.js";

const router = Router();

router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  Controller.getAll
);

router.get(
  "/user/me",
  passport.authenticate("jwt", { session: false }),
  Controller.me
);

router.delete(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  restrict("isAdmin"),
  Controller.delete
);

router.put(
  "/user",
  passport.authenticate("jwt", { session: false }),
  restrict("isAdmin"),
  Controller.update
);

export default router;
