const jwt =  require('jsonwebtoken');

const isTeamLeader = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'teamLeader') {
            return res.status(403).json({ message: 'Access forbidden, insufficient permissions.' });
        }
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = {
    isTeamLeader
};