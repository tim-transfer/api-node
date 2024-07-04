import { Router } from "express";
import Controller from "../controllers/messageController.js";
import passport from "passport";
import { restrict } from "../services/middleware.js";

const router = Router();

router.get(
  "/list-messages",
  passport.authenticate("jwt", { session: false }),
  Controller.getAll
);
router.get(
  "/get-messages/:id",
  passport.authenticate("jwt", { session: false }),
  Controller.getMessages
);
router.get(
  "/get-messages-content/:id",
  passport.authenticate("jwt", { session: false }),
  Controller.getContentMessages
);
router.post(
  "/newMessages",
  passport.authenticate("jwt", { session: false }),
  Controller.createMessage
);

// router.delete(
//   "/user/:id",
//   passport.authenticate("jwt", { session: false }),
//   restrict("1"),
//   Controller.delete
// );

export default router;
