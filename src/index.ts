/**
 * Created by championswimmer on 05/01/17.
 */

import * as ua from 'universal-analytics'
import {Request, Response, RequestHandler, NextFunction} from 'express'
import * as uuidv5 from 'uuid/v5'
declare module 'express' {
  export interface Request {
    ga: {
        event: (options: GAEventOptions, emitted: (e: Error) => void) => void
    }
  }
}


export interface ExpressGAHandler extends RequestHandler {
  event: (options: GAEventOptions) => RequestHandler
}
export interface GAEventOptions {
  category: string
  action: string
  label?: string
  value?: string | number
}


export function ExpressGA(uaCode: string): ExpressGAHandler {
  let visitor = ua(uaCode, {https: true});

  function GAEventMiddleware (options: GAEventOptions): RequestHandler {

    return <RequestHandler> function (req: Request, res: Response, next: NextFunction) {
      visitor.event(options.category, options.action, options.label, options.value).send()
      next()
    }
  }

  function GAEventEmitter (options: GAEventOptions, emitted: (e: Error) => void) {
    visitor.event(
      options.category,
      options.action,
      options.label,
      options.value,
      (err: Error) => emitted ? emitted(err) : null
    )
  }

  let middleware = <ExpressGAHandler> function (req: Request, res: Response, next: NextFunction) {
    let uidSeed = req.ip + req.headers['user-agent'];
    let uid = uuidv5(uidSeed, '8c2087dc-f231-48ca-bbaf-9ab6c0953398');

    visitor.pageview({
      dp: req.originalUrl,
      dr: req.get('Referer'),
      ua: req.headers['user-agent'],
      uip: req.ip,
      uid: uid
    }).send();
    req.ga = {
        event: GAEventEmitter
    }
    next();
  };

  middleware.event = GAEventMiddleware


  return middleware;
}

module.exports = ExpressGA
export default ExpressGA