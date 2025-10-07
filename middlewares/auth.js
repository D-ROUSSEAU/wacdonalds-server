const jwt = require('jsonwebtoken')

const auth = (...allowedRoles) => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) 
            return res.status(401).json({ error: 'Access denied' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (allowedRoles.length && !allowedRoles.includes(decoded.role))
                return res.status(403).json({ error: decoded });

            next();
        } catch (error) {
            res.status(401).json({ error: 'Access denied' });
        }
    };
};

module.exports = auth