import { BootHandle } from './BootHandle';
import { BootContext } from '../BootContext';
import { ConfigureRegister, ConfigureManager } from '../annotations';


export class ModuleConfigureRegisterHandle extends BootHandle {
    async execute(ctx: BootContext, next: () => Promise<void>): Promise<void> {
        let regs = ctx.getRaiseContainer().getServices({ token: ConfigureRegister, target: ctx.module });
        if (regs && regs.length) {
            let mgr = this.resolve(ctx, ConfigureManager);
            let config = await mgr.getConfig();
            await Promise.all(regs.map(reg => reg.register(config, ctx)));
        }
        await next();
    }
}
