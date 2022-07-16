class Server {
  mounted() {
    this.sayPing();
  }
  sayPing() {
    setInterval(() => {
      console.log("ping");
      PL.ws.broadcast("ping");
    }, 5000);

    PL.storage.data()
  }

}
export default Server;