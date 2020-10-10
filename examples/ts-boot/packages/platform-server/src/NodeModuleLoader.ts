import { IModuleLoader, ModuleLoader } from '@tsdi/core';
import { toAbsoluteSrc, runMainPath } from './toAbsolute';
import { Modules } from '@tsdi/ioc';


/**
 * server nodule loader.
 *
 * @export
 * @class NodeModuleLoader
 * @implements {IModuleLoader}
 */
export class NodeModuleLoader extends ModuleLoader implements IModuleLoader {

    constructor() {
        super();
    }

    protected loadFile(files: string | string[], basePath?: string): Promise<Modules[]> {
        let globby = require('globby');
        basePath = basePath || runMainPath();
        return globby(toAbsoluteSrc(basePath, files)).then((mflies: string[]) => {
            return mflies.map(fp => {
                return require(fp);
            });
        });
    }

    protected createLoader(): (modulepath: string) => Promise<Modules[]> {
        return (modulepath: string) => Promise.resolve(require(modulepath));
    }

}
