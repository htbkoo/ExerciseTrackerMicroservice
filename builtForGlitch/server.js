"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = __importDefault(require("errorhandler"));
const logger_1 = __importDefault(require("./util/logger"));
const app_1 = __importDefault(require("./app"));
/**
 * Error Handler. Provides full stack - remove for production
 */
app_1.default.use(errorhandler_1.default());
/**
 * Start Express server.
 */
const server = app_1.default.listen(app_1.default.get("port"), () => {
    logger_1.default.debug("  App is running at http://localhost:%d in %s mode", app_1.default.get("port"), app_1.default.get("env"));
    logger_1.default.debug("  Press CTRL-C to stop\n");
});
exports.default = server;
//# sourceMappingURL=server.js.map