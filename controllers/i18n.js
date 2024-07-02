import path from 'path';
import { fileURLToPath } from 'url';
import error from '../utils/error.js';

const controller = {
    get: async (req, res) => {
        try {
            const { language } = req.params;

            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const file = path.join(__dirname, `../public/i18n/${language}.json`);

            res.sendFile(file);
        } catch (error) {
            error(req, res, error);
        }
    }
};

export default controller;