import WebSocket from "ws";
import { nanoid } from "../../../helpers/nanoid";

class ClientManager {
    // sid: server unique id, cid: client unique id
    SID_LEN = 8; // max sid length
    sockets: { [sid: string]: WebSocket.WebSocket } = {}
    socket_ids: string[] = [];

    addClient(ws: WebSocket.WebSocket) {
        const sid = nanoid(this.SID_LEN);
        this.socket_ids.push(sid);
        this.sockets[sid] = ws;
        return sid;
    }
    isClientExist(sid: string) {
        return this.socket_ids.indexOf(sid) > -1;
    }

    removeClientById(sid: string) {
        const found = this.socket_ids.indexOf(sid) > -1;
        if (found) {
            delete this.sockets[sid];
            this.socket_ids.splice(this.socket_ids.indexOf(sid), 1);
        }
    }


    getClients() {
        return this.sockets;
    }
    getClientsIds() {
        return this.socket_ids;
    }
}
const clientManager = new ClientManager();
export default clientManager;