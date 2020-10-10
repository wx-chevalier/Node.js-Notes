
import { createMethodDecorator, IMethodDecorator, MetadataAdapter, MetadataExtends, isString, isRegExp } from '@tsdi/ioc';
import { AdviceMetadata } from '../metadatas';

/**
 * advice decorator for method.
 *
 * @export
 * @interface IAdviceDecorator
 * @extends {IMethodDecorator<T>}
 * @template T
 */
export interface IAdviceDecorator<T extends AdviceMetadata> extends IMethodDecorator<T> {
    /**
     * define advice with params.
     *
     * ### Usage
     * - path or module name, match express.
     *  - `execution(moduelName.*.*(..)) || @annotation(DecortorName) || @within(ClassName)`
     *  - `execution(moduelName.*.*(..)) && @annotation(DecortorName) && @within(ClassName)`
     *
     * ```
     * @Aspect()
     * class AspectClass {
     *   @Advice('"execution(moduelName.*.*(..)")')
     *   process(joinPoint: JointPoint){
     *   }
     * }
     * ```
     *
     * - match method with a decorator annotation.
     *
     * ```
     * @Aspect()
     * class AspectClass {
     *   @Advice('@annotation(DecoratorName)')
     *   process(joinPoint: JointPoint){
     *   }
     * }
     * ```
     *
     * @param {(string | RegExp)} [pointcut] define advice match express for pointcut.
     * @param { string } [annotation] annotation name, special annotation metadata for annotation advices.
     */
    (pointcut?: string | RegExp, annotation?: string): MethodDecorator;

    /**
     * define advice with metadata map.
     * @param {T} [metadata]
     */
    (metadata?: T): MethodDecorator;
}

export function createAdviceDecorator<T extends AdviceMetadata>(adviceName: string,
    adapter?: MetadataAdapter,
    afterPointcutAdapter?: MetadataAdapter,
    metadataExtends?: MetadataExtends<T>): IAdviceDecorator<T> {

    return createMethodDecorator<AdviceMetadata>('Advice',
        args => {
            if (adapter) {
                adapter(args);
            }
            args.next<AdviceMetadata>({
                match: (arg) => isString(arg) || isRegExp(arg),
                setMetadata: (metadata, arg) => {
                    metadata.pointcut = arg;
                }
            });
            if (afterPointcutAdapter) {
                afterPointcutAdapter(args);
            }

            args.next<AdviceMetadata>({
                match: (arg, args) => isString(arg) && args.indexOf(arg) === 1,
                setMetadata: (metadata, arg) => {
                    metadata.annotationArgName = arg;
                }
            });

            args.next<AdviceMetadata>({
                match: (arg) => isString(arg),
                setMetadata: (metadata, arg) => {
                    metadata.annotationName = arg;
                }
            });
        },
        metadata => {
            if (metadataExtends) {
                metadataExtends(metadata as T);
            }
            metadata.adviceName = adviceName;
            return metadata;
        }) as IAdviceDecorator<T>;
}

/**
 * aop advice decorator.
 *
 * @Advice
 */
export const Advice: IAdviceDecorator<AdviceMetadata> = createAdviceDecorator('Advice');
