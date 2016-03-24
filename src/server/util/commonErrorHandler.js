'use strict';

import shortid from 'shortid'

//***
//*** Our express common error handler (handles BOTH "throw Error" and Express "next(err)")
//***

export default function commonErrorHandler(err, req, res, next) {

  // interpret various proprietary Error properties
  const name      = err.name      || "UNKNOWN NAME";
  const status    = err.status    || 500; // default to 500: Internal Error
  const message   = err.message   || "UNKNOWN MSG";
  const clientMsg = err.clientMsg || "Unexpected Condition"; // client msg is sanitized to not reveal internal details
  const logId     = shortid.generate();

  // log problem in our server console
  console.error(`
Encountered Error (GeekU Common Error Handler) ...
  LogId:      ${logId}
  Name:       ${name}
  Status:     ${status}
  Client Msg: ${clientMsg}
  Message:    ${message}
  URL:        ${decodeURIComponent(req.originalUrl)}
  Stack Trace:
   ${err.stack}
`);

  // handle programatic XMLHttpRequest related error responses
  if (req.xhr) {
    res.status(status).send({ 
      error:   clientMsg,
      status:  status,
      name:    name,
      logId:   logId
    });
  }
  // handle all other 
  else {
    res.status(status).send(`${clientMsg} (LogId: ${logId})`);
  }

}
