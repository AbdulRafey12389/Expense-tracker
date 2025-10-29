import { verifyToken } from "../ultils/jwt.js";
import User from "../models/user.js";

const authentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);

    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

export default authentication;
