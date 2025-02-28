import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authentication = async (req, res, next) => {
    try {
        // Extract token from `req.body.token` (for JSON or form-data) or `req.headers.authorization`
        let token = req.body.token || req.headers.authorization?.split(" ")[1];



        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: Token not provided",
                success: false,
            });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        if (!decodedToken) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.id = decodedToken.userid;
        next();
    } catch (error) {
        console.error("Error in Authorization:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default authentication;
