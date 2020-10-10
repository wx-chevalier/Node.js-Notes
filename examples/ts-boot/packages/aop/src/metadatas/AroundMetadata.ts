import { AfterReturningMetadata } from './AfterReturningMetadata';
import { AfterThrowingMetadata } from './AfterThrowingMetadata';

/**
 * around metadata.
 */
export interface AroundMetadata extends AfterReturningMetadata, AfterThrowingMetadata {
    /**
     * set name provider of annotation metadata for advices.
     *
     * @type {string}
     * @memberof AroundMetadata
     */
    args?: string;
    /**
     * set name provider of pointcut returing data for advices.
     *
     * @type {string}
     * @memberof AroundMetadata
     */
    returning?: string;
}
