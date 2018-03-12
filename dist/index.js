"use strict";
/**
 * Created by championswimmer on 05/01/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ua = require("universal-analytics");
function ExpressGA(uaCode) {
    var visitor = ua(uaCode, { https: true });
    function GAEventMiddleware(options) {
        return function (req, res, next) {
            visitor.event(options.category, options.action, options.label, options.value).send();
            next();
        };
    }
    function GAEventEmitter(options, emitted) {
        visitor.event(options.category, options.action, options.label, options.value, function (err) { return emitted ? emitted(err) : null; });
    }
    var middleware = function (req, res, next) {
        visitor.pageview({
            dp: req.originalUrl,
            dr: req.get('Referer'),
            ua: req.headers['user-agent'],
            uip: req.ip
        }).send();
        req.ga = {
            event: GAEventEmitter
        };
        next();
    };
    middleware.event = GAEventMiddleware;
    return middleware;
}
exports.ExpressGA = ExpressGA;
module.exports = ExpressGA;
exports.default = ExpressGA;
//# sourceMappingURL=index.js.map