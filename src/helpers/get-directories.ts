import { glob } from "glob";

export const getDirectories = async (src: string) => {
    // load files in directory
    return new Promise((resolve, reject) => {
        src = src.replaceAll("\\", "/");
        return glob(src + '/**/*', { nodir: true }, (err, res) => {
            if (err) {
                return reject(err);
            }
            resolve(res);
        });
    })
}