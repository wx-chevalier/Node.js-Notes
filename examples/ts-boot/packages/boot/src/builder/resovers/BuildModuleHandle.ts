import { ModuleBuilder } from '../../services';
import { BuildContext } from './BuildContext';
import { ResolveHandle } from './ResolveHandle';


export class BuildModuleHandle extends ResolveHandle {
    async execute(ctx: BuildContext, next: () => Promise<void>): Promise<void> {
        let builder = this.container.getService({ token: ModuleBuilder, target: ctx.type });
        if (builder instanceof ModuleBuilder) {
            ctx.target = await builder.build(ctx.target);
        } else {
            await next();
        }
    }
}
