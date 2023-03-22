export enum COLOR {
  BLACK = `\x1b[30m`,
  RED = `\x1b[31m`,
  GREEN = `\x1b[32m`,
  YELLOW = `\x1b[33m`,
  BLUE = `\x1b[34m`,
  MAGENTA = `\x1b[35m`,
  CYAN = `\x1b[36m`,
  LIGHT_GREY = `\x1b[90m`,
  LIGHT_RED = `\x1b[91m`,
  LIGHT_GREEN = `\x1b[92m`,
  LIGHT_YELLOW = `\x1b[93m`,
  LIGHT_BLUE = `\x1b[94m`,
  LIGHT_MAGENTA = `\x1b[95m`,
  LIGHT_CYAN = `\x1b[96m`,
  LIGHT_WHITE = `\x1b[97m`,
  RESET = '\x1b[0m',
}

export enum LOG_LEVEL {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export const LOG_COLOR = {
  [LOG_LEVEL.ERROR]: COLOR.LIGHT_RED,
  [LOG_LEVEL.WARN]: COLOR.YELLOW,
  [LOG_LEVEL.INFO]: COLOR.CYAN,
  [LOG_LEVEL.DEBUG]: COLOR.LIGHT_MAGENTA,
  [LOG_LEVEL.TRACE]: COLOR.LIGHT_GREY,
}
