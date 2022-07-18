import ui from "./ui";

class ChatClientUtil {
    sendMsg(text: string) {
        PL.ws.emit("chat:msg", { text });
    }
    registerEvents(){ 
        PL.ws.on("chat:msg", (data: any) => {
            console.log("hi");
            ui.addMessage(data.text);
        });
    }
}
export default new ChatClientUtil();