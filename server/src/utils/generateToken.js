import jwt from 'jsonwebtoken'

export const generateToken = (userId, role, res) => {
    const payload = { id: userId, role: role };

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in .env file");
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: (1000 * 60 * 60 * 24) * 7,
    });

    return token;
};