import { ParallelExecutor } from '@tsdi/activities';
import { syncRequire } from '@tsdi/platform-server';
import { Injectable, PromiseUtil } from '@tsdi/ioc';
// import * as cluster from 'cluster';

@Injectable
export class ServerParallelExecutor extends ParallelExecutor {
    constructor(private workers = 4) {
        super();
    }

    run<T>(func: (item: T) => any, items: T[], ...args: any[]) {
        let napa;
        try {
            napa = syncRequire('napajs');
        } catch { }

        if (napa) {
            let zone1 = napa.napa.zone.create('zone1', { workers: this.workers });
            return Promise.all(items.map(itm => zone1.execute(func, [itm])));
        } else {
            return Promise.all(items.map(itm => {
                return Promise.resolve(func(itm))
                    .catch(err => {
                        process.exit(1);
                    })
            }));
        }
    }

    // runByCluster<T>(func: (item: T) => any, items: T[]) {
    //     const cluster = syncRequire('cluster');
    //     let defer = PromiseUtil.defer();
    //     if (cluster.isMaster) {
    //         for (let i = 0; i < this.workers; i++) {
    //             cluster.fork();
    //         }
    //         let workers = this.workers;
    //         cluster.on('exit', function (worker, code, signal) {
    //             console.log('cluster worker', worker.id, code);
    //             if (code > 0) {
    //                 process.exit(1);
    //             }
    //             if (!--workers) {
    //                 defer.resolve();
    //             }
    //         });
    //     } else {
    //         items.map(item => func(item));
    //     }
    //     return defer.promise;
    // }

}
