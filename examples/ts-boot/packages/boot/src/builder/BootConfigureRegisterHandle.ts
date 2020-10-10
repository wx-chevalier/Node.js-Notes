import { BootHandle } from './BootHandle';
import { BootContext } from '../BootContext';
import { ConfigureRegister, ConfigureManager } from '../annotations';
import { LogConfigureToken } from '@tsdi/logs';


export class BootConfigureRegisterHandle extends BootHandle {
    async execute(ctx: BootContext, next: () => Promise<void>): Promise<void> {
        let regs = ctx.getRaiseContainer().getServices(ConfigureRegister);
        if (regs && regs.length) {
            let mgr = this.resolve(ctx, ConfigureManager);
            let config = await mgr.getConfig();
            config = ctx.configuration = Object.assign({}, config, ctx.annoation);
            await Promise.all(regs.map(reg => reg.register(config, ctx)));
            if (config.logConfig && !this.container.has(LogConfigureToken) && !ctx.getRaiseContainer().has(LogConfigureToken)) {
                this.container.bindProvider(LogConfigureToken, config.logConfig);
            }
        }
        await next();
    }
}
