import { Router } from 'express';
import controller from '../controllers/companyController.js';
import passport from 'passport';

const router = Router();

router.post('/company',  passport.authenticate('jwt', { session: false }), controller.createCompany);

router.get("/company", passport.authenticate("jwt", {session: false}), controller.getAll);

router.get("/company/name/:id", passport.authenticate("jwt",  {session: false}), controller.getName);

export default router;