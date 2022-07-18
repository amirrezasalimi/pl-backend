import User from "./user";

export default interface Message {
    user: User;
    text: string;
}