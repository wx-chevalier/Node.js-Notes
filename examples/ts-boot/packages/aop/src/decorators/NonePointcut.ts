import { createClassDecorator, ClassMetadata, ITypeDecorator, Type } from '@tsdi/ioc';

export interface INonePointcutDecorator extends ITypeDecorator<ClassMetadata> {
    /**
     * NonePointcut decorator, define class not work with aop.
     *
     * @NonePointcut
     *
     */
    (): ClassDecorator;
    /**
     * NonePointcut decorator, define class not work with aop.
     *
     * @NonePointcut
     */
    (target: Type): void;
}

/**
 * NonePointcut decorator, define class not work with aop.
 *
 * @NonePointcut
 */
export const NonePointcut: INonePointcutDecorator = createClassDecorator<ClassMetadata>('NonePointcut');
