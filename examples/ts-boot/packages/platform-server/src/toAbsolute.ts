import { isString } from '@tsdi/ioc';
import * as path from 'path';
import { existsSync } from 'fs';


/**
 * sync require.
 *
 * @export
 * @param {string} filename
 * @returns {*}
 */
export function syncRequire(filename: string): any {
    return require(filename);
}

/**
 * convert path to absolute path.
 *
 * @export
 * @param {string} root
 * @param {string} pathstr
 * @returns {string}
 */
export function toAbsolutePath(root: string, pathstr: string): string {
    if (!root || path.isAbsolute(pathstr)) {
        return path.normalize(pathstr);
    }
    return path.join(path.normalize(root), path.normalize(pathstr));
}

/**
 * get run main path.
 *
 * @export
 * @returns {string}
 */
export function runMainPath(): string {
    let cwd = process.cwd();
    if (process.mainModule && process.mainModule.filename && process.mainModule.filename.startsWith(cwd)) {
        return path.dirname(process.mainModule.filename);
    }
    if (process.argv.length > 2) {
        let mainfile = process.argv.slice(2).find(arg => /(\w+\.ts|\.js)$/.test(arg) && existsSync(path.join(cwd, arg)));
        if (mainfile) {
            return path.dirname(path.join(cwd, mainfile));
        }
    }
    return cwd;
}

/**
 * convert src to absolute path src.
 *
 * @export
 * @param {string} root
 * @param {(string|string[])} src
 * @returns {(string|string[])}
 */
export function toAbsoluteSrc(root: string, src: string | string[]): string | string[] {
    if (isString(src)) {
        return prefixSrc(root, src);
    } else {
        return src.map(p => prefixSrc(root, p));
    }
}

function prefixSrc(root: string, strSrc: string): string {
    let prefix = '';
    if (/^!/.test(strSrc)) {
        prefix = '!';
        strSrc = strSrc.substring(1, strSrc.length);
    }
    return prefix + toAbsolutePath(root, strSrc);
}
