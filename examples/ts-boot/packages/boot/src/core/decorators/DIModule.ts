import { createClassDecorator, MetadataAdapter, MetadataExtends, ITypeDecorator, isClass, lang } from '@tsdi/ioc';
import { ModuleConfigure } from '../modules/ModuleConfigure';

/**
 * DI module metadata.
 *
 * @export
 * @interface DIModuleMetadata
 * @extends {ModuleConfigure}
 * @extends {ClassMetadata}
 */
export interface DIModuleMetadata extends ModuleConfigure {
    /**
     * custom decorator type.
     *
     * @type {string}
     * @memberof DIModuleMetadata
     */
    decorType?: string;
}


/**
 * DIModule decorator, use to define class as DI Module.
 *
 * @export
 * @interface IDIModuleDecorator
 * @extends {ITypeDecorator<T>}
 * @template T
 */
export interface IDIModuleDecorator<T extends DIModuleMetadata> extends ITypeDecorator<T> {
    /**
     * DIModule decorator, use to define class as DI Module.
     *
     * @DIModule
     *
     * @param {T} [metadata] bootstrap metadate config.
     */
    (metadata: T): ClassDecorator;
}

/**
 * create bootstrap decorator.
 *
 * @export
 * @template T
 * @param {string} name decorator name.
 * @param {MetadataAdapter} [adapter]
 * @param {MetadataExtends<T>} [metadataExtends]
 * @returns {IDIModuleDecorator<T>}
 */
export function createDIModuleDecorator<T extends DIModuleMetadata>(
    name: string,
    adapter?: MetadataAdapter,
    metadataExtends?: MetadataExtends<T>): IDIModuleDecorator<T> {

    return createClassDecorator<DIModuleMetadata>(name,
        args => {
            if (adapter) {
                adapter(args);
            }
        },
        metadata => {
            if (metadataExtends) {
                metadataExtends(metadata as T);
            }

            if (!metadata.name && isClass(metadata.token)) {
                let isuglify = /^[a-z]$/.test(metadata.token.name);
                let classAnnations = lang.getClassAnnations(metadata.token);
                if (isuglify && classAnnations) {
                    metadata.name = classAnnations.name;
                } else {
                    metadata.name = metadata.token.name;
                }
            }
            metadata.decorType = name;
        }) as IDIModuleDecorator<T>;
}

/**
 * DIModule Decorator, definde class as DI module.
 *
 * @DIModule
 */
export const DIModule: IDIModuleDecorator<DIModuleMetadata> = createDIModuleDecorator<DIModuleMetadata>('DIModule');
