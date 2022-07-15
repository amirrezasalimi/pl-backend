import { User } from "../models/user";

const userRoleCheck = (roles: string[], user: User) => {
    if (user) {
        for (const role of roles) {
            const userRoles = user.roles.split(",");
            if (!userRoles.includes(role)) {
                return false;
            }
        }
    }
    return true;
}
export default userRoleCheck;