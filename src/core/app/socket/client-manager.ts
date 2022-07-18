import WebSocket from "ws";
import PL_SHARED from "../../../global/pixel-land-shared";
import { nanoid } from "../../../helpers/nanoid";
import jwt from "jsonwebtoken"
import { JWT_PRIVATE_KEY } from "../../../constants/config";
import userService from "../../services/db/user";
class ClientManager {
    // sid: server unique id, cid: client unique id
    SID_LEN = 8; // max sid length
    sockets: { [sid: string]: WebSocket.WebSocket } = {}
    socket_ids: string[] = [];
    socket_state: { [sid: string]: any } = {};

    addClient(ws: WebSocket.WebSocket) {
        const sid = nanoid(this.SID_LEN);
        this.socket_ids.push(sid);
        this.sockets[sid] = ws;
        this.socket_state[sid] = {
            connect_time: new Date().getTime(),
            user: {}
        };
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


    isClientUser(sid: string) {
        return this.socket_state?.[sid]?.user;
    }
    getClientState(sid: string) {
        return this.socket_state[sid];
    }
    getClientUser(sid: string) {
        return this.socket_state?.[sid]?.user;
    }
    getClients() {
        return this.sockets;
    }
    getClientsIds() {
        return this.socket_ids;
    }
    getClientList() {
        return this.socket_ids.map(sid => {
            const state = this.socket_state[sid];
            return {
                connect_time: state.connect_time,
                user: state.user
            }
        })
    }
    // 
    registerEvents() {
        const WSO = 'local';
        PL_SHARED.ws.on(WSO, "client:connect", (data: any, sid: number, ws: WebSocket.WebSocket) => {
            PL_SHARED.ws.broadcast("client:list", this.getClientList());
        })
        PL_SHARED.ws.on(WSO, "client:login", (data: any, sid: number, ws: WebSocket.WebSocket) => {
            jwt.verify(data.token, JWT_PRIVATE_KEY, (err: any, decoded: any) => {
                if (err) return;
                const user = userService.getById(decoded.id);

                if (user) {
                    this.socket_state[sid].user = {
                        id: user.id,
                        fullname: user.fullname,
                        email: user.email,
                        isGuest: user.isGuest == "1",
                        roles: user.roles.split(",")
                    };
                }
            })
        })
    }
}
const clientManager = new ClientManager();
export default clientManager;