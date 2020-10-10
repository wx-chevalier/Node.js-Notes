import { IClassMethodDecorator, createClassMethodDecorator, ClassMethodDecorator } from '../factories';
import { AutorunMetadata } from '../metadatas';
import { isClassMetadata, isString, isNumber } from '../utils';


/**
 * autorun decorator inteface
 *
 * @export
 * @interface IAutorunDecorator
 * @extends {IClassMethodDecorator<AutorunMetadata>}
 */
export interface IAutorunDecorator extends IClassMethodDecorator<AutorunMetadata> {
    /**
     * Autorun decorator, for class.  use to define the class auto run (via a method or not) after registered.
     * @Autorun
     *
     * @param {string} [autorun] the special method name when define to class.
     */
    (autorun: string): ClassDecorator;

    /**
     * Autorun decorator, for method.  use to define the method auto run (via a method or not) after registered.
     * @Autorun
     *
     * @param {string} [autorun] the special method name when define to class.
     */
    (order: number): MethodDecorator;

    /**
     * Autorun decorator, for class or method. use to define the class auto run (via a method or not) after registered.
     * @Autorun
     *
     * @param {AutorunMetadata} [metadata] metadata map.
     */
    (metadata?: AutorunMetadata): ClassMethodDecorator;
}

/**
 * Autorun decorator, for class or method.  use to define the class auto run (via a method or not) after registered.
 *
 * @Autorun
 */
export const Autorun: IAutorunDecorator = createClassMethodDecorator<AutorunMetadata>('Autorun', args => {
    args.next<AutorunMetadata>({
        isMetadata: (arg) => isClassMetadata(arg, 'autorun'),
        match: (arg) => isString(arg) || isNumber(arg),
        setMetadata: (metadata, arg) => {
            if (isString(arg)) {
                metadata.autorun = arg;
            } else {
                metadata.order = arg;
            }
        }
    });
}, (metadata) => {
    metadata.singleton = true;
    return metadata;
}) as IAutorunDecorator;
