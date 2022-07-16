import fs from "fs-extra";
import { MODS_DATA_DIR } from "../../../constants/config";
class ModStorage {
    mod_name: string;
    constructor(mod_name: string) {
        this.mod_name = mod_name;
    }
    cleanName(name: string) {
        return name.replace(/\\/g, "");
    }
    get(name: string): any {
        name = this.cleanName(name);
        return fs.readFile(`${MODS_DATA_DIR}/${this.mod_name}`);
    }
    write(name: string, value: any) {
        name = this.cleanName(name);
        return fs.writeFile(`${MODS_DATA_DIR}/${this.mod_name}`, value);
    }
    remove(name: string) {
        name = this.cleanName(name);
        return fs.remove(`${MODS_DATA_DIR}/${this.mod_name}`);
    }
    existsSync(name: string) {
        name = this.cleanName(name);
        return fs.existsSync(`${MODS_DATA_DIR}/${this.mod_name}`);
    }
}
export default ModStorage;