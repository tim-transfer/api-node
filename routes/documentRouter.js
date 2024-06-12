
import { Router } from "express";
import controller from "../controllers/documentController.js";
import signatureLinkController from "../controllers/signatureLinkController.js";
import passport from "passport";
import checkSignatureLink from '../middlewares/checkSignatureLink.js'
const router = Router();

router.put('/add', controller.createDocument);
router.patch('/update/:id',   passport.authenticate("jwt", { session: false }),
controller.updateDocument);
router.delete('/delete/:id', passport.authenticate("jwt", { session: false }), controller.deleteDocument);

router.post('/generate-link', passport.authenticate("jwt", { session: false }), signatureLinkController.generateSignatureLink);

router.get('/access/:token', passport.authenticate("jwt", { session: false }), checkSignatureLink, (req, res) => {
    req.link.update({ used: true });
    res.status(200).send(req.document);
});
export default router;
