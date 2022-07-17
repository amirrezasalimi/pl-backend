import modState from "../../global/mods";
import PL_SHARED from "../../global/pixel-land-shared";
import sharedState from "../../global/shared-state";
import ModKeyValueDb from "../services/storage/mod-db";
import ModStorage from "../services/storage/mod-storage";
import ModWs from "./mod-ws";

class ModShared {
    mod_name: string;
    // state: any;
    sharedState = sharedState
    mod = PL_SHARED.mod;
    storage: ModStorage;
    db: ModKeyValueDb
    ws: ModWs;
    constructor(name: string) {
        this.mod_name = name;
        this.storage = new ModStorage(name);
        this.db = new ModKeyValueDb(name);
        this.ws = new ModWs(name);
    }
}
export default ModShared;