import {Express} from "express"
import PL from "../../global/pixel-land";
import modLoader from "../mod/mod-loader";
import database from "../services/db/database";
import PixelLandRouteHandler from "./route-handler";
const PixelLandEntry = async (app: Express) => {

    database.init();
    // @ts-ignore
    global.PL = PL;
    await modLoader.init();


    // http
    PixelLandRouteHandler(app);
}
export default PixelLandEntry;