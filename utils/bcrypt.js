import bcrypt from 'bcryptjs';

const comparePasswords = (password, hash) => {
    return new Promise(resolve => {
        bcrypt.compare(password, hash, (_error, isMatch) => {
            return resolve(isMatch);
        });
    });
};

const hashPassword = (user) => {
    if (user.changed('password') && (!user.password.startsWith('$') && user.password.length !== 60)) {
        return bcrypt.hash(user.password, 10).then(password => {
            user.password = password;
        });
    }
};

export {
    comparePasswords,
    hashPassword
};