"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_ui_dist_1 = require("swagger-ui-dist");
exports.getPathToSwaggerUi = swagger_ui_dist_1.absolutePath;
exports.appendUrlQueryStringIfMissing = (req, res, next) => {
    if (!("url" in req.query)) {
        console.debug(`no url in query, populating`);
        res.redirect("/?url=swagger/swagger.json");
    }
    else {
        console.debug(`url already populated in query, next`);
        next();
    }
};
//# sourceMappingURL=home.js.map