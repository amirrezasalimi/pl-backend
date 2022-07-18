class ClientCmd{
    registredCommands: {[key: string]: (...args: any[]) => void};

}
export default new ClientCmd();