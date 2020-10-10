import { Singleton, isPromise } from '@tsdi/ioc';
import { ReturningType } from './ReturningType';
import { JoinpointState } from '../joinpoints';
import { NonePointcut } from '../decorators/NonePointcut';
import { IocRecognizer } from './IocRecognizer';

@NonePointcut()
@Singleton(IocRecognizer, JoinpointState.AfterReturning)
export class ReturningRecognizer extends IocRecognizer {

    recognize(value: any): string {
        if (isPromise(value)) {
            return ReturningType.promise;
        }

        // if (isObservable(value)) {
        //     return ReturningType.observable;
        // }

        return ReturningType.sync;
    }
}
