'use strict';

/**
 * A GeekU-specific fetch (interpreting the specifics of GeekU
 * Service API).  
 * 
 * Features:
 *   - is isomorphic (works BOTH in browser/node)
 *   - interprets the specific structure of the GeekU app
 *     ... returning the resp injected with our jsonized payload (resp.payload)
 *   - interprets errors with app-specific content
 *     ... By default fetch only throws errors (i.e. the catch() promise clause)
 *         in catastrophic cases (setup request, or network error, etc.).
 *     ... So if the service request completes, the then(resp) clause is invoked!
 *     ... We interpret this and throw appropriate errors filled with app specific details!
 * 
 * @param {any} args all the normal fetch parameters.
 * 
 * @return {Promise} the fetch promise
 */

export default function geekUFetch(...args) {
  return fetch(...args)

    .then( resp => { // all completed service responses are processed here ... no distinction http status outside the range of 2xx
      return Promise.all([resp, resp.json()]); // jsonize our payload ??? FRINGE: when no json supplied (ex: /route1 returning html) we get a generic Error: SyntaxError: Unexpected token < ??? unsure how to catch this exception only and munge in "invalid json in reposnse)
    })

    .then( ([resp, jsonPayload]) => {

      // interpret error conditions, by throwing an error with app-specific content
      if (!resp.ok || jsonPayload.error) {
        const serverError = jsonPayload.error || { message: 'Unknown' };
        let   errMsg      = `${serverError.message} ... Status: ${resp.status} '${resp.statusText}'`;
        if (serverError.logId) {
          errMsg += ` ... ServerLogId: ${serverError.logId}`;
        }
        const err = new Error(errMsg).defineHttpStatus(resp.status);
        if (serverError.cause) {
          err.cause = serverError.cause;
        }
        if (serverError.url) {
          err.url = serverError.url;
        }
        if (serverError.name) {
          err.name = serverError.name;
        }
        throw err;
      }

      // for non-error conditions, simply promote our resp (injected with our jsonized payload)
      resp.payload = jsonPayload.payload;
      return resp;
    });
};
