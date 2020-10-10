import { BootHandle } from './BootHandle';
import { BootContext } from '../BootContext';

export class BootProvidersHandle extends BootHandle {
    async execute(ctx: BootContext, next: () => Promise<void>): Promise<void> {
        if (ctx.providers && ctx.providers.length) {
            let container = ctx.getRaiseContainer();
            container.bindProviders(...ctx.providers);
        }
        await next();
    }
}
