import { NodeActivityContext, NodeExpression } from '../core';
import { Task, Src, TemplateOption } from '@tsdi/activities';
import { SrcOptions, src } from 'vinyl-fs';
import { Input, Binding } from '@tsdi/components';
import { TransformActivity } from './TransformActivity';



/**
 * source activity template option.
 *
 * @export
 * @interface SourceActivityOption
 * @extends {TemplateOption}
 */
export interface SourceActivityOption extends TemplateOption {
    /**
     * source.
     *
     * @type {NodeExpression<Src>}
     * @memberof SourceActivityOption
     */
    src: Binding<NodeExpression<Src>>;

    /**
     * src option
     *
     * @type {NodeExpression<DestOptions>}
     * @memberof DistActivityOption
     */
    srcOptions?: Binding<NodeExpression<SrcOptions>>;
}

/**
 * Source activity.
 *
 * @export
 * @class SourceActivity
 * @extends {TransformActivity}
 */
@Task('src, [src]')
export class SourceActivity extends TransformActivity {

    @Input()
    protected src: NodeExpression<Src>;

    @Input('srcOptions')
    protected options: NodeExpression<SrcOptions>;

    constructor(@Input() src: NodeExpression<Src>) {
        super()
        this.src = src;
    }

    protected async execute(ctx: NodeActivityContext): Promise<void> {
        let strSrc = await this.resolveExpression(this.src, ctx);
        if (strSrc) {
            let options = await this.resolveExpression(this.options, ctx);
            this.result.value = src(ctx.platform.toRootSrc(strSrc), options || undefined);
        }
    }
}
