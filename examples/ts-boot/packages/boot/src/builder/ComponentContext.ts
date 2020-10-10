import { IHandleContext, ModuleConfigure } from '../core';

export interface IComponentContext extends IHandleContext {

    template?: any;

    decorator?: string;

    /**
     * annoation metadata config.
     *
     * @type {ModuleConfigure}
     * @memberof BuildContext
     */
    annoation?: ModuleConfigure;
}
