export const CORE_COMMANDS_LIST = {
    "/add-role [player-id] [roles with ,] ": "Add roles to player",
    "/remove-role [player-id] [roles with ,] ": "Remove roles from player",
    "/ban [player-id] [reason]": {},
    "help": "Shows this message",
}
class ServerCmd { 
    registredCommands = {};



    mount() {
        this.wsEvents();
    }
    unmount() {
        PL.ws?.removeAllListeners?.();
    }
    wsEvents() {
        PL.ws.on("message", (data) => {

        })
    }
    updateClientCommandList() {

    }
    register(command: string, callback: (...args: any[]) => void, description: string, usage: string, aliases: string[]) {


    }
    remove(command: string) {

    }
    isCommand(command: string) {
        return command.startsWith("/");
    }
    runCommand(command: string) {
        return {}
    }
}
export default new ServerCmd();