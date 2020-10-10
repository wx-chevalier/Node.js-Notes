import { Src, WorkflowContextToken } from '@tsdi/activities';
import { Injectable, ObjectMap, Express2, isArray, isString, lang, Inject } from '@tsdi/ioc';
import { toAbsolutePath, runMainPath, syncRequire } from '@tsdi/platform-server';
import { existsSync, readdirSync, lstatSync } from 'fs';
import { join, dirname, normalize, relative, basename, extname } from 'path';
import {
    mkdir, cp, rm
    /* ls, test, cd, ShellString, pwd, ShellArray, find, mv, TestOptions, cat, sed */
} from 'shelljs';
// import * as globby from 'globby';
import { ProcessRunRootToken } from '@tsdi/boot';
import { IContainer, ContainerToken } from '@tsdi/core';
import { CompilerOptions } from 'typescript';
import { NodeActivityContext } from './NodeActivityContext';
import { PlatformServiceToken, CmdOptions } from './IPlatformService';
const globby = require('globby');
const minimist = require('minimist');
const del = require('del');



@Injectable(PlatformServiceToken)
export class PlatformService {

    constructor(@Inject(WorkflowContextToken) private ctx: NodeActivityContext) {

    }

    @Inject(ContainerToken)
    container: IContainer;

    packageFile = 'package.json';

    private envArgs: ObjectMap;

    /**
     * get evn args.
     *
     * @returns {ObjectMap}
     * @memberof NodeContext
     */
    getEnvArgs(): ObjectMap {
        if (!this.envArgs) {
            this.envArgs = minimist([...this.ctx.args, ...process.argv.slice(2)]);
        }
        return this.envArgs;
    }

    hasArg(arg): boolean {
        return process.argv.indexOf(arg) > -1 || process.argv.indexOf('--' + arg) > -1;
    }

    /**
     * get root folders.
     *
     * @param {Express2<string, string, boolean>} [express]
     * @returns {string[]}
     * @memberof NodeContext
     */
    getRootFolders(express?: Express2<string, string, boolean>): string[] {
        return this.getFolders(this.getRootPath(), express);
    }

    getCompilerOptions(tsconfig: string): CompilerOptions {
        let filename = this.toRootPath(tsconfig);
        let cfg = syncRequire(filename) || {};
        return cfg.compilerOptions || {};

        // let cfg = readConfigFile(this.toRootPath(tsconfig), sys.readFile);
        // if (cfg.error) {
        //     console.log(cfg.error.messageText);
        // }
        // let parsed = parseJsonConfigFileContent(cfg.config || {}, {
        //     useCaseSensitiveFileNames: sys.useCaseSensitiveFileNames,
        //     readDirectory: sys.readDirectory,
        //     fileExists: sys.fileExists,
        //     readFile: sys.readFile
        // }, this.getRootPath());
        // console.log(parsed);
        // return parsed.options;
    }

    getFileName(pathName: string): string {
        return basename(pathName).replace(extname(pathName), '');
    }

    /**
     * get folders of path.
     *
     * @param {string} pathstr
     * @param {Express2<string, string, boolean>} [express]
     * @returns {string[]}
     * @memberof NodeContext
     */
    getFolders(pathstr: string, express?: Express2<string, string, boolean>): string[] {
        pathstr = normalize(pathstr);
        let dir = readdirSync(pathstr);
        let folders = [];
        dir.forEach(d => {
            let sf = join(pathstr, d);
            let f = lstatSync(sf);
            if (f.isDirectory()) {
                if (express) {
                    let fl = express(sf, d);
                    if (fl) {
                        folders.push(fl);
                    }
                } else {
                    folders.push(sf);
                }
            }
        });
        return folders;
    }

    /**
     * filter fileName in directory.
     *
     * @param {Src} express
     * @param {(fileName: string) => boolean} [filter]
     * @param {(filename: string) => string} [mapping]
     * @returns {Promise<string[]>}
     * @memberof NodeContext
     */
    async getFiles(express: Src, filter?: (fileName: string) => boolean, mapping?: (filename: string) => string): Promise<string[]> {
        lang.assertExp(isString(express) || isArray(express), 'input express param type error!');
        let filePaths: string[] = await globby(express);
        if (filter) {
            filePaths = filePaths.filter(filter);
        }

        if (mapping) {
            return filePaths.map(mapping);
        }

        return filePaths;
    }

