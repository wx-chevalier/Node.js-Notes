import { RegisterActionContext, RegisterActionOption } from '../RegisterActionContext';
import { IIocContainer } from '../../IIocContainer';

/**
 * design action option.
 *
 * @export
 * @interface DesignActionOption
 * @extends {RegisterActionOption}
 */
export interface DesignActionOption extends RegisterActionOption {

}

/**
 * design action context.
 *
 * @export
 * @class DesignActionContext
 * @extends {RegisterActionContext}
 */
export class DesignActionContext extends RegisterActionContext {

    /**
     * parse design action context.
     *
     * @static
     * @param {DesignActionOption} options
     * @param {(IIocContainer | (() => IIocContainer))} [raiseContainer]
     * @returns {DesignActionContext}
     * @memberof DesignActionContext
     */
    static parse(options: DesignActionOption, raiseContainer?: IIocContainer | (() => IIocContainer)): DesignActionContext {
        let ctx = new DesignActionContext(options.targetType);
        raiseContainer && ctx.setRaiseContainer(raiseContainer);
        ctx.setOptions(options);
        return ctx;
    }

}
