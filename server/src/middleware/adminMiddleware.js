export const adminMiddleware = (req, res, next) => {
    // req.user is taked from authMiddleware, which is worked before adminMiddleware
    if (req.user && req.user.role === 'ADMIN') {
        next(); // All is good continue
    } else {
        return res.status(403).json({ 
            error: "Access denied. Admins only." 
        });
    }
};
// authMiddleware is always first