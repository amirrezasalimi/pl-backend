import express from 'express';
import PixelLandWs from './core/app/ws';
import http from "http"
import { APP_PORT, MODS_DIR } from './constants/config';
import PixelLandEntry from './core/app/entry';
import chokidar from 'chokidar';
import { exec } from "child_process"
import touch from 'touch'
var cors = require('cors')

const app = express();
app.use(cors())
// your beautiful code...
console.log('PixelLand is starting....');

const server = http.createServer(app);
// pixel land
PixelLandEntry(app)
// websocket
PixelLandWs(server);

// end


if (process.env.NODE_ENV !== 'production') {
    chokidar.watch(`${__dirname}/${MODS_DIR}`, {
        ignored(testString) {
            //    if has  dist and node_modules
            return testString.includes('node_modules') || testString.includes('dist');
        },
    }).on("change", () => {

        // todo: add reload mods for server and client files


        // todo: remove this
        // node js excute command
        touch(`main.ts`)
        console.log("restarting...");
    })
}

app.use(express.static('../public'));

server.listen(APP_PORT);

export const viteNodeApp = app;