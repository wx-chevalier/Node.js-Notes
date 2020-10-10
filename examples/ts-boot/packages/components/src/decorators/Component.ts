import { createClassDecorator, IClassDecorator, InjectableMetadata, isString } from '@tsdi/ioc';

/**
 * component metadata.
 *
 * @export
 * @interface IComponentMetadata
 * @extends {InjectableMetadata}
 */
export interface IComponentMetadata extends InjectableMetadata {
    /**
     * component selector.
     *
     * @type {string}
     * @memberof IComponentMetadata
     */
    selector?: string;
    /**
     * template for component.
     *
     * @type {*}
     * @memberof IComponentMetadata
     */
    template?: any;
}
/**
 * Component decorator
 *
 * @export
 * @interface IInjectableDecorator
 * @extends {IClassDecorator<IComponentMetadata>}
 */
export interface IComponentDecorator extends IClassDecorator<IComponentMetadata> {
    /**
     * Component decorator, define for class. use to define the class. it can setting provider to some token, singleton or not. it will execute  [`ComponentLifecycle`]
     *
     * @Component
     *
     * @param {IComponentMetadata} [metadata] metadata map.
     */
    (metadata?: IComponentMetadata): ClassDecorator;

    /**
     * Component decorator, use to define class as Component element.
     *
     * @Task
     * @param {string} selector metadata selector.
     */
    (selector: string): ClassDecorator;
}

/**
 * Component decorator, define for class. use to define the class. it can setting provider to some token, singleton or not. it will execute  [`ComponentLifecycle`]
 *
 * @Component
 */
export const Component: IComponentDecorator = createClassDecorator<IComponentMetadata>('Component', adapter => {
    adapter.next<IComponentMetadata>({
        match: (arg, args) => isString(arg),
        setMetadata: (metadata, arg) => {
            metadata.selector = arg;
        }
    });
});

