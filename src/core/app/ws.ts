import WebSocket from "ws";
import { SOCKET_PATH, SOCKET_PORT } from "../../constants/config";
import clientManager from "./socket/client-manager";
import cp from "child_process"
import { wsData } from "../../helpers/ws-msg";

const PixelLandWs = async (server:any) => {
    const wss = new WebSocket.Server({
        // port: SOCKET_PORT,
        server,
        path: SOCKET_PATH
    });
    console.log(`##PixelLand is running on port WS://localhost:${SOCKET_PORT}${SOCKET_PATH}`);

    wss.on('connection', ws => {
        const sid = clientManager.addClient(ws);
        ws.on('message', message => {
            console.log(`Received message => ${message}`)
        })
        ws.send(wsData("chat:msg",{
             
            
        }))
    })

};
export default PixelLandWs; 