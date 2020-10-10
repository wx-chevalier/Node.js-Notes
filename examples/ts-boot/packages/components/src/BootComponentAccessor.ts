import { BootTargetAccessor } from '@tsdi/boot';
import { Injectable, isArray, lang } from '@tsdi/ioc';
import { ComponentManager } from './ComponentManager';
import { IContainer } from '@tsdi/core';

@Injectable()
export class BootComponentAccessor extends BootTargetAccessor {

    getBoot(target: any, raiseContainer: IContainer) {
        let composite = raiseContainer.resolve(ComponentManager)
            .getLeaf(target);
        return (isArray(composite) ? lang.first(composite) : composite) || target;
    }
}
