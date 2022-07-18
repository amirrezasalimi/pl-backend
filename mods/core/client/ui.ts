import { MAX_MESSAGE_SHOW } from "@shares/constants";
import loadCss from "@shares/load-css";
import util from "./util";

class ChatUi {
    container_el: HTMLDivElement;
    msg_list_el: HTMLDivElement;
    msg_input_el: HTMLInputElement;
    mountUi() {
        loadCss(PL.assetUrl("ui.css"));
        const container = document.createElement('div');
        container.classList.add("chat-container");

        const msg_list_el = document.createElement('div');
        msg_list_el.classList.add('msg-list');


        const msg_input_el = document.createElement('input');
        msg_input_el.classList.add('msg-input');
        msg_input_el.type = 'text';
        msg_input_el.placeholder = 'Type ...';
        msg_input_el.addEventListener('keypress', (e) => {
            let msg = msg_input_el.value;
            if (e.key === 'Enter' && msg.length > 0) {
                util.sendMsg(msg);
                msg_input_el.value = '';
            }
        })
        this.msg_list_el = msg_list_el;


        container.appendChild(msg_list_el);
        container.appendChild(msg_input_el);
        this.container_el = container;
        document.body.appendChild(container);

        PL.ws.emit("chat:ready")

    }
    unmountUi() {
        this.container_el.remove();
    }
    removeOldMessages() {
        let msgs = this.msg_list_el.querySelectorAll('.msg-item');
        if (msgs.length > MAX_MESSAGE_SHOW) {
            this.msg_list_el.removeChild(msgs[0]);
        }
    }
    scrollToBottom() {
        setTimeout(() => {
            this.msg_list_el.scrollTop = this.msg_list_el.scrollHeight;
        },100);
    }
    addMessage(text: string) {
        const msg_item = document.createElement('div');
        msg_item.classList.add('msg-item');
        msg_item.innerHTML = text;
        this.msg_list_el.appendChild(msg_item);
        this.removeOldMessages();
        this.scrollToBottom();
    }
}
export default new ChatUi();