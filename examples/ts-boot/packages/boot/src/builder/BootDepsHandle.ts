import { BootHandle } from './BootHandle';
import { BootContext } from '../BootContext';

export class BootDepsHandle extends BootHandle {
    async execute(ctx: BootContext, next: () => Promise<void>): Promise<void> {
        if (ctx.deps && ctx.deps.length) {
            let container = ctx.getRaiseContainer();
            await container.load(...ctx.deps);
        }
        await next();
    }
}
