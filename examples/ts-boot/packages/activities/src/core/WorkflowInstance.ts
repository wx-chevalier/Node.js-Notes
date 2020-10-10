import { Service, Startup } from '@tsdi/boot';
import { Injectable, Refs, Inject } from '@tsdi/ioc';
import { Activity } from './Activity';
import { ActivityContext } from './ActivityContext';
import { ActivityConfigure } from './ActivityConfigure';
import { ActivityStatus } from './ActivityStatus';

/**
 *run state.
 *
 * @export
 * @enum {number}
 */
export enum RunState {
    /**
     * activity init.
     */
    init,
    /**
     * runing.
     */
    running,
    /**
     * activity parused.
     */
    pause,
    /**
     * activity stopped.
     */
    stop,
    /**
     * activity complete.
     */
    complete
}

/**
 * task runner.
 *
 * @export
 * @class TaskRunner
 * @implements {ITaskRunner}
 */
@Injectable
@Refs(Activity, Startup)
@Refs('@Task', Startup)
export class WorkflowInstance<T extends Activity = Activity, TCtx extends ActivityContext = ActivityContext> extends Service<T, TCtx> {


    private _result: any;
    get result(): any {
        return this._result;
    }

    /**
     * workflow status.
     *
     * @type {ActivityStatus}
     * @memberof ActivityContext
     */
    @Inject
    status: ActivityStatus;

    state: RunState;


    async onInit(): Promise<void> {
        let mgr = this.context.getConfigureManager<ActivityConfigure>();
        await mgr.getConfig();
    }


    async start(data?: any): Promise<TCtx> {
        let container = this.getContainer();
        this.context.data = data;
        if (this.context.id && !container.has(this.context.id)) {
            container.bindProvider(this.context.id, this);
        }
        let target = this.getBootNode();
        await target.run(this.context, async () => {
            this.state = RunState.complete;
            this._result = this.context.result;
        })

        return this.context;

    }

    async stop(): Promise<any> {
        this.state = RunState.stop;
    }

    async pause(): Promise<any> {
        this.state = RunState.pause;
    }

}
