import jwt from "jsonwebtoken";
import { sendError, sendServerError, sendSuccess } from "../helper/client.js";

/**
 * header contain
 * Authorised : Bearer token
 */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return sendError(res, "Unauthorized.", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.user;
    // // req.user = { id: "", username: "", phone: "", email: "" };
    next();
  } catch (error) {
    console.log(error);
    return sendError(res, "jwt expired.", 403);
  }
};

// export const verifyAdmin = async (req, res, next) => {
//     if (req.user.role !== 'admin')
//         return sendError(res, 'Forbidden.',403)
//     next()
// }

// export const verifyLearner = async (req, res, next) => {
//     if (req.user.role !== 'learner')
//         return sendError(res, 'Forbidden.',403)
//     next()
// }

// export const verifyTutor = async (req, res, next) => {
//     if (req.user.role !== 'tutor')
//         return sendError(res, 'Forbidden.', 403)
//     next()
// }
