import { BuildHandle } from './BuildHandles';
import { Abstract } from '@tsdi/ioc';
import { AnnoationContext } from '../AnnoationContext';


/**
 * annoation handle.
 *
 * @export
 * @abstract
 * @class AnnoationHandle
 * @extends {BuildHandle<AnnoationContext>}
 */
@Abstract()
export abstract class AnnoationHandle extends BuildHandle<AnnoationContext> {
    /**
     * execute Handles.
     *
     * @abstract
     * @param {AnnoationContext} ctx
     * @param {() => Promise<void>} next
     * @returns {Promise<void>}
     * @memberof AnnoationHandle
     */
    abstract execute(ctx: AnnoationContext, next: () => Promise<void>): Promise<void>;
}
