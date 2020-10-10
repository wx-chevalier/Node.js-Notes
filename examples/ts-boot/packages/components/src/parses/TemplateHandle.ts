import { BuildHandle, BuildHandles } from '@tsdi/boot';
import { TemplateContext } from './TemplateContext';


export abstract class TemplateHandle extends BuildHandle<TemplateContext> {
    /**
     * execute binding Handle.
     *
     * @abstract
     * @param {TemplateContext} ctx
     * @param {() => Promise<void>} next
     * @returns {Promise<void>}
     * @memberof BootHandle
     */
    abstract execute(ctx: TemplateContext, next: () => Promise<void>): Promise<void>;
}

export class TemplatesHandle extends BuildHandles<TemplateContext> {

}
