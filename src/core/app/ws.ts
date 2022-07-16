import WebSocket from "ws";
import { SOCKET_PATH, SOCKET_PORT } from "../../constants/config";
import clientManager from "./socket/client-manager";
import PL_SHARED from "../../global/pixel-land-shared";


const PixelLandWs = async (server: any) => {
    const wss = new WebSocket.Server({
        // port: SOCKET_PORT,
        server,
        path: SOCKET_PATH
    });
    console.log(`##PixelLand is running on port WS://localhost:${SOCKET_PORT}${SOCKET_PATH}`);

    wss.on('connection', ws => {
        const sid = clientManager.addClient(ws);
        ws.on('message', message => {
            try {
                const data = JSON.parse(message.toString());
                if (typeof data.name === "string") {
                    PL_SHARED.ws.emitLocal(data.name, data, sid,ws);
                }
            }
            catch (e) {
                console.log(e);
            }
        })
    })

};
export default PixelLandWs; 