import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import models from '../models/index.js';
import config from '../config.js';

const hookJwtStrategy = async () => {
    const options = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt.secret
    }

    passport.use(new Strategy(options, async (payload, callback) => {
        const user = await models.user.findByPk(payload.id);

        if (user) {
            return callback(null, user);
        } else {
            return callback(null, false);
        }
    }))
}

export {
    hookJwtStrategy
};