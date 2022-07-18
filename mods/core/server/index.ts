import { MAX_MESSAGE_SHOW } from "@shares/constants";
import Message from "@shares/models/message";
import cmd from "./cmd";

class Server {
    messages: Message[] = [];

    msgTransform(msg: Message) {
        return `${msg.user.id}: ${msg.text}`
    }
    mounted(_: any) {
        global.PL = _;

        // init server
        cmd.mount();

        // register events

        PL.ws.on("chat:ready", (data: any, sid: string, client) => {
            this.messages.forEach(msg => {
                const user = msg.user;
                PL.ws.emit(client, "chat:msg", {
                    text: this.msgTransform({
                        user,
                        text: msg.text
                    })
                });
            })
        })
        PL.ws.on("chat:msg", (data: any, sid: string, client: any) => {
            const user = PL.clientManager.getClientUser(sid);
            
            if (!user?.id) {
                PL.ws.emit(client, "chat:msg", {
                    text: this.msgTransform({
                        user: {
                            id: 0,
                            email: "system",
                            fullname: "system"
                        },
                        text: "You need to login first"
                    })
                });
                return;
            }
            PL.ws.broadcast("chat:msg", {
                text: this.msgTransform({
                    user,
                    text: data.text
                })
            });
            if (this.messages.length > MAX_MESSAGE_SHOW) {
                this.messages.shift();
            }
            this.messages.push({
                user: {
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email
                },
                text: data.text
            })
        })
    }
}
export default Server;

