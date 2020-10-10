import { Task, Activity, Src, TemplateOption } from '@tsdi/activities';
import { NodeActivityContext, NodeExpression } from '../core';
import { runTest, UnitTestConfigure } from '@tsdi/unit';
import { ConsoleReporter } from '@tsdi/unit-console';
import { Input, Binding } from '@tsdi/components';



/**
 * unit test activity template option.
 *
 * @export
 * @interface SourceActivityOption
 * @extends {TemplateOption}
 */
export interface UnitTestActivityOption extends TemplateOption {
    /**
     * test source.
     *
     * @type {NodeExpression<Src>}
     * @memberof UnitTestActivityOption
     */
    test: Binding<NodeExpression<Src>>;

    /**
     * src option
     *
     * @type {NodeExpression<DestOptions>}
     * @memberof UnitTestActivityOption
     */
    testOptions?: Binding<NodeExpression<UnitTestConfigure>>;
}


@Task('test, [test]')
export class UnitTestActivity extends Activity<void> {

    @Input()
    test: NodeExpression<Src>;

    @Input('testOptions')
    options: NodeExpression<UnitTestConfigure>;


    constructor(@Input() test: NodeExpression<Src>) {
        super()
        this.test = test;
    }

    protected async execute(ctx: NodeActivityContext): Promise<void> {
        let test = await this.resolveExpression(this.test, ctx);
        let options = await this.resolveExpression(this.options, ctx);
        if (test) {
            await runTest(ctx.platform.toRootSrc(test), options, ConsoleReporter);
        }
    }
}

