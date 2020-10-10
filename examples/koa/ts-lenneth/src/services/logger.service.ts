/**
 * 日志模块重新封装
 */
import {
  Logger,
  BaseLayout,
  LogEvent,
  Layout,
  Appender,
  BaseAppender
} from "ts-log-debug";
import { LennethSetting } from "@core";
import {
  ILoggerService,
  ILogTableSettings,
  ILogFileSetting
} from "@interfaces";
import { BaseService } from "./base.service";

const consoleLog = console.log.bind(console);

/**
 * 重置输出源
 */
@Appender({ name: "LennethConsoleAppender" })
class LennethConsoleAppender extends BaseAppender {
  write(loggingEvent: LogEvent) {
    consoleLog(this.layout(loggingEvent, this.config.timezoneOffset));
  }
}

/**
 * 自定义日志模版
 */
@Layout({ name: "customJson" })
class JsonLayout extends BaseLayout {
  transform(loggingEvent: LogEvent): string {
    const log = {
      startTime: loggingEvent.startTime,
      categoryName: loggingEvent.categoryName,
      level: loggingEvent.level.toString(),
      data: loggingEvent.data,
      context: loggingEvent.context
    };
    return JSON.stringify(log);
  }
}

export class LoggerService implements ILoggerService {
  private _loggerName: string;

  constructor(loggerName: string = "lenneth") {
    this._loggerName = loggerName;
  }

  info(msg: any) {
    this.use().info(msg);
  }

  debug(msg: any) {
    this.use().debug(msg);
  }

  warn(msg: any) {
    this.use().warn(msg);
  }

  error(msg: any) {
    this.use().error(msg);
  }

  drawTable(list: any[], setting: ILogTableSettings): string {
    return this.use().drawTable(list, setting);
  }

  private use(): Logger {
    const logger = new Logger(this._loggerName);

    const serverSettingMap = LennethSetting.serverSettingMap;
    let logFileSetting: ILogFileSetting = serverSettingMap.get(
      "logFileSetting"
    );

    logger.appenders.set("std-log", {
      type: "LennethConsoleAppender",
      level: ["debug", "info"]
    });
    if (logFileSetting && logFileSetting.useFlag) {
      logger.appenders.set("file-log", {
        type: "file",
        filename: logFileSetting.filename || "error.log",
        maxLogSize: logFileSetting.maxLogSize || 10485760,
        backups: logFileSetting.backups || 3,
        compress: true,
        levels: logFileSetting.levels || ["error", "warn"],
        layout: { type: "customJson" }
      });
    }

    return logger;
  }
}
