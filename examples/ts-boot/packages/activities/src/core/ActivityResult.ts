import { InjectToken, Inject, Injectable, PromiseUtil } from '@tsdi/ioc';
import { ActivityContext } from './ActivityContext';


export const NextToken = new InjectToken<() => Promise<void>>('next_step');


@Injectable
export class ActivityResult<T = any> {

    protected nexts: PromiseUtil.ActionHandle<ActivityContext>[];
    constructor(@Inject(NextToken) next?: () => Promise<void>) {
        this.nexts = [next];
    }

    value: T;

    error: Error;

    next<T extends ActivityContext>(ctx: T): Promise<void> {
        return PromiseUtil.runInChain(this.nexts, ctx);
    }

    setNext<T extends ActivityContext>(next: (ctx: T, next?: () => Promise<void>) => Promise<void>) {
        this.nexts.unshift(next);
    }
}
