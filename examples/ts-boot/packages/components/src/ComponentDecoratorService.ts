import { Singleton, DesignDecoratorRegisterer, DecoratorScopes, Type, isArray, isFunction, isMetadataObject, lang, isBaseValue } from '@tsdi/ioc';
import { ModuleDecoratorServiceToken, ModuleDecoratorService, ModuleConfigure } from '@tsdi/boot';
import { ComponentRegisterAction } from './registers';

@Singleton(ModuleDecoratorServiceToken)
export class ComponentDecoratorService extends ModuleDecoratorService {

    protected getMatchDecorator(decorators: string[]) {
        let decorator = '';
        let designReg = this.container.get(DesignDecoratorRegisterer).getRegisterer(DecoratorScopes.Class);
        decorator = decorators.find(c => designReg.has(c, ComponentRegisterAction));
        if (decorator) {
            return decorator;
        }
        return super.getMatchDecorator(decorators);
    }

    getAnnoation(type: Type, decorator?: string): ModuleConfigure {
        let ann = super.getAnnoation(type, decorator)
        if (ann.template) {
            ann.template = this.cloneTemplate(ann.template);
        }
        return ann;
    }

    cloneTemplate(target: any) {
        if (isArray(target)) {
            return target.map(it => this.cloneTemplate(it));
        }
        if (isFunction(target)) {
            return target;
        } else if (isMetadataObject(target)) {
            let newM = {};
            lang.forIn(target, (val, name) => {
                newM[name] = this.cloneTemplate(val)
            });
            return newM;
        } else if (isBaseValue(target)) {
            return target;
        }
        return null;
    }
}
