import { Express, Singleton } from '@tsdi/ioc';
import { AdvisorProceeding } from './AdvisorProceeding';
import { Joinpoint } from '../joinpoints';
import { ReturningType } from './ReturningType';
import { NonePointcut } from '../decorators/NonePointcut';

@NonePointcut()
@Singleton(AdvisorProceeding, ReturningType.promise)
export class AsyncPromiseProceeding extends AdvisorProceeding {

    proceeding(joinPoint: Joinpoint, ...actions: Express<Joinpoint, any>[]) {
        if (joinPoint.returning) {
            actions.forEach((action => {
                joinPoint.returning = joinPoint.returning.then((val) => {
                    joinPoint.returningValue = val;
                    return Promise.resolve(action(joinPoint))
                        .then(() => {
                            return joinPoint.returningValue;
                        });
                });
            }));
        }
    }
}
