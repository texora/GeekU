'use strict';

import Log                   from '../../shared/util/Log';
import {decodeJsonQueryStr}  from '../../shared/util/QueryStrUtil';

const log = new Log('GeekU.ProcessFlow');

// ***
// *** Promotes various MongoDB utilities.
// ***


/**
 * Return a fully functional selCrit object, optionally defined from
 * the supplied http req object.
 *
 * The optional req selCrit query-string is interpred as the common
 * "selCrit" JSON object that fine tunes retrieval/sort functionality.
 * This structure is used for ALL DB retrievals.
 * ... see: src/client/state/appState.md for details
 *
 * NOTE: Client's should always protect the data (above) by using the
 *       encodeJsonQueryStr(queryName, jsonObj) utility.
 *       ... src/shared/util/QueryStrUtil.js
 *
 * The returned selCrit object is supplemented with the following mongo objects
 * that can be used right out of the box:
 *  - mongoFields
 *  - mongoSort
 *  - mongoFilter
 *
 * @param {http-req} req the http request object, containing either
 * a top-level selCrit json object, or individual fields/filter/sort
 * properties.
 * 
 * @param {meta-obj} meta a collections meta object defining
 * validFields/defaultDisplayFields.
 *
 * @return {selCrit} selCrit the desired selCrit object.
 */
export function selCrit(req, meta) {

  const selCrit = decodeJsonQueryStr('selCrit', req) || {};

  // resolve our generated mongo fields

  // ... selCrit.mongoFields
  if (selCrit.fields) {

    selCrit.mongoFields = selCrit.fields.reduce( (projection, field) => {
      field = field.trim();
      if (meta.validFields[field] === undefined) {
        const msg = `Invalid field ('${field}') specified in request query-string parameter`
        throw new Error(msg).defineClientMsg(msg)
                            .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR);
      }
      projection[field] = true;
      return projection;
    }, {});

    // when NO _id has been requested to display, we must explicity turn it off (a mongo heuristic)
    if (!selCrit.mongoFields._id) {
      selCrit.mongoFields._id = false;
    }

  }
  else { // fallback default ... pre-defined fields
    selCrit.mongoFields = meta.defaultDisplayFields;
  }


  // ... selCrit.mongoSort
  if (selCrit.sort) {
    selCrit.mongoSort = selCrit.sort;
  }
  else { // fallback default ... no sort
    selCrit.mongoSort = {};
  }


  // ... selCrit.mongoFilter
  if (selCrit.filter) {
    selCrit.mongoFilter = selCrit.filter;
  }
  else { // fallback default ... select all
    selCrit.mongoFilter = {};
  }

  // that's all folks
  log.debug(()=>`selCrit in effect:\n`, selCrit);
  return selCrit;
}
