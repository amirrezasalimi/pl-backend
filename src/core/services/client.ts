import clientState from "../../global/client-state";
import metaService from "./db/meta";

class ClientService {

    stateById(id: string) {
        return clientState.state[id] ?? {};
    }
    
    deleteStateById(id: string) {
        delete clientState.state[id];
    }
    emptyById(id: string) {
        clientState.client_ids = clientState.client_ids.filter(x => x !== id);
        delete clientState.state[id];
    }
    emptyAll() {
        clientState.client_ids = [];
        clientState.state = {};
    }

}
const clientService = new ClientService();
export default clientService;