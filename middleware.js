const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

function authMiddleware(req, res, next) {
    const token = req.headers.token;
    
    if (!token) {
        return res.status(403).json({
            message: "No token provided"
        });
    }
    
    try {
        const decoded = jwt.verify(token, "secret123123");
        
        if (decoded.userId) {
            req.userId = new mongoose.Types.ObjectId(decoded.userId);
            next()
        } else {
            res.status(403).json({
                message: "Token invalid or not found"
            })
        }
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token",
            error: error.message
        });
    }

}

module.exports = {
    authMiddleware: authMiddleware
}