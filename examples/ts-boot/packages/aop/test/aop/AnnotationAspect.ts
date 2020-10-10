import { Singleton, MethodMetadata } from '@tsdi/ioc';
import { Joinpoint, Pointcut, Around, Aspect, Before, After} from '../../src';

@Aspect
export class AnnotationAspect {
    // pointcut for method has @AutoWried decorator.
    @Pointcut('@annotation(AutoWired)', 'authMetas')
    auth(joinPoint: Joinpoint, authMetas: MethodMetadata[]) {
        console.log('authMetas:', authMetas);
        console.log('aspect annotation Before log, method name:', joinPoint.fullName, ' state:', joinPoint.state, ' returning:', joinPoint.returning, ' throwing:', joinPoint.throwing);
    }

}
