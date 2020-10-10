import { DIModuleInjectorScope } from '@tsdi/boot';
import { InjectorActionContext } from '@tsdi/core';
import { Type } from '@tsdi/ioc';

export class TaskInjectorRegisterAction extends DIModuleInjectorScope {

    protected setNextRegTypes(ctx: InjectorActionContext, registered: Type[]) {
        ctx.types = ctx.types.filter(ty => registered.indexOf(ty) < 0);
    }

}
