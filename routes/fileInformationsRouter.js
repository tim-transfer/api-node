import { Router } from "express";
import controller from "../controllers/fileInformationController.js";
import passport from "passport";

const router = Router();

router.get(
  "/fileInformations/byProject/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getFileInformationByIdProject
);

router.post(
  "/fileInformation",
  passport.authenticate("jwt", { session: false }),
  controller.createFileInformation
);
router.delete(
  "/fileInformation/:id",
  passport.authenticate("jwt", { session: false }),
  controller.delete
);
export default router;
