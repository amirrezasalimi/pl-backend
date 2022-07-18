import clientManager from "../core/app/socket/client-manager"
import WsEvent from "../core/app/ws-event"
import modState from "./mods"

class pixelLandShared {
    modState = modState
    mod = modState.mod_by_name
    state = modState.mod_state
    ws: WsEvent
    mods = modState.mod_by_name
}
const PL_SHARED = new pixelLandShared();
export default PL_SHARED