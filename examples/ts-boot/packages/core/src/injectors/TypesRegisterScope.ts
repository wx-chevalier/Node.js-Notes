import { Type } from '@tsdi/ioc';
import { InjectorRegisterScope } from './InjectorRegisterScope';
import { InjectorActionContext } from './InjectorActionContext';

export class TypesRegisterScope extends InjectorRegisterScope {
    protected getTypes(ctx: InjectorActionContext): Type[] {
        return ctx.types;
    }
}
