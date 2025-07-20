import pkg from 'jsonwebtoken';
const jwt = pkg;

// console.log(secret_key);
const authenticate = (req, res, next) => {
    const secret_key = process.env.JWT_SECRET
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }

    const bearer_token = token.split(' ')[1];

    try {
        const decoded = jwt.verify(bearer_token, secret_key);
        // Could inject data for future purposes here. For now, it is redundant
        // REDUNDANT
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

export default authenticate;