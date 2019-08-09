/**
 * Config winston logger, settings default config or custom transport here
 * Created by tphuocthai on 3/19/16.
 */
const nconf = require('nconf');
const { createLogger, format, transports } = require('winston');
const { combine, colorize, timestamp, prettyPrint, printf, splat } = format;
const { inspect } = require('util');

module.exports = createLogger({
  level: nconf.get('logger:level') || 'info',
  format: combine(
    splat(),
    timestamp(),
    colorize(),
    prettyPrint(),
    printf(info => {
      let { timestamp, level, message, [Symbol.for('splat')]: splatArr } = info;
      if (!splatArr || splatArr.length === 0) {
        return `${timestamp} ${level}: ${message}`;
      }

      let stringifyRest = splatArr.map((splt) => {
        if (typeof splt === 'object') {
          return inspect(splt, { showHidden: false, depth: null });
        }
        return splt;
      }).join(' ');
      return `${timestamp} ${level}: ${message} ${stringifyRest}`;
    }),
  ),
  transports: [new transports.Console()],
});
