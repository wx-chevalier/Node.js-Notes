import { Abstract } from '@tsdi/ioc';
import { IContainer } from '@tsdi/core';

@Abstract()
export abstract class BootTargetAccessor {
    abstract getBoot(target: any, raiseContainer: IContainer): any;
}
