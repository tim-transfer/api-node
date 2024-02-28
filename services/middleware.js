const restrict = (requiredRole) => (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    if (!requiredRole) return next();
    if (req.user.isAdmin && requiredRole === 'isAdmin') {
        return next();
    } else {
        return res.sendStatus(403);
    }
};

export {
    restrict
}