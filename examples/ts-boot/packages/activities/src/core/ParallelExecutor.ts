import { Abstract } from '@tsdi/ioc';

@Abstract()
export abstract class ParallelExecutor {
    abstract run<T>(func: (item: T) => any, items: T[], ...args: any[]);
}
