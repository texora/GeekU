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
      if (!meta.validFields[field]) {
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
  else if (req.query.fields) { // for backward compatability - MAY DEPRECATE ??? OBSOLETE THIS
    selCrit.mongoFields = mongoFields(meta.validFields,
                                      meta.defaultDisplayFields,
                                      req.query.fields);
  }
  else { // fallback default ... pre-defined fields
    selCrit.mongoFields = meta.defaultDisplayFields;
  }


  // ... selCrit.mongoSort
  if (selCrit.sort) {
    selCrit.mongoSort = selCrit.sort;
  }
  else if (req.query.sort) { // for backward compatability - MAY DEPRECATE ??? OBSOLETE THIS
    selCrit.mongoSort = mongoSort(req.query.sort);
  }
  else { // fallback default ... no sort
    selCrit.mongoSort = {};
  }


  // ... selCrit.mongoFilter
  if (selCrit.filter) {
    selCrit.mongoFilter = selCrit.filter;
  }
  else if (req.query.filter) { // for backward compatability - MAY DEPRECATE ??? OBSOLETE THIS
    selCrit.mongoFilter = mongoFilter(req.query.filter);
  }
  else { // fallback default ... select all
    selCrit.mongoFilter = {};
  }

  // that's all folks
  log.debug(()=>`selCrit in effect:\n`, selCrit);
  return selCrit;
}


/**
 * Return a Mongo projection object, from the supplied field definitions.
 *
 * @param {object} validFields the valid fields for the desired
 * collection (an object with field properties).
 * @param {object} defaultFields the default fields to display when NO
 * reqQueryFields is supplied (a mongo projection object)
 * @param {string} reqQueryFields an optional http request query
 * string parameter enumerating a comma delimited set of fields to
 * display (ex: "a,b").
 * 
 * @return {string} the desired Mongo projection object
 */
// ??? OBOLETE THIS ... clean-out all usage (with new selCrit), and TRASH IT
export function mongoFields(validFields, defaultFields, reqQueryFields) {

  // when NO reqQueryFields have been supplied, simply use the supplied default
  if (!reqQueryFields) {
    return defaultFields;
  }

  // build up our projection from reqQueryFields
  const projection = {};
  const fields = reqQueryFields.split(',');
  for (let field of fields) {
    field = field.trim();
    if (!validFields[field]) {
      const msg = `Invalid field ('${field}') specified in request query field parameter: '${reqQueryFields}'`
      throw new Error(msg).defineClientMsg(msg)
                          .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR);
    }
    projection[field] = true;
  }

  // when NO _id has been requested to display, we must explicity turn it off (a mongo heuristic)
  if (!projection._id) {
    projection._id = false;
  }

  // that's all folks
  return projection
}


/**
 * Return a Mongo filter object, defining the selection criteria for a collection.
 *
 * @param {string} reqQueryFilter an optional http request query
 * string parameter containing the json filter object
 * (ex: '{"_id":{"$in":["CS-1110","CS-1112"]}}').
 * 
 * @return {string} the desired Mongo sort object.
 */
// ??? OBOLETE THIS ... clean-out all usage (with new selCrit), and TRASH IT
export function mongoFilter(reqQueryFilter) {

  // default to return all documents in collection
  let mongoFilter = {};

  // when supplied, refine with client-supplied query (a string)
  if (reqQueryFilter) {
    const filter = decodeURIComponent(reqQueryFilter);
    try {
      mongoFilter = JSON.parse(filter);
    }
    catch(e) {
      throw e.defineClientMsg(`Invalid request query filter: '${filter}' ... ${e.message}`)
             .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR);
    }
  }

  // that's all folks
  return mongoFilter;
}


/**
 * Return a Mongo sort object, defining the sort order for a collection.
 *
 * @param {string} reqQuerySort an optional http request query
 * string parameter containing the json sort object
 * (ex: '{"lastName":1,"firstName":1,"birthday":-1}').
 * 
 * @return {string} the desired Mongo sort object.
 */
// ??? OBOLETE THIS ... clean-out all usage (with new selCrit), and TRASH IT
export function mongoSort(reqQuerySort) {

  // default to NO sort fields
  let mongoSort = {};

  // when supplied, refine with client-supplied sort (a string)
  if (reqQuerySort) {
    const sort = decodeURIComponent(reqQuerySort);
    try {
      mongoSort = JSON.parse(sort);
    }
    catch(e) {
      throw e.defineClientMsg(`Invalid request query sort: '${sort}' ... ${e.message}`)
             .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR);
    }
  }

  // that's all folks
  return mongoSort;
}
