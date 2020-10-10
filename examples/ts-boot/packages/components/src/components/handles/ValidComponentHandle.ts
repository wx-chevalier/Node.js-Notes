import { isArray } from '@tsdi/ioc';
import { ElementNode } from '../ElementNode';
import { BuildHandle, BuildContext } from '@tsdi/boot';

export class ValidComponentHandle extends BuildHandle<BuildContext> {
    async execute(ctx: BuildContext, next: () => Promise<void>): Promise<void> {

        if (isArray(ctx.composite)) {
            if (ctx.target instanceof ElementNode) {
                ctx.target.add(...ctx.composite);
                ctx.composite = null;
            } else {
                let content = this.container.get(ElementNode);
                content.add(...ctx.composite);
                ctx.composite = content;
            }
        }

        await next();
    }
}
