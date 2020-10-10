import { AroundMetadata } from '../metadatas';
import { IAdviceDecorator, createAdviceDecorator } from './Advice';
import { isString } from '@tsdi/ioc';

/**
 * aop around decorator.
 *
 * @export
 * @interface IAroundDecorator
 * @extends {IAdviceDecorator<T>}
 * @template T
 */
export interface IAroundDecorator<T extends AroundMetadata> extends IAdviceDecorator<T> {
    /**
     * define aop around advice.
     *
     * @param {(string | RegExp)} [pointcut] define advice match express for pointcut.
     * @param {string} [returning] set name provider of pointcut returing data for advices.
     * @param {string} [throwing] set name provider of pointcut throwing error for advices.
     * @param {string} [annotation] annotation name, special annotation metadata for annotation advices.
     */
    (pointcut?: string | RegExp, args?: string, returning?: string, throwing?: string, annotation?: string): MethodDecorator
}

/**
 * aop Around advice decorator.
 *
 * @Around
 */
export const Around: IAroundDecorator<AroundMetadata> =
    createAdviceDecorator<AroundMetadata>(
        'Around',
        null,
        args => {
            args.next<AroundMetadata>({
                match: (arg) => isString(arg),
                setMetadata: (metadata, arg) => {
                    metadata.args = arg;
                }
            });

            args.next<AroundMetadata>({
                match: (arg) => isString(arg),
                setMetadata: (metadata, arg) => {
                    metadata.returning = arg;
                }
            });

            args.next<AroundMetadata>({
                match: (arg) => isString(arg),
                setMetadata: (metadata, arg) => {
                    metadata.throwing = arg;
                }
            });
        }) as IAroundDecorator<AroundMetadata>;
