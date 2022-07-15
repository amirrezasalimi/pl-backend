import { Request, Response } from "express";
import { nanoid } from "../../helpers/nanoid";
import { Express } from "express";
import modLoader from "../mod/mod-loader";
import modState from "../../global/mods";
import { error, ok } from "../../helpers/response";
import ModInfo from "../../models/mod-info";
import { existsSync, readFileSync, writeFileSync } from "fs-extra";
import { MODS_DIR, MOD_DIST, SERVER_URL } from "../../constants/config";
import UglifyJS from "uglify-js";
import path from "path"
export default function PixelLandRouteHandler(app: Express) {
    // mod list
    app.get("/mod/list", async (req: Request, res: Response) => {
        const mod_list = modState.mods_names;
        res.json(ok(
            {
                mods: mod_list
            }
        ))
    })
    app.get("/mod/:name/info.json", async (req: Request, res: Response) => {
        const name = req.params.name;
        const mod_info = modState.mod_by_name[name];
        if (mod_info) {
            let _assetsList = await modLoader.getModAssets(name);
            _assetsList = _assetsList.map((item) => `${SERVER_URL}/mod/${name}/assets${item}`);
            res.json({
                id: mod_info.id,
                name: mod_info.name,
                version: mod_info.version,
                author: mod_info.author,
                description: mod_info.description,
                dependencies: mod_info.dependencies,
                assets: _assetsList,
            } as ModInfo);
        }
        else {
            res.status(404).json(error(`mod ${name} not found`));
        }
    })

    // get mod client.js
    app.get("/mod/:name/client.js", (req: Request, res: Response) => {

        const name = req.params.name;
        const mod = modState.mod_by_name?.[name];
        if (mod) {
            let _minifyPath=path.join(__dirname, MODS_DIR, name,MOD_DIST, "client.min.js");
            if (!mod.minify_client_js) {
                const _fileContent = readFileSync(mod.client_file).toString();
                const _minify = UglifyJS.minify(_fileContent)
                writeFileSync(_minifyPath, _minify.code);
                mod.minify_client_js = _minifyPath;
            }
            res.sendFile(mod.minify_client_js ?? "");
            // minify before
        } else {
            res.status(404).json(error(`mod ${name} not found`));
        }
    })
    // handle mod assets
    app.get("/mod/:mod/assets/:file(*)", (req: Request, res: Response) => {
        const name = req.params.mod;
        const fileName = req.params.file;
        const mod = modState.mod_by_name?.[name];
        if (mod) {
            const fileCorrectPath = `${mod.assets_dir}/${fileName}`;
            if (existsSync(fileCorrectPath)) {
                res.sendFile(fileCorrectPath);
            } else {
                res.status(404).json(error(`assets not found`));
            }
        } else {
            res.status(404).json(error(`mod ${name} not found`));
        }
    })
    // developer tools
    app.get("/mod/reload-server", (req: Request, res: Response) => {

    })
    app.get("/mod/reload-client", (req: Request, res: Response) => {

    })
    app.get("/command/restart", (req: Request, res: Response) => {

    })

    // relaod mod source by name [client / server]
    app.get("/mod/reload-mod", (req: Request, res: Response) => {

    })
    app.get("/mod/reload-server", (req: Request, res: Response) => {

    })

    // install mod bt zip file | info { name, version, author , depdencies }
    app.get("/mod/install", (req: Request, res: Response) => {

    })

    // toggle mod off / on
    app.get("/mod/change-status", (req: Request, res: Response) => {

    })
    // user
    app.get("/user/login", (req: Request, res: Response) => {

    })
    app.get("/user/register", (req: Request, res: Response) => {

    })
    // managment
    app.get("/user/list", (req: Request, res: Response) => {

    })

    app.get("/user/search", (req: Request, res: Response) => {
        // search by role , by name , by id
    })

    // admin

    // backup
    app.get("/server/restore-backup", (req: Request, res: Response) => {
        // backup all mods / all data
    })
    app.get("/server/full-backup", (req: Request, res: Response) => {
        // backup all mods / all data
    })

    // role management
    app.get("/user/add-role", (req: Request, res: Response) => {

    })
    app.get("/user/remove-role", (req: Request, res: Response) => {
        // search by role , by name , by id
    })

    // action history
    // get action history with pagination
    app.get("/server/history/search/100?p={id}", (req: Request, res: Response) => {
        // search by user , by action name
    })
    // server actions history
    app.get("/", (req: Request, res: Response) => {
        res.json({
            test: '?? Hello World! =>' + nanoid(8)
        })
    });
}