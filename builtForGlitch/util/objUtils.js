"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_OP = () => {
};
function firstDefined(nullable, orElse) {
    return !!nullable ? nullable : orElse;
}
exports.firstDefined = firstDefined;
//# sourceMappingURL=objUtils.js.map