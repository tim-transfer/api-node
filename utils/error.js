import services from '../services/index.js';

const error = (error, response) => {
    services.logger.error(error);
    response.status(500).json({ result: false, error: 'Il y a eu une erreur lors de votre requête. Veuillez réessayer plus tard.' });
};

export default error;