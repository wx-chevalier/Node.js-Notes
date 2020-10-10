import { IContainer } from '@tsdi/core';
import { IConfigureLoader, ConfigureLoaderToken, DIModule, ProcessRunRootToken, RegFor } from '@tsdi/boot';
import * as path from 'path';
import { ServerModule, runMainPath, syncRequire } from '@tsdi/platform-server';
import { Injectable } from '@tsdi/ioc';
import { RunnableConfigure } from '@tsdi/boot';


@Injectable(ConfigureLoaderToken)
export class ConfigureFileLoader implements IConfigureLoader<RunnableConfigure> {
    constructor(private baseURL: string, private container: IContainer) {
        this.baseURL = this.baseURL || runMainPath();
    }
    async load(uri?: string): Promise<RunnableConfigure> {
        const fs = syncRequire('fs');
        if (uri) {
            if (fs.existsSync(uri)) {
                return syncRequire(uri) as RunnableConfigure;
            } else if (fs.existsSync(path.join(this.baseURL, uri))) {
                return syncRequire(path.join(this.baseURL, uri)) as RunnableConfigure;
            } else {
                console.log(`config file: ${uri} not exists.`)
                return null;
            }
        } else {
            let cfgmodeles: RunnableConfigure;
            let cfgpath = path.join(this.baseURL, './config');
            ['.js', '.ts', '.json'].some(ext => {
                if (fs.existsSync(cfgpath + ext)) {
                    cfgmodeles = syncRequire(cfgpath + ext);
                }
                return !!cfgmodeles;
            });
            return cfgmodeles;
        }
    }

}


/**
 * server boot module
 *
 * @export
 * @class ServerBootstrapModule
 */
@DIModule({
    regFor: RegFor.boot,
    imports: [
        ServerModule,
        ConfigureFileLoader
    ],
    providers: [
        { provide: ProcessRunRootToken, useValue: runMainPath() }
    ]
})
export class ServerBootstrapModule {

}

