import { ElementNode } from '../ElementNode';
import { BuildHandle, BuildContext } from '@tsdi/boot';

/**
 * binding component handle.
 *
 * @export
 * @class BindingComponentHandle
 * @extends {BuildHandle<BuildContext>}
 */
export class BindingComponentHandle extends BuildHandle<BuildContext> {
    async execute(ctx: BuildContext, next: () => Promise<void>): Promise<void> {

        if (ctx.composite instanceof ElementNode) {
            ctx.composite.$scope = ctx.target;
        }

        await next();
    }
}
