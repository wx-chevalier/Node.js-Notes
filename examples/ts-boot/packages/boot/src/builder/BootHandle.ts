import { BuildHandle } from '../core';
import { Abstract } from '@tsdi/ioc';
import { BootContext } from '../BootContext';

/**
 * annoation handle.
 *
 * @export
 * @abstract
 * @class BootHandle
 * @extends {BuildHandle<BootContext>}
 */
@Abstract()
export abstract class BootHandle extends BuildHandle<BootContext> {
    /**
     * execute boot Handle.
     *
     * @abstract
     * @param {AnnoationContext} ctx
     * @param {() => Promise<void>} next
     * @returns {Promise<void>}
     * @memberof BootHandle
     */
    abstract execute(ctx: BootContext, next: () => Promise<void>): Promise<void>;
}
