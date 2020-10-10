import { BootHandle } from './BootHandle';
import { BootContext } from '../BootContext';
import { ConfigureManager } from '../annotations';


export class BootConfigureLoadHandle extends BootHandle {
    async execute(ctx: BootContext, next: () => Promise<void>): Promise<void> {
        if (!(ctx instanceof BootContext)) {
            return;
        }
        let mgr = this.resolve(ctx, ConfigureManager);

        if (ctx.configures && ctx.configures.length) {
            ctx.configures.forEach(config => {
                mgr.useConfiguration(config);
            });
        } else {
            // load default config.
            mgr.useConfiguration();
        }

        let { deps, baseURL } = await mgr.getConfig();
        if (deps && deps.length) {
            let container = ctx.getRaiseContainer();
            await container.load(...deps);
        }
        if (baseURL) {
            ctx.baseURL = baseURL;
        }

        await next();
    }
}
