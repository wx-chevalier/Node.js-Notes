import { ActivityContext, Activity, CtxExpression } from '@tsdi/activities';
import { Injectable, Refs } from '@tsdi/ioc';
import { BootContext } from '@tsdi/boot';
import { IPlatformService, PlatformServiceToken } from './IPlatformService';



export type NodeExpression<T = any> = CtxExpression<T, NodeActivityContext>;

/**
 * pipe activity context.
 *
 * @export
 * @class NodeActivityContext
 * @extends {ActivityContext}
 * @implements {IActivityContext<ITransform>}
 */
@Injectable
@Refs(Activity, BootContext)
@Refs('@Task', BootContext)
export class NodeActivityContext extends ActivityContext {

    private _platform: IPlatformService;
    get platform(): IPlatformService {
        if (!this._platform) {
            this._platform = this.getRaiseContainer().resolve(PlatformServiceToken);
        }
        return this._platform;
    }
}

