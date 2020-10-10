
import { ILoggerManager, ILogger, LoggerManagerToken } from '@tsdi/logs';
import { NonePointcut } from '@tsdi/aop';
import { Singleton, Injectable } from '@tsdi/ioc';
import { syncRequire } from '@tsdi/platform-server';

/**
 * log4js logger manager adapter.
 *
 * @export
 * @class Log4jsAdapter
 * @implements {ILoggerManger}
 */
@NonePointcut
@Singleton
@Injectable(LoggerManagerToken, 'log4js')
export class Log4jsAdapter implements ILoggerManager {
    private _log4js: any;
    constructor() {
    }
    getLog4js() {
        if (!this._log4js) {
            this._log4js = syncRequire('log4js');
        }
        return this._log4js;
    }
    configure(config: any) {
        this.getLog4js().configure(config);
    }
    getLogger(name?: string): ILogger {
        return this.getLog4js().getLogger(name);
    }

}
