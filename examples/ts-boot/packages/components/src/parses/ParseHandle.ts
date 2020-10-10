import { BuildHandle, BuildHandles } from '@tsdi/boot';
import { ParseContext } from './ParseContext';

export abstract class ParseHandle extends BuildHandle<ParseContext> {
    /**
     * execute binding Handle.
     *
     * @abstract
     * @param {ParseContext} ctx
     * @param {() => Promise<void>} next
     * @returns {Promise<void>}
     * @memberof BootHandle
     */
    abstract execute(ctx: ParseContext, next: () => Promise<void>): Promise<void>;
}

export class ParsersHandle extends BuildHandles<ParseContext> {

}
