import { Joinpoint, Around, Aspect, Before } from '../../src';
import { Singleton } from '@tsdi/ioc';

@Singleton
@Aspect
export class IocLog {
    @Around('execution(*)')
    log(joinPoint: Joinpoint) {
        console.log('aspect execution Around log, method name:', joinPoint.fullName, ' state:', joinPoint.state, ' args:', joinPoint.args, ' returning:', joinPoint.returning, ' throwing:', joinPoint.throwing);
    }

    @Before('execution(*)')
    beforelog(joinPoint: Joinpoint) {
        console.log('aspect execution Before log, method name:', joinPoint.fullName, ' state:', joinPoint.state, ' returning:', joinPoint.returning, ' throwing:', joinPoint.throwing);
    }

}
