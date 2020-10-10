import { Token, Type } from '../../types';
import { isClass } from '../../utils';
import { MetadataService } from '../../services';
import { IocRuntimeAction } from './IocRuntimeAction';
import { RuntimeActionContext } from './RuntimeActionContext';
import { IParameter } from '../../IParameter';

/**
 * bind parameter type action.
 *
 * @export
 * @class BindParameterTypeAction
 * @extends {ActionComposite}
 */
export class BindDeignParamTypeAction extends IocRuntimeAction {
    execute(ctx: RuntimeActionContext, next: () => void) {
        let propertyKey = ctx.propertyKey || 'constructor';
        if (!ctx.targetReflect.methodParams.has(propertyKey)) {
            ctx.targetReflect.methodParams.set(
                propertyKey,
                this.createDesignParams(ctx.targetType, ctx.target, propertyKey));
        }
        next();
    }


    protected createDesignParams(type: Type, target: any, propertyKey: string): IParameter[] {
        let paramTokens: Token[];
        if (target && propertyKey) {
            paramTokens = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];
        } else {
            paramTokens = Reflect.getMetadata('design:paramtypes', type) || [];
        }

        paramTokens = paramTokens.slice(0);
        paramTokens.forEach(dtype => {
            if (isClass(dtype) && !this.container.has(dtype)) {
                this.container.register(dtype);
            }
        });

        let names = this.container.get(MetadataService).getParamerterNames(type, propertyKey);
        let params: IParameter[];
        if (names.length) {
            params = names.map((name, idx) => {
                return <IParameter>{
                    name: name,
                    type: paramTokens.length ? this.checkParamType(paramTokens[idx]) : undefined
                }
            });
        } else if (paramTokens.length) {
            params = paramTokens.map((tk, idx) => {
                return <IParameter>{
                    name: names.length ? names[idx] : '',
                    type: this.checkParamType(tk)
                }
            });
        } else {
            params = [];
        }
        return params;
    }

    checkParamType(type: any): Type {
        if (type === Object) {
            return undefined;
        }
        return type;
    }
}
