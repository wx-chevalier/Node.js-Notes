import { Task, Expression } from '@tsdi/activities';
import { ITransform, NodeActivityContext, isTransform } from '../core';
import { Input } from '@tsdi/components';
import { PipeActivity } from './PipeActivity';
import { isUndefined } from '@tsdi/ioc';

@Task('[pipes]')
export class StreamActivity extends PipeActivity {

    constructor(@Input('pipes') protected pipes: Expression<ITransform>[]) {
        super()
    }

    protected async execute(ctx: NodeActivityContext): Promise<void> {
        let pipes = await this.resolveExpression(this.pipes, ctx);
        if (pipes && pipes.length) {
            this.result.value = await this.pipeStream(ctx, this.result.value, ...pipes);
        }
    }

    /**
     * stream pipe transform.
     *
     * @protected
     * @param {NodeActivityContext} ctx
     * @param {ITransform} stream
     * @param {...Expression<ITransform>[]} pipes
     * @returns {Promise<ITransform>}
     * @memberof StreamActivity
     */
    protected async pipeStream(ctx: NodeActivityContext, stream: ITransform, ...pipes: Expression<ITransform>[]): Promise<ITransform> {
        if (pipes.length < 1) {
            return stream;
        }

        if (pipes.length === 1) {
            return await this.executePipe(ctx, stream, pipes[0]);
        }

        let pstream = Promise.resolve(stream);
        pipes.forEach(transform => {
            if (transform) {
                pstream = pstream
                    .then(stm => {
                        return this.executePipe(ctx, stm, transform);
                    });
            }
        });
        return await pstream;
    }

    /**
     * execute stream pipe.
     *
     * @protected
     * @param {NodeActivityContext} ctx
     * @param {ITransform} stream stream pipe from
     * @param {GActivityType<ITransform>} transform steam pipe to.
     * @param {boolean} [waitend=false] wait pipe end or not.
     * @returns {Promise<ITransform>}
     * @memberof TransformActivity
     */
    protected async executePipe(ctx: NodeActivityContext, stream: ITransform, transform: Expression<ITransform>, waitend = false): Promise<ITransform> {
        let next: ITransform;
        let transPipe = await this.resolveExpression(transform, ctx);
        let vaild = false;
        if (isTransform(stream)) {
            if (isTransform(transPipe) && !transPipe.changeAsOrigin) {
                vaild = true;
            } else {
                next = stream;
            }
        } else if (isTransform(transPipe) && transPipe.changeAsOrigin) {
            next = transPipe;
        }

        if (vaild) {
            next = stream.pipe(transPipe);
            if (waitend) {
                return await new Promise((r, j) => {
                    next
                        .once('end', r)
                        .once('error', j);
                }).then(() => {
                    next.removeAllListeners('error');
                    next.removeAllListeners('end');
                    return next;
                }, err => {
                    next.removeAllListeners('error');
                    next.removeAllListeners('end');
                    if (!isUndefined(process)) {
                        console.error(err);
                        process.exit(1);
                        return err;
                    } else {
                        return Promise.reject(new Error(err));
                    }
                });
            }
        }
        return next;
    }

}
