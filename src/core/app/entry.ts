import { Express } from "express"
import PL_SHARED from "../../global/pixel-land-shared";
import { log } from "../../helpers/log";
import modLoader from "../mod/mod-loader";
import database from "../services/db/database";
import PixelLandRouteHandler from "./route-handler";
import WsEvent from "./ws-event";
const PixelLandEntry = async (app: Express) => {

    // @ts-ignore
    global.log = log
    PL_SHARED.ws = new WsEvent();
    database.init();
    await modLoader.init();


    // http
    PixelLandRouteHandler(app);
}
export default PixelLandEntry;