const API_KEY = process.env.API_KEY;

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!API_KEY) {
        console.error("ERROR: API_KEY tidak terdefinisi di file .env server!");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!apiKey) {
        console.error("Error 401 : Unauthorized - API Key tidak ditemukan");
        return res.status(401).json({ error: 'Unauthorized - API Key tidak ditemukan' });
    }
    
    if (apiKey !== API_KEY) {
        console.error("Error 403 : Forbidden - API Key salah");
        return res.status(403).json({ error: 'Forbidden - API Key salah' });
    }
    
    next();
};

module.exports = authMiddleware;