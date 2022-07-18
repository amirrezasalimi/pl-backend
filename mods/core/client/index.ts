import ui from "./ui";
import util from "./util";

class Client {
    mounted(PL: any) {
        window.PL = PL;

        util.registerEvents()

        ui.mountUi();

    }
}
export default Client;