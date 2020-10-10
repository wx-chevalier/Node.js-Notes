import { NodeActivityContext, ITransform, NodeExpression } from '../core';
import { Task, ActivityType, TemplateOption } from '@tsdi/activities';
import { DestOptions, dest } from 'vinyl-fs';
import { Input, Binding } from '@tsdi/components';
import { PipeActivity } from './PipeActivity';



/**
 * dist activity template option.
 *
 * @export
 * @interface DistActivityOption
 * @extends {TemplateOption}
 */
export interface DistActivityOption extends TemplateOption {
    /**
     * source stream to dist.
     *
     * @type {NodeExpression<string>}
     * @memberof DistActivityOption
     */
    dist: Binding<NodeExpression<string>>;

    /**
     * dist stream pipes.
     *
     * @type {GActivityType<ITransform>[]}
     * @memberof DistActivityOption
     */
    destPipes?: Binding<ActivityType<ITransform>[]>

    /**
     * dist option
     *
     * @type {Binding<DestOptions>}
     * @memberof DistActivityOption
     */
    distOptions?: Binding<NodeExpression<DestOptions>>;
}


/**
 * source stream to dist activity.
 *
 * @export
 * @class DestActivity
 * @extends {TransformActivity}
 */
@Task('dist, [dist]')
export class DestActivity extends PipeActivity {

    @Input()
    dist: NodeExpression<string>;

    @Input('destOptions')
    options: NodeExpression<DestOptions>;

    constructor(@Input() dist: NodeExpression<string>) {
        super()
        this.dist = dist;
    }

    protected async execute(ctx: NodeActivityContext): Promise<void> {
        let dist = await this.resolveExpression(this.dist, ctx);
        if (dist) {
            let options = await this.resolveExpression(this.options, ctx);
            await this.executePipe(ctx, this.result.value, dest(ctx.platform.toRootPath(dist), options), true);
        }
        this.result.value = null;
    }
}
