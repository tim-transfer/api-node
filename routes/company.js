import { Router } from 'express';
import controller from '../controllers/company.js';
import passport from 'passport';

const router = Router();

router.post('/company',  passport.authenticate('jwt', { session: false }), controller.createCompany);

export default router;