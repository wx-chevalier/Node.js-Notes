import { IContainer } from '@tsdi/core';


/**
 * source
 */
export type Src = string | string[];

/**
 * task source.
 */
export type TaskSrc = Src | ((container?: IContainer) => Src);

/**
 * node callback
 *
 * @export
 * @interface NodeCabllback
 */
export interface NodeCabllback {
    (err: Error, data?: any): Promise<any> | void
}
