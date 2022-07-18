import { WebSocket } from "ws";
import { wsData } from "../../helpers/ws-msg";
import clientManager from "./socket/client-manager";

interface IEventInfo {
    origin_id: string; // request id
    cb: (...args: any) => void;
}
class WsEvent {
    listeners: { [key: string]: IEventInfo[] } = {};
    on(origin_id: string, event: string, cb: (...args: any) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push({
            origin_id,
            cb: cb,
        });
    }
    emitLocal(event: string, data: any, sid: string, ws: WebSocket) {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event].forEach(({ cb }) => {
            try {
                cb(data.data, sid, ws);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    emit(ws: WebSocket, event: string, data: any) {
        try {
            ws.send(wsData(
                event,
                data,
            ));
        }
        catch (e) {
            console.log(e);
        }
    }
    broadcast(event: string, data: any = {}) {
        const clients = Object.values(clientManager.getClients());
        for (const ws of clients) {
            this.emit(ws, event, data);
        }
    }
    remove(origin_id: string) {
        for (const event in this.listeners) {
            this.listeners[event] = this.listeners[event].filter(({ origin_id: r }) => r !== origin_id);
        }
    }
    removeSingle(event: string, origin_id: string) {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event] = this.listeners[event].filter(({ origin_id: r }) => r !== origin_id);
    }
}
export default WsEvent;