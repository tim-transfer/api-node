import { Router as router } from 'express';
import controller from '../controllers/i18n.js';

const routes = router();

/**
 * @swagger
 * /i18n/{language}:
 *   get:
 *     tags:
 *       - i18n
 *     summary: Retourne le fichier de langue utilisé par le front
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Succès
 *       401:
 *         description: Utilisateur non connecté
 */
routes.get('/i18n/:language', controller.get);

export default routes;