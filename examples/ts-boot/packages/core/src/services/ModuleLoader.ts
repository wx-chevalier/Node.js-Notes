import {
    LoadType, Modules, Type, Token, IocCoreService, isString,
    isObject, PathModules, isArray, isClass, Singleton, InjectReference, lang
} from '@tsdi/ioc';


/**
 * module loader interface for ioc.
 *
 * @export
 * @interface IModuleLoader
 */
export interface IModuleLoader {
    /**
     * load modules by files patterns, module name or modules.
     *
     * @param {...LoadType[]} modules
     * @returns {Promise<Modules[]>}
     * @memberof IModuleLoader
     */
    load(...modules: LoadType[]): Promise<Modules[]>;

    /**
     * dynamic require file.
     *
     * @param {string} fileName
     * @returns {Promise<any>}
     * @memberof IModuleLoader
     */
    require(fileName: string): Promise<any>;

    /**
     * load all class types in modules
     *
     * @param {...LoadType[]} modules
     * @returns {Promise<Type[]>}
     * @memberof IModuleLoader
     */
    loadTypes(...modules: LoadType[]): Promise<Type[][]>;

    /**
     * get all class type in modules.
     *
     * @param {Modules} modules
     * @returns {Type[]}
     * @memberof IModuleLoader
     */
    getTypes(modules: Modules): Type[];

}


declare let require: any;

/**
 * default module loader.
 *
 * @export
 * @class DefaultModuleLoader
 * @implements {IModuleLoader}
 */
@Singleton
export class ModuleLoader extends IocCoreService implements IModuleLoader {

    private _loader: (modulepath: string) => Promise<Modules[]>;
    getLoader() {
        if (!this._loader) {
            this._loader = this.createLoader();
        }
        return this._loader;
    }

    /**
     * load module.
     *
     * @param {...LoadType[]} modules
     * @returns {Promise<Modules[]>}
     * @memberof DefaultModuleLoader
     */
    load(...modules: LoadType[]): Promise<Modules[]> {
        if (modules.length) {
            return Promise.all(modules.map(mdty => {
                if (isString(mdty)) {
                    return this.isFile(mdty) ? this.loadFile(mdty) : this.loadModule(mdty);
                } else if (isObject(mdty) && (mdty['modules'] || mdty['files'])) {
                    return this.loadPathModule(mdty as PathModules);
                } else {
                    return mdty ? [mdty] : [];
                }
            }))
                .then(allms => {
                    let rmodules: Modules[] = [];
                    allms.forEach(ms => {
                        rmodules = rmodules.concat(ms);
                    })
                    return rmodules;
                });
        } else {
            return Promise.resolve([]);
        }
    }

    /**
     * load types from module.
     *
     * @param {...LoadType[]} modules
     * @returns {Promise<Type[]>}
     * @memberof IContainerBuilder
     */
    async loadTypes(...modules: LoadType[]): Promise<Type[][]> {
        let mdls = await this.load(...modules);
        return mdls.map(md => this.getTypes(md));
    }

    /**
     * get all class type in modules.
     *
     * @param {Modules[]} modules
     * @param {...Express<Type, boolean>[]} filters
     * @returns {Type[]}
     * @memberof DefaultModuleLoader
     */
    getTypes(modules: Modules): Type[] {
        return this.getContentTypes(modules);
    }

    async require(fileName: string): Promise<any> {
        return lang.first(await this.loadFile(fileName));
    }


    protected loadFile(files: string | string[], basePath?: string): Promise<Modules[]> {
        let loader = this.getLoader();
        let fRes: Promise<Modules[]>;
        if (isArray(files)) {
            fRes = Promise.all(files.map(f => loader(f)))
                .then(allms => {
                    let rms = [];
                    allms.forEach(ms => {
                        rms = rms.concat(ms);
                    });
                    return rms;
                });
        } else {
            fRes = loader(files);
        }
        return fRes.then(ms => ms.filter(it => !!it));
    }

    protected isFile(str: string) {
        return str && /\/((\w|%|\.))+\.\w+$/.test(str.replace(/\\\\/gi, '/'));
    }


    protected loadModule(moduleName: string): Promise<Modules[]> {
        let loader = this.getLoader();
        return loader(moduleName).then(ms => ms.filter(it => !!it));
    }

    protected async loadPathModule(pmd: PathModules): Promise<Modules[]> {
        let modules: Modules[] = [];
        if (pmd.files) {
            await this.loadFile(pmd.files, pmd.basePath)
                .then(allmoduls => {
                    allmoduls.forEach(ms => {
                        modules = modules.concat(ms);
                    });
                    return modules;
                })
        }
        if (pmd.modules) {
            await Promise.all(pmd.modules.map(nmd => {
                return isString(nmd) ? this.loadModule(nmd) : nmd;
            })).then(ms => {
                modules = modules.concat(ms);
                return modules;
            });
        }

        return modules;
    }

    protected createLoader(): (modulepath: string) => Promise<Modules[]> {
        if (typeof require !== 'undefined') {
            return (modulepath: string) => {
                return new Promise<Modules[]>((resolve, reject) => {
                    require(modulepath, (mud) => {
                        resolve(mud);
                    }, err => {
                        reject(err);
                    })
                });
            }
        } else {
            throw new Error('has not module loader');
        }
    }

    protected getContentTypes(regModule: Modules): Type[] {
        let regModules: Type[] = [];

        if (isClass(regModule)) {
            regModules.push(regModule);
        } else if (regModule) {
            let rmodules = regModule['exports'] ? regModule['exports'] : regModule;
            for (let p in rmodules) {
                let type = rmodules[p];
                if (isClass(type)) {
                    regModules.push(type);
                }
            }
        }

        return regModules;
    }
}


/**
 * inject module load token.
 *
 * @export
 * @class InjectModuleLoadToken
 * @extends {Registration<T>}
 * @template T
 */
export class InjectModuleLoadToken<T> extends InjectReference<ModuleLoader> {
    constructor(token: Token<T>) {
        super(ModuleLoader, token)
    }
}
