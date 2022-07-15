import { NextFunction, Request, Response } from "express";
import { JWT_PRIVATE_KEY } from "../../constants/config";
import { error } from "../../helpers/response";
import userService from "../services/db/user";
import jwt from "jsonwebtoken"
const userMidleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.token as string;
    if (token) {
        jwt.verify(token, JWT_PRIVATE_KEY, function (err, decoded) {
            if (err) {
                res.status(401).json(error("unauthorized"));
            } else {
                const userId = (decoded as any).id as number;
                if (userId) {
                    const user = userService.getById(userId);
                    if (user) {
                        (req as any).user = user;
                        next();
                    } else {
                        res.status(401).json(error("unauthorized"));
                    }
                }

            }
        })

    } else {
        res.status(401).json(error("unauthorized"));
    }
}
export default userMidleware;