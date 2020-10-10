import { BootHandle } from './BootHandle';
import { BootContext } from '../BootContext';
import { StartupService } from '../annotations';
import { isToken, isArray } from '@tsdi/ioc';

export class ConfigureServiceHandle extends BootHandle {
    async execute(ctx: BootContext, next: () => Promise<void>): Promise<void> {
        let regs = ctx.getRaiseContainer().getServices(StartupService);
        if (regs && regs.length) {
            let sts = ctx.starupServices;
            await Promise.all(regs.map(async reg => {
                let tks = await reg.configureService(ctx);
                if (isArray(tks)) {
                    sts.startups.push(...tks.filter(t => isToken(t)))
                } else if (isToken(tks)) {
                    sts.startups.push(tks);
                }
            }));
        }
        await next();
    }
}
