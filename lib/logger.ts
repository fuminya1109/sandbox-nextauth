import log, { LogLevel } from 'loglevel';
import chalk, { Chalk } from 'chalk';
import prefix from 'loglevel-plugin-prefix';

type Levels = keyof LogLevel;

const colors: Record<Levels, Chalk> = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
  SILENT: chalk.gray,
};

if (process.env.NODE_ENV == 'development') {
  log.setLevel('debug');
}

prefix.reg(log);

prefix.apply(log, {
  format(level, name, timestamp) {
    return `${chalk.gray(`[${timestamp}]`)} ${colors[
      level.toUpperCase() as Levels
    ](level)} ${chalk.green(`${name}:`)}`;
  },
});

export { log as logger };
