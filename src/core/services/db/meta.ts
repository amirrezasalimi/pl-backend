import database from "./database";

class MetaService {
    table = 'meta';
    save(key: string, value: object) {
        // check if key exists
        const check = database.db.prepare(`SELECT * FROM ${this.table} WHERE key = ?`).get(key);
        if (check) {
            return database.db.prepare(`INSERT INTO ${this.table} (key, value) VALUES (?, ?)`).run(key, value);
        } else {
            return database.db.prepare(`UPDATE ${this.table} SET value = ? WHERE key = ?`).run(value, key);
        }
    }
    get(key: string) {
        return database.db.prepare(`SELECT * FROM ${this.table} WHERE key = ?`).get(key);
    }
    delete(key: string) {
        return database.db.prepare(`DELETE FROM ${this.table} WHERE key = ?`).run(key);
    }
}
const metaService = new MetaService();
export default metaService