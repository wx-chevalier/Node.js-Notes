import { Token, Modules, ComponentMetadata, Type } from '@tsdi/ioc';
import { Startup } from '../../runnable';
import { RegFor } from './RegScope';

/**
 * annotation metadata.
 *
 * @export
 * @interface IAnnotationMetadata
 * @extends {ClassMetadata}
 * @template T
 */
export interface IAnnotationMetadata<T = any> extends ComponentMetadata {
    /**
     * selector for binding property.
     *
     * @type {string}
     * @memberof ActivityConfigure
     */
    selector?: string;

    /**
     * template data for target to binding property.
     */
    template?: any;

    /**
     * annotation for the type.
     *
     * @type {Token<T>}
     * @memberof AnnotationConfigure
     */
    token?: Token<T>;
    /**
     * Annotation class Type.
     *
     * @type {Type<T>}
     * @memberof IAnnotationMetadata
     */
    type?: Type<T>;

}

/**
 * module metadata.
 *
 * @export
 * @interface ModuleConfig
 * @extends {IAnnotationMetadata<T>}
 */
export interface IModuleMetadata<T = any> extends IAnnotationMetadata<T> {

    /**
     * module base url.
     *
     * @type {string}
     * @memberof ModuleConfig
     */
    baseURL?: string;

    /**
     * set where this module to register. default as child module.
     *
     * @type {boolean}
     * @memberof ModuleConfig
     */
    regFor?: RegFor;

    /**
     * module name.
     *
     * @type {string}
     * @memberof AppConfiguration
     */
    name?: string;

    /**
     * bootstrap.
     *
     * @type {Token<T>}
     * @memberof IAnnotationMetadata
     */
    bootstrap?: Token<T>;

    /**
     * imports dependens modules
     *
     * @type {Modules[]}
     * @memberof ModuleConfiguration
     */
    imports?: Modules[];
    /**
     * exports modules
     *
     * @type {Modules[]}
     * @memberof ModuleConfiguration
     */
    exports?: Modules[];

    /**
     * default runnerable.
     *
     * @type {Token<Startup<T>>}
     * @memberof IModuleMetadata
     */
    defaultRunnable?: Token<Startup<T>>

}

/**
 * module configure, with any bootstrap.
 *
 * @export
 * @interface ModuleConfigure
 * @extends {IModuleMetadata}
 */
export interface ModuleConfigure extends IModuleMetadata {

}
