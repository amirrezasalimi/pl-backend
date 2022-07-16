import modState from "../../global/mods";
import sharedState from "../../global/shared-state";
import ModKeyValueDb from "../services/storage/mod-db";
import ModStorage from "../services/storage/mod-storage";
import ModWs from "./mod-ws";

class PixelLandMod {
    state: any;
    sharedState = sharedState
    mod = modState.mod_by_name
    storage: ModStorage;
    db: ModKeyValueDb
    ws: ModWs;
}
export default PixelLandMod;