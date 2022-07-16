import metaService from "../db/meta";

class ModKeyValueDb {
    mod_name: string;
    constructor(mod_name: string) {
        this.mod_name = mod_name;
    }
    set(key: string, value: any) {
        metaService.save(`${this.mod_name}_${key}`, value);
    }
    get(key: string) { }
}
export default ModKeyValueDb;