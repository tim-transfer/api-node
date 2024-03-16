import { Router } from 'express';
import controller from '../controllers/company.js';
import passport from 'passport';

const router = Router();

router.post('/company',  passport.authenticate('jwt', { session: false }), controller.createCompany);

router.get("/company", passport.authenticate("jwt", {session: false}), controller.getAll);

export default router;