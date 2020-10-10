import { AdvisorProceeding } from './AdvisorProceeding';
import { Joinpoint } from '../joinpoints';
import { Express, Singleton } from '@tsdi/ioc';
import { ReturningType } from './ReturningType';
import { NonePointcut } from '../decorators/NonePointcut';

@NonePointcut()
@Singleton(AdvisorProceeding, ReturningType.sync)
export class SyncProceeding extends AdvisorProceeding {

    proceeding(joinPoint: Joinpoint, ...actions: Express<Joinpoint, any>[]) {
        joinPoint.returningValue = joinPoint.returning;
        actions.forEach((action => {
            action(joinPoint);
        }))
    }
}
