'use strict';

/**
 * Encode the supplied named jsonObj into a URL encoded query-string parameter.
 *
 * Example:
 * 
 *   GIVEN:
 *     const selCrit = {
 *       sort: {
 *         lastName: 1,
 *         firstName: 1
 *       },
 *       filter: {
 *         "addr.state": {
 *           "$in": [
 *             "Missouri",
 *             "Indiana"
 *           ]
 *         }
 *       }
 *     }
 * 
 *   USAGE:
 *     const url = '/api/students?' + encodeJsonQueryStr('selCrit', selCrit, log);
 * 
 *   RESULTS (logical):
 *     '/api/students?selCrit={"sort":{"lastName":1,"firstName":1},"filter":{"addr.state":{"$in":["Missouri","Indiana"]}}}'
 * 
 *   RESULTS (actual - with URL encoding):
 *     '/api/students?selCrit=%7B%22sort%22%3A%7B%22lastName%22%3A1%2C%22firstName%22%3A1%7D%2C%22filter%22%3A%7B%22addr.state%22%3A%7B%22%24in%22%3A%5B%22Missouri%22%2C%22Indiana%22%5D%7D%7D%7D'
 *
 * @param {string} queryName the name of the query-string parameter.
 *
 * @param {Object} jsonObje the JSON object to encode as the value of the query-string parameter.
 *
 * @param {Log} log the log instance to use in our logging probes.
 *
 * @return {string} the URL encoded query-string parameter.
 */
export function encodeJsonQueryStr(queryName, jsonObj, log) {

  function buildQueryStr(value) {
    return `${queryName}=${value}`;
  }

  const jsonStr  = JSON.stringify(jsonObj);
  let   queryStr = buildQueryStr(jsonStr);
  log.debug(()=>`logical queryStr: '${queryStr}'`);

  const jsonStrEncoded = encodeURIComponent(jsonStr);
  queryStr = buildQueryStr(jsonStrEncoded);
  log.verbose(()=>`encoded queryStr: '${queryStr}'`);

  return queryStr;
}


/**
 * Decode a JSON object from the supplied req query-string parameter.
 *
 * Example:
 * 
 *   GIVEN (actual req URL - with URL encoding):
 *     '/api/students?selCrit=%7B%22sort%22%3A%7B%22lastName%22%3A1%2C%22firstName%22%3A1%7D%2C%22filter%22%3A%7B%22addr.state%22%3A%7B%22%24in%22%3A%5B%22Missouri%22%2C%22Indiana%22%5D%7D%7D%7D'
 *
 *   LOGICAL (req URL - without URL encoding):
 *     '/api/students?selCrit={"sort":{"lastName":1,"firstName":1},"filter":{"addr.state":{"$in":["Missouri","Indiana"]}}}'
 * 
 *   USAGE:
 *     const selCrit = decodeJsonQueryStr('selCrit', req);

 *   RESULTS:
 *     const selCrit = {
 *       sort: {
 *         lastName: 1,
 *         firstName: 1
 *       },
 *       filter: {
 *         "addr.state": {
 *           "$in": [
 *             "Missouri",
 *             "Indiana"
 *           ]
 *         }
 *       }
 *     }
 *
 * @param {string} queryName the name of the query-string parameter.
 *
 * @param {http-req} req the http request object, optionally containing the
 * desired query-str parameter.
 *
 * @return {JsonObj} the desired JSON object (null for none).
 */
export function decodeJsonQueryStr(queryName, req) {

  let queryStr = req.query[queryName];

  // no-op when query-string does not exist
  if (!queryStr) {
    return null;
  }

  queryStr = decodeURIComponent(queryStr);

  try {
    return JSON.parse(queryStr);
  }
  catch(e) {
    throw e.defineClientMsg(`Invalid request query-string ${queryName}: '${queryStr}' ... ${e.message}`)
           .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR);
  }
}
