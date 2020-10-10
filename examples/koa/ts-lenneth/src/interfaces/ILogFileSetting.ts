export interface ILogFileSetting {
  // 是否启用
  useFlag: boolean;
  // 文件名
  filename?: string;
  // file size 最大值
  maxLogSize?: number;
  // 回滚日期
  backups?: number;
  compress?: boolean;
  // 展示日志级别
  levels?: string[];
}
