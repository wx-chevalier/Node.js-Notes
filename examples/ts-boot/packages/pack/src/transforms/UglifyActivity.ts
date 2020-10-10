import { PipeActivity } from './PipeActivity';
import { Task } from '@tsdi/activities';
import { NodeActivityContext, NodeExpression } from '../core';
import { Input } from '@tsdi/components';
const uglify = require('gulp-uglify');

@Task('uglify, [uglify]')
export class UglifyActivity extends PipeActivity {

    @Input('uglifyOptions')
    options: NodeExpression;

    @Input()
    uglify: NodeExpression<boolean>;

    constructor(@Input() uglify: NodeExpression<boolean>) {
        super();
        this.uglify = uglify;
    }

    protected async execute(ctx: NodeActivityContext): Promise<void> {
        let enable = await this.resolveExpression(this.uglify, ctx);
        if (enable) {
            let options = await this.resolveExpression(this.options, ctx);
            this.result.value = await this.executePipe(ctx, this.result.value, options ? uglify(options) : uglify());
        }
    }
}
