import { Router } from 'express';
import Controller from '../controllers/user.js';
import passport from 'passport';
import { restrict } from '../services/middleware.js';

const router = Router();

router.get('/user', passport.authenticate('jwt', { session: false }), Controller.getAll);

router.get('/user/me', passport.authenticate('jwt', { session: false }), Controller.me);

export default router;