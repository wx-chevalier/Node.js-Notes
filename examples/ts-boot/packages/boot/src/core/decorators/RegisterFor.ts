import { ITypeDecorator, ClassMetadata, createClassDecorator,  TypeMetadata, isNumber, ArgsIterator } from '@tsdi/ioc';
import { RegFor } from '../modules/RegScope';


/**
 * register for metadata.
 *
 * @export
 * @interface RegisterForMetadata
 * @extends {TypeMetadata}
 */
export interface RegisterForMetadata extends TypeMetadata {
    /**
     * set where this module to register. default as child module.
     *
     * @type {boolean}
     * @memberof ModuleConfig
     */
    regFor?: RegFor;
}

/**
 * RegisterFor decorator.
 *
 * @export
 * @interface IRegisterForDecorator
 * @extends {ITypeDecorator<ClassMetadata>}
 */
export interface IRegisterForDecorator extends ITypeDecorator<RegisterForMetadata> {


    /**
     * RegisterFor decorator, for class. use to define the the way to register the module. default as child module.
     *
     * @RegisterFor
     *
     * @param {RegFor} regFor register module scope.
     */
    (regFor: RegFor): ClassDecorator;

    /**
     * RegisterFor decorator, for class. use to define the the way to register the module. default as child module.
     *
     * @RegisterFor
     *
     * @param {ClassMetadata} [metadata] metadata map.
     */
    (metadata?: ClassMetadata): ClassDecorator;
}

/**
 * RegisterFor decorator, for class. use to define the class as root module for root conatiner only.
 *
 * @RegisterFor
 */
export const RegisterFor: IRegisterForDecorator = createClassDecorator<RegisterForMetadata>('RegisterFor', (args: ArgsIterator) => {
    args.next<RegisterForMetadata>({
        match: (arg) => isNumber(arg),
        setMetadata: (metadata, arg) => {
            metadata.regFor = arg;
        }
    });
}) as IRegisterForDecorator;

