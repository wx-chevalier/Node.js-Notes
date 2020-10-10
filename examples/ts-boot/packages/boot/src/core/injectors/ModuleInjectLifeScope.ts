import { isClass, LifeScope, Type, Inject, hasOwnClassMetadata } from '@tsdi/ioc';
import { ModuleResovler } from './ModuleResovler';
import { IContainer, ContainerToken } from '@tsdi/core';
import { AnnoationContext } from '../AnnoationContext';
import { CheckAnnoationAction } from './CheckAnnoationAction';
import { AnnoationRegisterScope } from './AnnoationRegisterScope';
import { RegModuleExportsAction } from './RegModuleExportsAction';
import { InjectorAction, InjectorActionContext, InjectorRegisterScope } from '@tsdi/core';


export class ModuleInjectLifeScope extends LifeScope<AnnoationContext> {

    @Inject(ContainerToken)
    container: IContainer;

    setup() {
        this.registerAction(DIModuleInjectorScope, true)
            .registerAction(CheckAnnoationAction)
            .registerAction(AnnoationRegisterScope, true)
            .registerAction(RegModuleExportsAction);

        this.use(CheckAnnoationAction)
            .use(AnnoationRegisterScope)
            .use(RegModuleExportsAction);
    }

    register<T>(type: Type<T>, decorator: string): ModuleResovler<T> {
        let ctx = AnnoationContext.parse({
            module: type,
            decorator: decorator
        }, this.container);
        this.execute(ctx);
        return ctx.moduleResolver as ModuleResovler<T>;
    }
}


export class DIModuleInjectorScope extends InjectorRegisterScope {

    execute(ctx: InjectorActionContext, next?: () => void): void {
        let types = this.getTypes(ctx);
        this.registerTypes(ctx, types);
        next && next();
    }

    protected getTypes(ctx: InjectorActionContext): Type[] {
        return ctx.types.filter(ty => hasOwnClassMetadata(ctx.currDecoractor, ty));
    }

    protected setNextRegTypes(ctx: InjectorActionContext, registered: Type[]) {
        ctx.types = [];
    }

    setup() {
        this.use(RegisterDIModuleAction);
    }
}

export class RegisterDIModuleAction extends InjectorAction {
    execute(ctx: InjectorActionContext, next: () => void): void {
        if (isClass(ctx.currType) && ctx.currDecoractor) {
            this.container
                .getActionRegisterer()
                .get(ModuleInjectLifeScope)
                .register(ctx.currType, ctx.currDecoractor);
            ctx.registered.push(ctx.currType);
        }
        next();
    }
}
