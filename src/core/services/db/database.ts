import BetterSqlite3 from "better-sqlite3"
import { MAIN_DATABASE } from "../../../constants/config";
import path from "path"
class Database {
    // @ts-ignore
    db: BetterSqlite3.Database;
    init() {   
        this.db = new BetterSqlite3(path.join(__dirname, MAIN_DATABASE));
    }
}
const database = new Database();
export default database;