import { BuildHandle, BuildContext } from '@tsdi/boot';
import { isArray } from '@tsdi/ioc';
import { SequenceActivity, ParallelActivity } from '../activities';

export class ValidTaskComponentHandle extends BuildHandle<BuildContext> {
    async execute(ctx: BuildContext, next: () => Promise<void>): Promise<void> {
        if (ctx.composite) {
            if (isArray(ctx.composite)) {
                if (ctx.target instanceof SequenceActivity || ctx.target instanceof ParallelActivity) {
                    ctx.target.add(...ctx.composite);
                    ctx.composite = null;
                } else {
                    let sequence = this.container.get(SequenceActivity);
                    sequence.add(...ctx.composite);
                    ctx.composite = sequence;
                }
            }
        }
        await next();
    }
}
