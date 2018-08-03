import winston from "winston";
import { Logger } from "winston";
import { isProd } from "./envUtils";

const logger = new (Logger)({
    transports: [
        new (winston.transports.Console)({level: isProd ? "error" : "debug"}),
        new (winston.transports.File)({filename: "logs/debug.log", level: "debug"})
    ]
});

if (!isProd) {
    logger.debug("Logging initialized at debug level");
}

export default logger;

