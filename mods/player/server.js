let PL;
class Server {
  mounted(_) {
    PL=_;
    this.sayPing();
  }
  sayPing() {
    setInterval(() => {
      console.log("ping");
      PL.ws.broadcast("ping");
    }, 5000);

  }

}
export default Server;