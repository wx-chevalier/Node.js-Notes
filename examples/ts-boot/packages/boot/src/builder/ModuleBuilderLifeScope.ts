import { BuildHandles, AnnoationContext } from '../core';
import { RegisterModuleScope } from './RegisterModuleScope';
import { ModuleBuildScope } from './ModuleBuildScope';

/**
 * module build life scope.
 *
 * @export
 * @class ModuleBuilderLifeScope
 * @extends {BuildHandles<AnnoationContext>}
 */
export class ModuleBuilderLifeScope extends BuildHandles<AnnoationContext> {

    setup() {
        this.use(RegisterModuleScope, true)
            .use(ModuleBuildScope, true);
    }
}
