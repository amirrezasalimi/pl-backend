import express from 'express';
import PixelLandWs from './core/app/ws';
import http from "http"
import { APP_PORT, MODS_DIR } from './constants/config';
import PixelLandEntry from './core/app/entry';
import chokidar from 'chokidar';
import touch from 'touch'
var cors = require('cors')
var bodyParser = require('body-parser')

const app = express();
app.use(cors())
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
// your beautiful code...
console.log('PixelLand is starting....');

// pixel land
PixelLandEntry(app)


// end
const server = http.createServer(app);
// websocket
PixelLandWs(server);


if (process.env.NODE_ENV !== 'production') {
    chokidar.watch(`${__dirname}/${MODS_DIR}`, {
        ignored(testString) {
            //    if has  dist and node_modules
            return testString.includes('node_modules') || testString.includes('dist');
        },
    }).on("change", () => {

        // TODO: add reload mods for server and client files


        // TODO: remove this
        // node js excute command
        touch(`main.ts`)
        console.log("restarting...");
    })
}

app.use(express.static('../public'));

server.listen(APP_PORT);

export const viteNodeApp = app;