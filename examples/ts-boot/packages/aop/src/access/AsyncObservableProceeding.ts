// import { isFunction, isObservable, isPromise, Express, Singleton } from '@tsdi/ioc';
// import { AdvisorProceeding } from './AdvisorProceeding';
// import { Joinpoint } from '../joinpoints';
// import { ReturningType } from './ReturningType';
// import { NonePointcut } from '../decorators/NonePointcut';

// @NonePointcut()
// @Singleton(AdvisorProceeding, ReturningType.observable)
// export class AsyncObservableProceeding extends AdvisorProceeding {

//     proceeding(joinPoint: Joinpoint, ...actions: Express<Joinpoint, any>[]) {
//         if (isObservable(joinPoint.returning) && isFunction(joinPoint.returning.flatMap)) {
//             actions.forEach(action => {
//                 joinPoint.returning = joinPoint.returning.flatMap((val) => {
//                     joinPoint.returningValue = val;
//                     action(joinPoint);
//                     if (isObservable(joinPoint.returningValue)) {
//                         return joinPoint.returningValue;
//                     } else if (isPromise(joinPoint.returningValue)) {
//                         return joinPoint.returningValue;
//                     } else {
//                         return Promise.resolve(joinPoint.returningValue);
//                     }
//                 });
//             });

//         } else {
//             actions.forEach(action => {
//                 action(joinPoint);
//             });
//         }
//     }
// }
