import {
    Singleton, isString, IParameter, isDate, isArray, isClass,
    lang, Refs, isAbstractClass, isNull
} from '@tsdi/ioc';
import { Joinpoint, JoinpointState, NonePointcut } from '@tsdi/aop';
import { LoggerAspect, LogFormaterToken, ILogFormater } from '@tsdi/logs';
import chalk from 'chalk';
import { Container } from '@tsdi/core';


@NonePointcut()
@Singleton()
@Refs(LoggerAspect, LogFormaterToken)
export class ServerLogFormater implements ILogFormater {

    constructor() {

    }

    format(joinPoint?: Joinpoint, message?: string): string {
        let pointMsg: string;
        switch (joinPoint.state) {
            case JoinpointState.Before:
            case JoinpointState.Pointcut:
                pointMsg = `${joinPoint.state} invoke method ${chalk.cyan(joinPoint.fullName)}\n`
                pointMsg += chalk.gray(' with args: ')
                pointMsg += this.stringifyArgs(joinPoint.params, joinPoint.args);
                pointMsg += '\n';
                break;
            case JoinpointState.After:
                pointMsg = `${joinPoint.state}  invoke method ${chalk.cyan(joinPoint.fullName)}.\n`;
                break;
            case JoinpointState.AfterReturning:
                pointMsg = `Invoke method ${chalk.cyan(joinPoint.fullName)}\n`
                pointMsg += chalk.gray(` returning value: `)
                pointMsg += this.stringify(joinPoint.returningValue);
                pointMsg += '\n';
                break;
            case JoinpointState.AfterThrowing:
                pointMsg = `Invoke method ${chalk.cyan(joinPoint.fullName)}\n`
                pointMsg += chalk.red(` throw error: `)
                pointMsg += chalk.red(this.stringify(joinPoint.throwing));
                pointMsg += '\n';
                break;
            default:
                pointMsg = '';
                break;
        }

        return this.joinMessage([pointMsg, message]);

    }

    protected stringifyArgs(params: IParameter[], args: any[]) {
        let argsStr = params.map((p, idx) => {
            let arg = args.length >= idx ? args[idx] : null;
            return chalk.green(`    <param name: "${p.name || ''}"> `) + chalk.gray(`${this.stringify(arg)}`);
        }).join(',\n');
        if (argsStr) {
            return this.joinMessage(['  [\n', argsStr, '\n]'], '');
        } else {
            return chalk.gray('[]');
        }
    }

    protected joinMessage(messgs: any[], separator = '; ') {
        return messgs.filter(a => a).map(a => isString(a) ? a : a.toString()).join(separator);
    }

    protected stringifyArray(args: any[]): string {
        if (!args.length) {
            return '[]';
        }
        return '[\n' + args.map(arg => this.stringify(arg)).join(',\n') + '\n].';
    }

    protected stringify(target: any): string {
        let type = typeof target;
        let str = '';
        switch (type) {
            case 'string':
                str = chalk.gray(`"${target}"`);
                break;
            case 'boolean':
                str = chalk.cyan(target.toString());
                break;
            case 'number':
                str = chalk.cyanBright(target.toString());
                break;
            case 'symbol':
                str = chalk.gray(target.toString());
                break;
            case 'undefined':
                str = chalk.gray('undefined');
                break;
            case 'object':
                if (isNull(target)) {
                    str = chalk.gray('null');
                } else if (isArray(target)) {
                    str = this.stringifyArray(target);
                } else if (isDate(target)) {
                    str = chalk.gray(`[${chalk.cyan('Date')}: ${target.toString()}]`);
                } else if (target instanceof Container) {
                    str = chalk.gray(`[${chalk.cyan(lang.getClassName(target))}]`);
                } else {
                    str = chalk.gray(`[${chalk.cyan(lang.getClassName(target))}: ${this.toJsonString(target)}]`);
                }
                break;
            case 'function':
                if (isClass(target) || isAbstractClass(target)) {
                    str = chalk.gray(`[class: ${lang.getClassName(target)}]`);
                } else {
                    str = chalk.gray(`[function: ${lang.getClassName(target)}]`);
                }
                break;

        }

        return str;
    }

    protected toJsonString(target: any) {
        try {
            return JSON.stringify(target);
        } catch (err) {
            return 'object';
        }
    }
}
