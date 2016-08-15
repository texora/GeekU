'use strict';

/**
 * Encode the supplied named jsonObj into a URL encoded query-string parameter.
 *
 * Example:
 * 
 *   GIVEN:
 *     const selCrit = {
 *       "key": "TEST-KEY",
 *       "target": "Students",
 *       "name": "MO/IN",
 *       "desc": "from: Missouri/Indiana, ordered by: Graduation/Name",
 *       "fields": [
 *         "gender",
 *         "firstName",
 *         "lastName",
 *         "studentNum",
 *         "graduation",
 *         "degree",
 *         "gpa"
 *       ],
 *       "sort": [
 *         "-graduation",
 *         "firstName",
 *         "lastName"
 *       ],
 *       "distinguishMajorSortField": true,
 *       "filter": [
 *         {
 *           "field": "gender",
 *           "op": "EQ",
 *           "value": "F"
 *         },
 *         {
 *           "field": "addr.state",
 *           "op": "IN",
 *           "value": [
 *             "Missouri",
 *             "Indiana"
 *           ]
 *         },
 *         {
 *           "field": "gpa",
 *           "op": "GTE",
 *           "value": "3.65"
 *         }
 *       ]
 *     }
 * 
 *   USAGE:
 *     const url = '/api/students?' + encodeJsonQueryStr('selCrit', selCrit, log);
 * 
 *   RESULTS (logical):
 *     '/api/students?selCrit={"key":"TEST-KEY","target":"Students","name":"MO/IN","desc":"from: Missouri/Indiana, ordered by: Graduation/Name","fields":["gender","firstName","lastName","studentNum","graduation","degree","gpa"],"sort":["-graduation","firstName","lastName"],"distinguishMajorSortField":true,"filter":[{"field":"gender","op":"EQ","value":"F"},{"field":"addr.state","op":"IN","value":["Missouri","Indiana"]},{"field":"gpa","op":"GTE","value":"3.65"}]}'
 * 
 *   RESULTS (actual - with URL encoding):
 *     '/api/students?selCrit=%7B%22key%22%3A%22TEST-KEY%22%2C%22target%22%3A%22Students%22%2C%22name%22%3A%22MO%2FIN%22%2C%22desc%22%3A%22from%3A%20Missouri%2FIndiana%2C%20ordered%20by%3A%20Graduation%2FName%22%2C%22fields%22%3A%5B%22gender%22%2C%22firstName%22%2C%22lastName%22%2C%22studentNum%22%2C%22graduation%22%2C%22degree%22%2C%22gpa%22%5D%2C%22sort%22%3A%5B%22-graduation%22%2C%22firstName%22%2C%22lastName%22%5D%2C%22distinguishMajorSortField%22%3Atrue%2C%22filter%22%3A%5B%7B%22field%22%3A%22gender%22%2C%22op%22%3A%22EQ%22%2C%22value%22%3A%22F%22%7D%2C%7B%22field%22%3A%22addr.state%22%2C%22op%22%3A%22IN%22%2C%22value%22%3A%5B%22Missouri%22%2C%22Indiana%22%5D%7D%2C%7B%22field%22%3A%22gpa%22%2C%22op%22%3A%22GTE%22%2C%22value%22%3A%223.65%22%7D%5D%7D'
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
  log.trace(()=>`encoded queryStr: '${queryStr}'`);

  return queryStr;
}


/**
 * Decode a JSON object from the supplied req query-string parameter.
 *
 * Example:
 * 
 *   GIVEN (actual req URL - with URL encoding):
 *     '/api/students?selCrit=%7B%22key%22%3A%22TEST-KEY%22%2C%22target%22%3A%22Students%22%2C%22name%22%3A%22MO%2FIN%22%2C%22desc%22%3A%22from%3A%20Missouri%2FIndiana%2C%20ordered%20by%3A%20Graduation%2FName%22%2C%22fields%22%3A%5B%22gender%22%2C%22firstName%22%2C%22lastName%22%2C%22studentNum%22%2C%22graduation%22%2C%22degree%22%2C%22gpa%22%5D%2C%22sort%22%3A%5B%22-graduation%22%2C%22firstName%22%2C%22lastName%22%5D%2C%22distinguishMajorSortField%22%3Atrue%2C%22filter%22%3A%5B%7B%22field%22%3A%22gender%22%2C%22op%22%3A%22EQ%22%2C%22value%22%3A%22F%22%7D%2C%7B%22field%22%3A%22addr.state%22%2C%22op%22%3A%22IN%22%2C%22value%22%3A%5B%22Missouri%22%2C%22Indiana%22%5D%7D%2C%7B%22field%22%3A%22gpa%22%2C%22op%22%3A%22GTE%22%2C%22value%22%3A%223.65%22%7D%5D%7D'
 *
 *   LOGICAL (req URL - without URL encoding):
 *     '/api/students?selCrit={"key":"TEST-KEY","target":"Students","name":"MO/IN","desc":"from: Missouri/Indiana, ordered by: Graduation/Name","fields":["gender","firstName","lastName","studentNum","graduation","degree","gpa"],"sort":["-graduation","firstName","lastName"],"distinguishMajorSortField":true,"filter":[{"field":"gender","op":"EQ","value":"F"},{"field":"addr.state","op":"IN","value":["Missouri","Indiana"]},{"field":"gpa","op":"GTE","value":"3.65"}]}'
 * 
 *   USAGE:
 *     const selCrit = decodeJsonQueryStr('selCrit', req);
 *
 *   RESULTS:
 *     const selCrit = {
 *       "key": "TEST-KEY",
 *       "target": "Students",
 *       "name": "MO/IN",
 *       "desc": "from: Missouri/Indiana, ordered by: Graduation/Name",
 *       "fields": [
 *         "gender",
 *         "firstName",
 *         "lastName",
 *         "studentNum",
 *         "graduation",
 *         "degree",
 *         "gpa"
 *       ],
 *       "sort": [
 *         "-graduation",
 *         "firstName",
 *         "lastName"
 *       ],
 *       "distinguishMajorSortField": true,
 *       "filter": [
 *         {
 *           "field": "gender",
 *           "op": "EQ",
 *           "value": "F"
 *         },
 *         {
 *           "field": "addr.state",
 *           "op": "IN",
 *           "value": [
 *             "Missouri",
 *             "Indiana"
 *           ]
 *         },
 *         {
 *           "field": "gpa",
 *           "op": "GTE",
 *           "value": "3.65"
 *         }
 *       ]
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
