import { JWT_PRIVATE_KEY } from "../../../constants/config";
import { bcryptCheckPassword, bcryptPassword } from "../../../helpers/bcrypt-password";
import nowTs from "../../../helpers/now-ts";
import ILogin from "../../../models/api/login";
import IRegister from "../../../models/api/register";
import userService from "../db/user";
var jwt = require('jsonwebtoken');
class AuthService {

    login(data: ILogin) {
        return new Promise((resolve, reject) => {
            const user = userService.getByEmail(data.email);
            if (user) {
                if (bcryptCheckPassword(data.password, user.password)) {
                    const token = jwt.sign({
                        id: user.id,
                    }, JWT_PRIVATE_KEY);
                    const expireSeconds = 60 * 60 * 24 * 7;
                    const t = new Date();
                    t.setSeconds(t.getSeconds() + expireSeconds);
                    resolve({
                        token: token,
                        expires_ts: t.getTime(), // 7 days // timestamp
                    })
                } else {
                    reject("Password is incorrect");
                }
            } else {
                reject("User not found");
            }
        })
    }
    register(data: IRegister) {
        return userService.add({
            email: data.email,
            password: bcryptPassword(data.password),
            fullname: "",
            roles: "",
            username: ""
        });
    }
}
const authService = new AuthService();
export default authService;