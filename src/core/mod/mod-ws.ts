import WebSocket from "ws";
import PL_SHARED from "../../global/pixel-land-shared";

class ModWs {
    mod_name: string;
    constructor(name: string) {
        this.mod_name = name;
    }
    on(event: string, cb: (data: any) => void) {
        return PL_SHARED.ws.on(this.mod_name, event, cb);
    }
    broadcast(event: string, data: any) {
        return PL_SHARED.ws.broadcast(event, data);
    }
    emit(ws: WebSocket.WebSocket, event: string, data: any) {
        return PL_SHARED.ws.emit(ws, event, data);
    }
    removeListener(event: string) {
        return PL_SHARED.ws.removeSingle(event, this.mod_name);
    }
    removeAllListeners() {
        return PL_SHARED.ws.remove(this.mod_name);
    }
}
export default ModWs;