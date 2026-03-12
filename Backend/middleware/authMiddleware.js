import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    // Format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // attach user info to request
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }

}