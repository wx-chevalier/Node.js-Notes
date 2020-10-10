import { AdviceMetadata } from './AdviceMetadata';

/**
 * after throwing metadata.
 */
export interface AfterThrowingMetadata extends AdviceMetadata {
    /**
     * set name provider of pointcut throwing error for advices.
     *
     * @type {string}
     * @memberof AfterThrowingMetadata
     */
    throwing?: string;
}
