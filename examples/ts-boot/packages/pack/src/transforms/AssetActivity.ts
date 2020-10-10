import { Src, Task, TemplateOption, ActivityType } from '@tsdi/activities';
import { NodeActivityContext, ITransform, NodeExpression } from '../core';
import { SourcemapInitActivity, SourcemapWriteActivity } from './SourceMap';
import { StreamActivity } from './StreamActivity';
import { SourceActivity } from './SourceActivity';
import { DestActivity } from './DestActivity';
import { Input, Binding } from '@tsdi/components';
import { CleanActivity } from '../tasks';
import { PipeActivity } from './PipeActivity';

/**
 * shell activity config.
 *
 * @export
 * @interface AssetActivityOption
 * @extends {ActivityConfigure}
 */
export interface AssetActivityOption extends TemplateOption {
    /**
     * clean.
     *
     * @type {Binding<NodeExpression<Src>>}
     * @memberof AssetActivityOption
     */
    clean?: Binding<NodeExpression<Src>>;
    /**
     * shell cmd
     *
     * @type {Binding<Src>}
     * @memberof AssetActivityOption
     */
    src?: Binding<NodeExpression<Src>>;
    /**
     * sourcemap.
     *
     * @type {(Binding<NodeExpression<string | boolean>>)}
     * @memberof AssetActivityOption
     */
    sourcemap?: Binding<NodeExpression<string | boolean>>;
    /**
     * shell args.
     *
     * @type {Binding<Src>}
     * @memberof AssetActivityOption
     */
    dist?: Binding<NodeExpression<Src>>;
    /**
     *
     *
     * @type {Binding<ActivityType<ITransform>[]>}
     * @memberof ShellActivityOption
     */
    pipes?: Binding<ActivityType<ITransform>[]>;

}


/**
 * Shell Task
 *
 * @class ShellActivity
 * @implements {ITask}
 */
@Task('asset')
export class AssetActivity extends PipeActivity {

    @Input()
    clean: CleanActivity;
    /**
     * assert src.
     *
     * @type {NodeExpression<Src>}
     * @memberof AssetActivity
     */
    @Input()
    src: SourceActivity;
    /**
     * shell args.
     *
     * @type {NodeExpression<Src>}
     * @memberof AssetActivity
     */
    @Input('dist')
    dist: DestActivity;

    @Input('sourcemap')
    sourcemapInit: SourcemapInitActivity;

    @Input('sourcemap')
    sourcemapWrite: SourcemapWriteActivity;

    @Input('pipes')
    streamPipes: StreamActivity;

    protected async execute(ctx: NodeActivityContext): Promise<void> {
        await this.execActivity(ctx, this.getRunSequence());
    }

    protected getRunSequence(): ActivityType[] {
        return [
            this.clean,
            this.src,
            this.sourcemapInit,
            this.streamPipes,
            this.sourcemapWrite,
            this.dist
        ]
    }

}
