import { Router } from "express";
import controller from "../controllers/companyController.js";
import passport from "passport";
import { restrict } from "../services/middleware.js";

const router = Router();

router.post(
  "/company",
  passport.authenticate("jwt", { session: false }),
  controller.createCompany
);

router.patch(
  "/company/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateCompany
);

router.get(
  "/companies",
  passport.authenticate("jwt", { session: false }),
  controller.getAll
);

router.get(
  "/company/name/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getName
);

router.get(
  "/company/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getCompanyById
);

router.delete(
  "/company/:id",
  passport.authenticate("jwt", { session: false }),
  restrict("isAdmin"),
  controller.delete
);

export default router;
