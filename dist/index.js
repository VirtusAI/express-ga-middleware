"use strict";
/**
 * Created by championswimmer on 05/01/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ua = require("universal-analytics");
var uuidv5 = require("uuid/v5");
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
        var uidSeed = req.ip + req.headers['user-agent'];
        var uid = uuidv5(uidSeed, '8c2087dc-f231-48ca-bbaf-9ab6c0953398');
        visitor.pageview({
            dp: req.originalUrl,
            dr: req.get('Referer'),
            ua: req.headers['user-agent'],
            uip: req.ip,
            uid: uid
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