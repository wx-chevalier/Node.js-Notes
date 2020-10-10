import { Activity, Task, Src, BodyActivity, BodyTemplate } from '@tsdi/activities';
import { PromiseUtil } from '@tsdi/ioc';
import { fromEventPattern } from 'rxjs';
import { bufferTime, filter } from 'rxjs/operators';
import { NodeActivityContext, NodeExpression } from '../core';
import { Input, Binding } from '@tsdi/components';
const chokidar = require('chokidar');


export interface WatchActivityOption extends BodyTemplate {
    /**
     * watch source.
     *
     * @type {NodeExpression<Src>}
     * @memberof UnitTestActivityOption
     */
    watch: Binding<NodeExpression<Src>>;

    /**
     * src option
     *
     * @type {NodeExpression<DestOptions>}
     * @memberof UnitTestActivityOption
     */
    watchOptions?: Binding<NodeExpression>;
}


/**
 * watch activity.
 *
 * @export
 * @class WatchActivity
 * @extends {BuildHandleActivity}
 */
@Task('watch')
export class WatchActivity extends Activity<Src> {

    @Input()
    watch: NodeExpression<Src>;

    @Input('watchOptions')
    options:  NodeExpression;

    @Input()
    body: BodyActivity;


    protected async execute(ctx: NodeActivityContext) {
        let watchSrc = await this.resolveExpression(this.watch, ctx);
        watchSrc = ctx.platform.toRootSrc(watchSrc);
        let options = await this.resolveExpression(this.options, ctx);
        let watcher = chokidar.watch(watchSrc, Object.assign({ ignored: /[\/\\]\./, ignoreInitial: true }, options));

        let defer = PromiseUtil.defer();
        fromEventPattern<string[]>(
            handler => {
                watcher.on('add', paths => handler(paths));
                watcher.on('change', paths => handler(paths));
                watcher.on('unlink', paths => handler(paths));
                watcher.on('unlinkDir', paths => handler(paths));
            },
            handler => {
                watcher.close();
            })
            .pipe(
                bufferTime(300),
                filter(c => c.length > 0)
            )
            .subscribe(chg => {
                this.body.run(ctx);
            });

        defer.promise;
    }
}
