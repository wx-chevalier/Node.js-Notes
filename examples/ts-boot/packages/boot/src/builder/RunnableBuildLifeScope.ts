import { BuildHandles, AnnoationContext } from '../core';
import { RegisterModuleScope } from './RegisterModuleScope';
import { ModuleBuildScope } from './ModuleBuildScope';
import { ResolveRunnableScope } from './ResolveRunnableScope';
import { RunBootHandle } from './RunBootHandle';


export class RunnableBuildLifeScope extends BuildHandles<AnnoationContext> {

    setup() {
        this.use(RegisterModuleScope, true)
            .use(ModuleBuildScope, true)
            .use(ResolveRunnableScope, true)
            .use(RunBootHandle);
    }
}
