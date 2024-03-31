import winston, { Logger, format } from 'winston';

const { combine, errors, timestamp, label, json, colorize, printf } = format;

const LABEL = 'order-planet';
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss:SSS';
const COLORS = {
  label: 'grey',
  from: 'blue',
  error: 'bold red',
  warn: 'yellow',
  info: 'green',
  verbose: 'cyan',
  debug: 'magenta'
};

const colorizer = colorize();

let loggerInstance: Logger;

function createCommonFormats() {
  return [
    errors({ stack: true }),
    timestamp({ format: TIMESTAMP_FORMAT }),
    label({ label: LABEL }),
    json({ space: 2 })
  ];
}

function createConsoleTransportFormat() {
  const formats = [
    label({ label: LABEL }),
    printf(
      (info: { level: string; message: any; [key: string]: string }) =>
        `${
          process.env.MODE === 'local'
            ? colorizer.colorize('label', `[${info.label}]`)
            : `[${info.label}]`
        } ${info.level} ${info.timestamp} ${
          process.env.MODE === 'local'
            ? colorizer.colorize('from', `[${info.from}]`)
            : `[${info.from}]`
        } ${info.message}`
    )
  ];

  if (process.env.MODE === 'local') {
    formats.unshift(colorize({ all: true, colors: COLORS }));
  }

  return combine(...formats);
}

const createLogger = () => {
  if (loggerInstance) {
    loggerInstance.error('Logger instance already exists.');
    return;
  }

  loggerInstance = winston.createLogger({
    level: process.env.MODE === 'prod' ? 'info' : 'debug',
    format: combine(...createCommonFormats()),
    exitOnError: false,
    transports: [
      new winston.transports.Console({ format: createConsoleTransportFormat() })
    ]
  });
};

export { loggerInstance as logger, createLogger };
