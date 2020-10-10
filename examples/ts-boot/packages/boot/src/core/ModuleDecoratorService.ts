import {
    Singleton, Type, Inject, MetadataService, DesignDecoratorRegisterer, DecoratorScopes,
    RuntimeDecoratorRegisterer, lang, getOwnTypeMetadata
} from '@tsdi/ioc';
import { ContainerToken, IContainer } from '@tsdi/core';
import { ModuleConfigure } from './modules';
import { ModuleDecoratorServiceToken, IModuleDecoratorService } from './IModuleDecoratorService';


@Singleton(ModuleDecoratorServiceToken)
export class ModuleDecoratorService implements IModuleDecoratorService {

    @Inject(ContainerToken)
    protected container: IContainer;

    getDecorator(type: Type): string {
        let decorators = this.container.get(MetadataService)
            .getClassDecorators(type);

        return this.getMatchDecorator(decorators);
    }

    protected getMatchDecorator(decorators: string[]) {
        let decorator = '';
        let deReger = this.container.get(DesignDecoratorRegisterer);
        let designReg = deReger.getRegisterer(DecoratorScopes.Class);
        let mdRgr = deReger.getRegisterer(DecoratorScopes.Injector);

        decorator = decorators.find(c => mdRgr.has(c));

        decorator = decorator || decorators.find(c => designReg.has(c));

        if (!decorator) {
            let runtimeReg = this.container.get(RuntimeDecoratorRegisterer).getRegisterer(DecoratorScopes.Class)
            decorator = decorators.find(c => runtimeReg.has(c));
        }
        return decorator;
    }

    getAnnoation(type: Type, decorator?: string): ModuleConfigure {
        if (!decorator) {
            decorator = this.getDecorator(type);
        }
        let anno = { ...lang.first(getOwnTypeMetadata<ModuleConfigure>(decorator, type)) };
        return anno;
    }
}
