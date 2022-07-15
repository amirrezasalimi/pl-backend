import { NextFunction, Request, Response } from "express";
import { error } from "../../helpers/response";
import userRoleCheck from "../../helpers/user-role-check";
import { User } from "../../models/user";

const userRoleMidleware = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as User | null;
        if (user) {
            if (userRoleCheck(roles, user)) {
                next();
            } else {
                res.status(403).json(error("you have no access"));
            }
        } else {
            res.status(401).json(error("unauthorized"));
        }

    }
}
export default userRoleMidleware;