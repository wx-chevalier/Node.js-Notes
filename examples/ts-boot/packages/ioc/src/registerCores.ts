import { IIocContainer, IocContainerToken, ContainerFactoryToken } from './IIocContainer';
import { TypeReflects, MetadataService } from './services';
import { ProviderMap, ProviderParser, DecoratorProvider } from './providers';
import {
    MethodAccessor, DesignLifeScope, RuntimeLifeScope, IocCacheManager,
    IocSingletonManager, ResolveLifeScope, ActionRegisterer
} from './actions';

/**
 * register core for container.
 *
 * @export
 * @param {IIocContainer} container
 */
export function registerCores(container: IIocContainer) {
    container.bindProvider(IocContainerToken, container);
    container.bindProvider(ContainerFactoryToken, () => () => container);
    container.bindProvider(IocSingletonManager, new IocSingletonManager(container));
    container.registerSingleton(ActionRegisterer, () => new ActionRegisterer());

    container.registerSingleton(TypeReflects, () => new TypeReflects());
    container.registerSingleton(IocCacheManager, () => new IocCacheManager(container));
    container.register(ProviderMap, () => new ProviderMap(container));
    container.registerSingleton(ProviderParser, () => new ProviderParser(container));
    container.registerSingleton(DecoratorProvider, () => new DecoratorProvider(container));
    container.registerSingleton(MetadataService, () => new MetadataService());
    container.registerSingleton(MethodAccessor, () => new MethodAccessor());

    // bing action.
    container.getActionRegisterer()
        .register(container, DesignLifeScope, true)
        .register(container, RuntimeLifeScope, true)
        .register(container, ResolveLifeScope, true);

    // container.register(Date, () => new Date());
    // container.register(String, () => '');
    // container.register(Number, () => Number.NaN);
    // container.register(Boolean, () => undefined);
    // container.register(Array, () => []);

}
