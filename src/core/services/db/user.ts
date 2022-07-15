import { User } from "../../../models/user";
import database from "./database";
import metaService from "./meta";

class UserService {
    table = 'users';
    getById(id: number) {
        return database.db.prepare(`SELECT * FROM ${this.table} WHERE id = ?`).get(id);
    }
    add(user: User) {
        const check = database.db.prepare(`SELECT * FROM ${this.table} WHERE email = ?`).get(user.email);
        if (check) {
            return false;
        }
        return database.db.prepare(`INSERT INTO ${this.table} (fullname, email, password) VALUES (?, ?, ?)`).run(user.fullname, user.email, user.password);
    }
    getByEmail(email: string) {
        return database.db.prepare(`SELECT * FROM ${this.table} WHERE email = ?`).get(email);
    }
    update(id: number, user: User) {
        return database.db.prepare(`UPDATE ${this.table} SET fullname = ?, email = ?, password = ? WHERE id = ?`).run(user.fullname, user.email, user.password, id);
    }
    delete(id: number) {
        return database.db.prepare(`DELETE FROM ${this.table} WHERE id = ?`).run(id);
    }
    saveMeta(userId: number, metaKey: string, meta: any) {
        metaService.save(`user-${userId}-${metaKey}`, meta);
    }

    // roles
    getRoles(userId: number) {
        return database.db.prepare(`SELECT * FROM ${this.table} WHERE user_id = ?`).get(userId).roles ?? "";
    }
    addRole(userId: number, role: string) {
        const user = this.getById(userId);
        if (user) {
            const newRoles = [...user.roles, role].join(",");
            return database.db.prepare(`UPDATE ${this.table} SET roles = ? WHERE user_id = ?`).run(newRoles, userId);
        } else {
            return database.db.prepare(`INSERT INTO ${this.table} (user_id, roles) VALUES (?, ?)`).run(userId, role);
        }
    }

}
const userService = new UserService();
export default userService;