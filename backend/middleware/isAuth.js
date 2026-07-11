import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Because generateToken() stores { id: userId }
        req.userId = decoded.id;

        next();
    } catch (error) {
        console.log("isAuth error:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default isAuth;