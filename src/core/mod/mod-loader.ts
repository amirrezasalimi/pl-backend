import modState from "../../global/mods";
import fs, { existsSync, fsync, mkdirSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from "fs-extra"
import { MODS_DIR, MOD_ASSETS, MOD_DIST } from "../../constants/config";
import path from "path";
import ModInfo from "../../models/mod-info";
import { log } from "console-log-colors";
import { getDirectories } from "../../helpers/get-directories";
import babel from "@babel/core";
import { rollup } from "rollup"
class ModLoader {
    constructor() {

    }
    async loadModFile(modName: string, filename: string) {
        return new Promise((resolve, reject) => {
            const _filename = path.join(__dirname, MODS_DIR, modName, filename);
            fs.readFile(_filename, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        })
    }
    async loadModsToState() {
        // load all mods
        let names = (await this.loadModNames()) as string[];
        if (names.length) {
            for (let name of names) {
                try {
                    let mod_info = await this.loadModFile(name, "info.json") as ModInfo;
                    mod_info = JSON.parse(mod_info.toString());
                    if (mod_info) {
                        const _mod_dir = path.join(__dirname, MODS_DIR, name);

                        modState.mods_names.push(name);
                        modState.mod_by_name[name] = {
                            id: mod_info.id,
                            name: mod_info.name,
                            version: mod_info.version ?? "1.0.0",
                            author: mod_info.author ?? "unknown",
                            description: mod_info.description ?? "unknown",
                            dependencies: mod_info.dependencies ?? [],
                            status: mod_info.disabled ? "deactive" : "not-mounted",
                            client_file: `${_mod_dir}/client.js`,
                            server_file: `${_mod_dir}/server.js`,
                            last_cache_client_ts: 0,
                            last_cache_server_ts: 0,
                            last_updated_ts: 0,
                            server_instance: null,
                            assets_dir: `${_mod_dir}/${MOD_ASSETS}`,
                        };

                        // compile server.js to commonjs
                        await this.writeNewServerCode(name);
                        modState.mod_state_by_name[name] = {}
                        log.blue(`pixel-land: load mod ${name}`);
                    }
                } catch (e: any) {
                    log.red(`pixel-land: [error] load mod '${name}', ${e.message}`, e.stack);
                }
            }
        }
    }
    isModeMounted(name: string) {
        return modState.mod_by_name[name].status === "mounted";
    }
    async disposeMod(name: string) {
        // unmount mod server.js
        const _instance = modState.mod_by_name[name].server_instance;
        if (_instance && typeof _instance.unmounted === "object") {
            _instance.unmounted();
            modState.mod_by_name[name].server_instance = null;
            log.grey(`pixel-land: unmount mod ${name}`);
        }
    }
    async mountModScript(name: string) {
        // mount mod server.js
        const _file = modState.mod_by_name[name].server_file;
 
        if (_file) {
            try { 
                let _mod = await import(_file);
                if (_mod.default) {
                    let _mod_instance; 
                    _mod_instance = _mod.default; 
                    _mod_instance = new _mod_instance();
                    modState.mod_by_name[name].server_instance = _mod_instance;
                    log.blue(`pixel-land: mount mod ${name}`);
                    _mod_instance.mounted();
                }
            }
            catch (e: any) {
                log.red(`pixel-land: [error] mount mod '${name}', ${e.message}`, e.stack);
            }

        }
    }
    async mountLoadedMods() {
        // mount all loaded mods 
        for (let name of modState.mods_names) {
            if (modState.mod_by_name[name].status === "not-mounted") {
                await this.mountModScript(name);
            }
        }
    }
    async init() {
        log.black("##########")
        log.green(`pixel-land: mods init`);
        await this.loadModsToState();
        this.mountLoadedMods();
    }
    async loadModNames() {
        // load mod names from local files
        return new Promise((resolve, reject) => {
            let modsListDir = path.join(__dirname, MODS_DIR)
            return fs.readdir(modsListDir, (err, files) => {
                if (err) {
                    return reject(err);
                }
                resolve(files);
            });
        })
    }
    unload(name: string) {
        modState.mod_by_name[name].status = "deactive";
        // raise deactive event
    }
    getMods() {
        return modState.mods_names;
    }
    async bundleServerCode(mod_name: string) {
        const server_file_path = path.join(__dirname, MODS_DIR, mod_name, "server.js");

        return new Promise(async (resolve, reject) => {
            try {
                let bundle = await rollup({
                    input: server_file_path,
                });
                let _res = await bundle.generate({ format: "commonjs" });
                if (_res.output.length) {
                    return resolve(_res.output[0].code)
                }
            }
            catch (e) {
                reject(e);
            }
        })
    }
    async transformServerCode(mod_name: string) {
        return new Promise(async (resolve, reject) => {
            const _codes = await this.bundleServerCode(mod_name) as string;
            if (_codes) {
                babel.transform(_codes, {
                    plugins: [
                        '@babel/plugin-transform-modules-commonjs'
                    ]
                }, (err, result) => {
                    if (err || !result) {
                        return reject(err);
                    }
                    resolve(result.code as string);
                })
            } else {
                reject("no code");
            }
        })
        // transform server code
    }
    async writeNewServerCode(mod_name: string) {
        const _codes = await this.transformServerCode(mod_name) as string;
        const new_server_file_path = path.join(__dirname, MODS_DIR, mod_name, MOD_DIST, "server.js");
        modState.mod_by_name[mod_name].last_cache_server_ts = Date.now();
        modState.mod_by_name[mod_name].server_file = new_server_file_path;
        if (_codes) {
            const _dist_dir = path.dirname(new_server_file_path);
            if (!existsSync(_dist_dir)) {
                mkdirSync(_dist_dir);
            }
            if (existsSync(new_server_file_path)) {
                unlinkSync(new_server_file_path);
            }
            writeFileSync(new_server_file_path, _codes);
        }
    }
    async getModAssets(name: string) {
        // check assets
        const assetsDir = modState.mod_by_name[name].assets_dir;
        let assets: String[] = [];
        if (fs.existsSync(assetsDir)) {
            let assetsList = await getDirectories(assetsDir) as string[];
            let newAssetsDir = assetsDir.replaceAll("\\", "/")
            if (assetsList && assetsList.length) {
                assets = assetsList.map(file => file.replace(newAssetsDir, ""));
            }
        }
        return assets
    }


    // client tools
    getClientModFile(name: string) {
        if (modState.mod_by_name[name]) {
            return modState.mod_by_name[name].client_file;
        }
        throw new Error(`mod ${name} not found`);
    }
}
const modLoader = new ModLoader();
export default modLoader;