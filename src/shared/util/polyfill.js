'use strict';

// inject ALL ES6 polyfills
// ... required by 
//     - all browsers that may be missing various ES6 features
//     - PhantomJS which currently is missing Symbol def (used in our client-side test modules) 
// ... adds about 15KB to our bundle [minified/gzipped]
// ... see: https://github.com/zloirock/core-js
import 'core-js/es6';

// MY Error polyfill extension
import './ErrorExtensionPolyfill';

// fetch polyfill ... serves BOTH browser and node
import 'isomorphic-fetch';

// geekUFetch: a better fetch interpreting the specifics of GeekU Service API
//  - is isomorphic (works BOTH in browser/node)
//  - interprets the specific structure of the GeekU app
//    ... returning the resp injected with our jsonized payload (resp.payload)
//  - interprets errors with app-specific content
//    ... By default fetch only throws errors (i.e. the catch() promise clause)
//        in catastrophic cases (setup request, or network error, etc.).
//    ... So if the service request completes, the then(resp) clause is invoked!
//    ... We interpret this and throw appropriate errors filled with app specific details!

const root = typeof(window) === 'undefined' ? global : window;

if (!root.geekUFetch) {
  root.geekUFetch = function(...args) {
    return fetch(...args)

      .then( resp => { // all completed service responses are processed here ... no distinction http status outside the range of 2xx
        return Promise.all([resp, resp.json()]); // jsonize our payload ??? FRINGE: when no json supplied (ex: /route1 returning html) weget a generic Error: SyntaxError: Unexpected token < ??? unsure how to catch this exception only and munge in "invalid json in reposnse)
      })

      .then( ([resp, jsonPayload]) => {

        // interpret error conditions, by throwing an error with app-specific content
        if (!resp.ok || jsonPayload.error) {
          const serverError = jsonPayload.error || { message: 'Unknown' };
          let   errMsg      = `${serverError.message} ... Status: ${resp.status} '${resp.statusText}'`;
          if (serverError.logId) {
            errMsg += ` ... ServerLogId: ${serverError.logId}`;
          }
          const err = new Error(errMsg);
          err.status     = resp.status;
          err.statusText = resp.statusText;
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
}
