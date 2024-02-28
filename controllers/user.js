import models from '../models/index.js';

const controller = {

    getAll: async (req, res) => {
        try {
            const users = await models.user.findAll();
            res.status(200).json({ result: users, error: '' });
        } catch (error) {
            res.status(500).json({ result: false, error: 'Erreur interne' })
        }
    },
    me: async (req, res) => {
        try {
            const user = await models.user.findOne({ where: { id: req.user.id } });
            res.status(200).json({ result: user, error: '' });
        } catch (error) {
            res.status(500).json({ result: false, error: 'Erreur interne' })
        }
    }
};

export default controller;