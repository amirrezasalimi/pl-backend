import { Express } from "express"
import WebSocket from "ws";
import PL_SHARED from "../../global/pixel-land-shared";
import { log } from "../../helpers/log";
import modLoader from "../mod/mod-loader";
import database from "../services/db/database";
import PixelLandRouteHandler from "./route-handler";
import clientManager from "./socket/client-manager";
import WsEvent from "./ws-event";
const PixelLandEntry = async (app: Express) => {
    // @ts-ignore
    global.log = log
    PL_SHARED.ws = new WsEvent();

    // ws event
    clientManager.registerEvents();



    // 
    database.init();
    await modLoader.init();


    // http
    PixelLandRouteHandler(app);
}
export default PixelLandEntry;