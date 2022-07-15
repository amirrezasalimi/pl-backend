import hiBaby from "./src/test";

class Server {
  mounted() {
    console.log(PL.sharedState);
    hiBaby();    
  } 

}
export default Server;