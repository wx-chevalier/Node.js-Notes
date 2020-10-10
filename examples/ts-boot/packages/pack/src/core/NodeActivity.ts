import { Activity } from '@tsdi/activities';
import { NodeActivityContext } from './NodeActivityContext';

/**
 * activity for Nodejs server side.
 *
 * @export
 * @abstract
 * @class NodeActivity
 * @extends {Activity<T>}
 * @template T
 */
export abstract class NodeActivity<T, TCtx extends NodeActivityContext = NodeActivityContext> extends Activity<T, TCtx> {
    /**
     * pipe stream activity
     *
     * @protected
     * @abstract
     * @param {TCtx} ctx
     * @returns {Promise<void>}
     * @memberof PipeActivity
     */
    protected abstract execute(ctx: TCtx): Promise<void>;
}
