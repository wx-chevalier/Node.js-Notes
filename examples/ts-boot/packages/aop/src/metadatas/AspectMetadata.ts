import { Type, ClassMetadata, ClassType } from '@tsdi/ioc';

/**
 * aspect metadata.
 */
export interface AspectMetadata extends ClassMetadata {
    /**
     * set pointcut in the type only.
     *
     * @type {(ClassType | ClassType[])}
     * @memberof AspectMetadata
     */
    within?: ClassType | ClassType[];

    without?: ClassType | ClassType[];

    /**
     * set pointcut in the class with the annotation decorator only.
     *
     * @type {string}
     * @memberof AspectMetadata
     */
    annotation?: string | Function;

}
