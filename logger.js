var rufus = require('rufus');
var config = require('./config');

var loggerConfig = {
    handlers: {
        console: {
            class: rufus.handlers.Console
        },
        file: {
            class: rufus.handlers.File,
            file: './logs/main.log'
        }
    },
    loggers: {
        root: {
            level: rufus.VERBOSE,
            handlers: ['file'],
            handleExceptions: true
        }
    }
};

//root it is a parent of all loggers so i can manipulate them at top

switch(config.env) {
    case 'test':
        //loggerConfig.loggers.root.level = rufus.CRITICAL;
        loggerConfig.loggers.root.handleExceptions = false;

        break;
    case 'development':
        loggerConfig.loggers.root.handlers.push('console');

        break;
    default:
}

//TODO output socket.io logs via rufus

rufus.config(loggerConfig);