    copyFile(src: Src, dist: string, options?: CmdOptions) {
        if (options && options.force) {
            rm('-f', dist);
            cp(src, dist);
        } else {
            cp(src, dist);
        }
    }

    existsFile(filename: string): boolean {
        return existsSync(this.toRootPath(filename));
    }

    copyDir(src: Src, dist: string, options?: CmdOptions) {
        if (!existsSync(dist)) {
            mkdir('-p', dist);
        }
        if (options && options.force) {
            rm('-rf', normalize(join(dist, '/')));
            mkdir('-p', normalize(join(dist, '/')));
            cp('-R', normalize(src + '/*'), normalize(join(dist, '/')));
        } else {
            cp('-R', normalize(src + '/*'), normalize(join(dist, '/')));
        }
    }

    async copyTo(filePath: string, dist: string): Promise<any> {
        const outFile = join(dist, filePath.replace(/(node_modules)[\\\/]/g, ''));
        return new Promise((res) => {
            if (!existsSync(outFile)) {
                if (!existsSync(dirname(outFile))) {
                    mkdir('-p', dirname(outFile));
                }
                cp('-R', join(filePath), outFile);
                res();
            }
        });
    }

    del(src: Src, opts?: { force?: boolean, dryRun?: boolean }): Promise<any> {
        return del(src, opts);
    }

    /**
     * to root path.
     *
     * @param {string} pathstr
     * @returns {string}
     * @memberof NodeContext
     */
    toRootPath(pathstr: string): string {
        let root = this.getRootPath();
        return root ? toAbsolutePath(root, pathstr) : pathstr;
    }

    /**
     * convert path to relative root path.
     *
     * @param {string} pathstr
     * @returns {string}
     * @memberof NodeActivityContext
     */
    relativeRoot(pathstr: string): string {
        if (/^(.{1,2}\/?\\?)?$/.test(pathstr)) {
            return pathstr;
        }
        let fullpath = this.toRootPath(pathstr);
        return relative(this.getRootPath(), fullpath) || '.';
    }

    getRootPath(): string {
        let root = this.ctx.getCurrBaseURL()
        return root || this.container.get(ProcessRunRootToken) || runMainPath();
    }

    toRootSrc(src: Src): Src {
        let root = this.getRootPath();
        if (root) {
            if (isString(src)) {
                return this.prefixSrc(root, src);
            } else {
                return src.map(s => this.prefixSrc(root, s));
            }
        }
        return src;
    }

    relativePath(path1: string, path2: string): string {
        return relative(path1, path2);
    }

    private prefixSrc(root: string, strSrc: string): string {
        let prefix = '';
        if (/^!/.test(strSrc)) {
            prefix = '!';
            strSrc = strSrc.substring(1, strSrc.length);
        }
        return prefix + toAbsolutePath(root, strSrc);
    }

    private _package: any;
    /**
     * get package.
     *
     * @returns {*}
     * @memberof NodeContext
     */
    getPackage(): any {
        if (!this._package) {
            let filename = this.toRootPath(this.packageFile);
            this._package = syncRequire(filename);
        }
        return this._package;
    }
    /**
     * get package version.
     *
     * @returns {string}
     * @memberof NodeContext
     */
    getPackageVersion(): string {
        let packageCfg = this.getPackage();
        if (!packageCfg) {
            return '';
        }
        return packageCfg.version || '';
    }
    /**
     * get module version.
     *
     * @param {string} name
     * @param {boolean} [dependencies=false]
     * @returns {string}
     * @memberof NodeContext
     */
    getModuleVersion(name: string, dependencies = false): string {
        let packageCfg = this.getPackage();
        if (!packageCfg) {
            return '';
        }
        let version = '';
        if (packageCfg.dependencies) {
            version = packageCfg.dependencies[name];
        }
        if (!dependencies && !version && packageCfg.devDependencies) {
            version = packageCfg.devDependencies[name];
        }

        return version || '';
    }
}
