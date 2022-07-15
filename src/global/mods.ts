import Mod from "../models/mod";

interface ModState {
    mod_by_name: { [name: string]: Mod };
    mods_names: string[];
    mod_state_by_name: { [name: string]: any };

}
const modState: ModState = {
    mod_by_name: {},
    mods_names: [], 
    mod_state_by_name: {},
}
export default modState;