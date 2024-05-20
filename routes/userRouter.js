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

router.get(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  Controller.getOne
);

router.delete(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  restrict("1"),
  Controller.delete
);

router.put(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  restrict("1"),
  Controller.update
);

router.put(
  "/user/changPassword/:id",
  passport.authenticate("jwt", { session: false }),
  Controller.changePassword
);

export default router;
