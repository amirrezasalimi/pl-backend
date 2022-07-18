import { JWT_PRIVATE_KEY } from "../../../constants/config";
import { bcryptCheckPassword, bcryptPassword } from "../../../helpers/bcrypt-password";
import makeid from "../../../helpers/makeid";
import { nanoid } from "../../../helpers/nanoid";
import ILogin from "../../../models/api/login";
import IRegister from "../../../models/api/register";
import userService from "../db/user";
import jwt from "jsonwebtoken";
class AuthService {

    login(data: ILogin) {
        return new Promise((resolve, reject) => {
            const user = userService.getByEmail(data.email);
            if (user) {
                if (bcryptCheckPassword(data.password, user.password)) {
                    console.log("hi   ", user);
                    
                    const token = jwt.sign({
                        id: user.id,
                    }, JWT_PRIVATE_KEY);
                    const expireSeconds = 60 * 60 * 24 * 7;
                    const t = new Date();
                    t.setSeconds(t.getSeconds() + expireSeconds);
                    resolve({
                        user: {
                            id: user.id??0,
                            fullname: user.fullname,
                            email: user.email,
                            isGuest: user.isGuest,
                        },
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
    guestEmailPrefix = "guest.";
    register(data: IRegister) {
        const isGuest = data.email.startsWith(this.guestEmailPrefix) ? "1" : "0";
        const check = userService.add({
            email: data.email,
            password: bcryptPassword(data.password),
            fullname: "",
            roles: "",
            username: "",
            isGuest
        });

        if (check) {
            return {
                fullname: data.fullname,
                email: data.email,
                isGuest
            };
        }
    }
    async asGuest() {
        const _newId = makeid(8);
        const fullname = `Guest-${_newId}`;
        const email = `${this.guestEmailPrefix}${_newId}@pl.io`;
        const password = nanoid(8);
        let register_res = this.register({
            fullname,
            email,
            password: password,
        })
        if (register_res) {
            const _user = await this.login({
                email,
                password,
            })
            if (_user) {
                return {
                    user: {
                        id: (_user as any).user.id,
                        fullname,
                        email,
                    },
                    token: (_user as any).token
                }
            }
        }
        return false;
    }
}
const authService = new AuthService();
export default authService;