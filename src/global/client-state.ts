interface ClientState {
    client_ids: string[];
    state: { [key: string]: any };
}
const clientState: ClientState = {
    client_ids: [],
    state: {}
}
export default clientState;