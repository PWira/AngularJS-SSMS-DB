const API_KEY = process.env.API_KEY || 'secret123';

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
        return res.status(401).json({ error: 'Unauthorized - API Key tidak ditemukan' });
    }
    
    if (apiKey !== API_KEY) {
        return res.status(403).json({ error: 'Forbidden - API Key salah' });
    }
    
    next();
};

module.exports = authMiddleware;