import { RequestHandler } from "express";
import { version } from '../../package.json';

export const setHeadersMiddleware: RequestHandler = (req, res, next) => {
  res.set( 'Access-Control-Allow-Origin', '*');
  res.set( 'Access-Control-Allow-Methods', 'POST, HEAD, PATCH, DELETE, GET, PUT, DELETE' );
  res.set( 'Access-Control-Allow-Headers', 'Content-Type, Location, Authorization');
  res.set('x-api-version', version);
  req.version = version;
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    res.send({ message: 'ok'});
  }
  else {
    next();
  }
}
