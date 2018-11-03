"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_2 = require("winston");
const envUtils_1 = require("./envUtils");
const logger = new (winston_2.Logger)({
    transports: [
        new (winston_1.default.transports.Console)({ level: envUtils_1.isProd ? "error" : "debug" }),
        new (winston_1.default.transports.File)({ filename: "logs/debug.log", level: "debug" })
    ]
});
if (!envUtils_1.isProd) {
    logger.debug("Logging initialized at debug level");
}
exports.default = logger;
//# sourceMappingURL=logger.js.map