import { IContainer } from '@tsdi/core';
import { ObjectMap, Express2, InjectToken } from '@tsdi/ioc';
import { CompilerOptions } from 'typescript';
import { Src } from '@tsdi/activities';

export interface IPlatformService {
    container: IContainer;
    packageFile: string;
    /**
     * get evn args.
     *
     * @returns {ObjectMap}
     * @memberof NodeContext
     */
    getEnvArgs(): ObjectMap;
    hasArg(arg: any): boolean;
    /**
     * get root folders.
     *
     * @param {Express2<string, string, boolean>} [express]
     * @returns {string[]}
     * @memberof NodeContext
     */
    getRootFolders(express?: Express2<string, string, boolean>): string[];
    getCompilerOptions(tsconfig: string): CompilerOptions;
    getFileName(pathName: string): string;
    /**
     * get folders of path.
     *
     * @param {string} pathstr
     * @param {Express2<string, string, boolean>} [express]
     * @returns {string[]}
     * @memberof NodeContext
     */
    getFolders(pathstr: string, express?: Express2<string, string, boolean>): string[];
    /**
     * filter fileName in directory.
     *
     * @param {Src} express
     * @param {(fileName: string) => boolean} [filter]
     * @param {(filename: string) => string} [mapping]
     * @returns {Promise<string[]>}
     * @memberof NodeContext
     */
    getFiles(express: Src, filter?: (fileName: string) => boolean, mapping?: (filename: string) => string): Promise<string[]>;
    copyFile(src: Src, dist: string, options?: CmdOptions): void;
    existsFile(filename: string): boolean;
    copyDir(src: Src, dist: string, options?: CmdOptions): void;
    copyTo(filePath: string, dist: string): Promise<any>;
    del(src: Src, opts?: {
        force?: boolean;
        dryRun?: boolean;
    }): Promise<any>;
    /**
     * to root path.
     *
     * @param {string} pathstr
     * @returns {string}
     * @memberof NodeContext
     */
    toRootPath(pathstr: string): string;
    /**
     * convert path to relative root path.
     *
     * @param {string} pathstr
     * @returns {string}
     * @memberof NodeActivityContext
     */
    relativeRoot(pathstr: string): string;
    getRootPath(): string;
    toRootSrc(src: Src): Src;
    relativePath(path1: string, path2: string): string;
    /**
     * get package.
     *
     * @returns {*}
     * @memberof NodeContext
     */
    getPackage(): any;
    /**
     * get package version.
     *
     * @returns {string}
     * @memberof NodeContext
     */
    getPackageVersion(): string;
    /**
     * get module version.
     *
     * @param {string} name
     * @param {boolean} [dependencies=false]
     * @returns {string}
     * @memberof NodeContext
     */
    getModuleVersion(name: string, dependencies?: boolean): string;
}



/**
 * cmd options.
 *
 * @export
 * @interface CmdOptions
 */
export interface CmdOptions {
    /**
     * force execute command.
     *
     * @type {boolean}
     * @memberof CmdOptions
     */
    force?: boolean;
    /**
     * silent run command.
     *
     * @type {boolean}
     * @memberof CmdOptions
     */
    silent?: boolean;
}

export const PlatformServiceToken = new InjectToken<IPlatformService>('pack_PlatformService');
