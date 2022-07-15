import { User } from "../models/user";

const roleCheck = (role: string, user: User) => {
    return user.roles.includes(role);
}
export default roleCheck;