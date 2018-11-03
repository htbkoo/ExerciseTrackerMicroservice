"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
function todayInUtc() {
    return luxon_1.DateTime.utc().toISODate();
}
exports.todayInUtc = todayInUtc;
//# sourceMappingURL=datetimeService.js.map