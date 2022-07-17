import { nanoid } from "../../helpers/nanoid";
import modLoader from "../mod/mod-loader";
import modState from "../../global/mods";
import { error, ok } from "../../helpers/response";
import ModInfo from "../../models/mod-info";
import { existsSync, readFileSync, writeFileSync } from "fs-extra";
import { MODS_DIR, MOD_DIST, SERVER_URL } from "../../constants/config";
import UglifyJS from "uglify-js";
import path from "path"
import authService from "../services/api/auth";
import userMidleware from "../midleware/user";
import express from "express"
import { Request, Response, Express } from "express";
import { User } from "../../models/user";

export default function PixelLandRouteHandler(app: Express) {

    // can accesible by /api prefix

    const routes = express.Router();
    // mod list
    routes.get("/mod/list", async (req: Request, res: Response) => {
        const mod_list = modState.mods_names;
        res.json(ok({
            mods: mod_list
        }))
    })
    routes.get("/mod/:name/info.json", async (req: Request, res: Response) => {
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
    routes.get("/mod/:name/client.js", async (req: Request, res: Response) => {

        const name = req.params.name;
        const mod = modState.mod_by_name?.[name];
        if (mod) {
            let newFilePath = path.join(__dirname, MODS_DIR, name, MOD_DIST, "client.js");
            if (!mod.new_client_file) {
                try {
                    const _fileContent = await modLoader.bundleClientCode(name) as string;
                    if (_fileContent) {
                        const _minify = UglifyJS.minify(_fileContent)
                        writeFileSync(newFilePath, _minify.code);
                        mod.new_client_file = newFilePath;
                    }
                } catch (e) {
                    res.json(error(e as string));
                }
            }
            if (mod.new_client_file) {
                res.sendFile(mod.new_client_file);
            }
            // minify before
        } else {
            res.status(404).json(error(`mod ${name} not found`));
        }
    })
    // handle mod assets
    routes.get("/mod/:mod/assets/:file(*)", (req: Request, res: Response) => {

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


    // user auth
    routes.post("/user/login", (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        if (email && password) {
            authService.login({
                password,
                email
            }).then((result: any) => {
                res.json(ok(result));
            }).catch((err: any) => {
                res.json(error(err));
            })
        } else {
            res.status(400).json(error("email and password required"));
        }

    })
    routes.post("/user/register", (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        if (email && password) {
            const _user = authService.register({
                email: email,
                password: password
            })
            if (_user) {
                res.json(ok({
                    user: _user
                }))
            } else {
                res.status(400).json(error("email already exists"))
            }
        } else {
            res.status(400).json(error("email and password required"));
        }


    })
    routes.post("/user/as-guest", async (req: Request, res: Response) => {
        const guest = await authService.asGuest();
        if (guest) {
            res.json(ok(guest))
        } else {
            res.json(error())
        }
    })
    // routes with user
    const userRouter = express.Router();
    userRouter.use(userMidleware)

    userRouter.get("/check", (req: Request, res: Response) => {
        const user = (req as any).user as User;
        res.json(ok(
            {
                user: {
                    fullname: user.fullname,
                    email: user.email,
                    isGuest: user.isGuest=="1",
                }
            }
        ))
    })

    // admin
    // developer tools
    userRouter.get("/mod/reload-server", (req: Request, res: Response) => {
        res.json(ok({
            message: "done"
        }))
    })
    userRouter.get("/mod/reload-client", (req: Request, res: Response) => {

    })

    // relaod mod source by name [client / server]
    userRouter.get("/mod/reload-mod", (req: Request, res: Response) => {

    })
    // install mod bt zip file | info { name, version, author , depdencies }
    userRouter.get("/mod/install", (req: Request, res: Response) => {

    })

    // toggle mod off / on
    userRouter.get("/mod/change-status", (req: Request, res: Response) => {

    })

    // managment
    userRouter.get("/user/list", (req: Request, res: Response) => {

    })

    userRouter.get("/user/search", (req: Request, res: Response) => {
        // search by role , by name , by id
    })

    // admin

    // backup
    userRouter.get("/server/restore-backup", (req: Request, res: Response) => {
        // backup all mods / all data
    })
    userRouter.get("/server/full-backup", (req: Request, res: Response) => {
        // backup all mods / all data
    })

    // role management
    userRouter.get("/user/add-role", (req: Request, res: Response) => {

    })
    userRouter.get("/user/remove-role", (req: Request, res: Response) => {
        // search by role , by name , by id
    })

    // action history
    // get action history with pagination
    userRouter.get("/server/history/search/100?p={id}", (req: Request, res: Response) => {
        // search by user , by action name
    })

    routes.use("/user", userRouter)


    // end

    // server actions history
    routes.get("/", (req: Request, res: Response) => {
        res.json({
            test: '?? Hello World! =>' + nanoid(8)
        })
    });

    app.use("/api", routes)
}