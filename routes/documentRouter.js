
import { Router } from "express";
import controller from "../controllers/documentController.js";
import signatureLinkController from "../controllers/signatureLinkController.js";
import passport from "passport";
import checkSignatureLink from '../middlewares/checkSignatureLink.js'
const router = Router();

router.post('/document/add', passport.authenticate("jwt", { session: false }), controller.createDocument);
router.patch('/document/update/:id',   passport.authenticate("jwt", { session: false }),
controller.updateDocument);
router.delete('/document/delete/:id', passport.authenticate("jwt", { session: false }), controller.deleteDocument);
router.get('/document/:id', passport.authenticate("jwt", { session: false }), controller.getDocumentById);

router.post('/document/generate-link', passport.authenticate("jwt", { session: false }), signatureLinkController.generateSignatureLink);

router.get('/document/access/:token', passport.authenticate("jwt", { session: false }), checkSignatureLink, (req, res) => {
    req.link.update({ used: true });
    res.status(200).send(req.document);
});
export default router;
