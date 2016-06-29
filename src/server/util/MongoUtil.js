'use strict';

// ***
// *** Promotes various MongoDB utilities.
// ***

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
 * Return a Mongo query object, defining the selection criteria for a collection.
 *
 * @param {string} reqQueryFilter an optional http request query
 * string parameter containing the json query object
 * (ex: '{"_id":{"$in":["CS-1110","CS-1112"]}}').
 * 
 * @return {string} the desired Mongo sort object.
 */
export function mongoQuery(reqQueryFilter) {

  // default to return all documents in collection
  let mongoQuery = {};

  // when supplied, refine with client-supplied query (a string)
  if (reqQueryFilter) {
    const filter = decodeURIComponent(reqQueryFilter);
    try {
      mongoQuery = JSON.parse(filter);
    }
    catch(e) {
      throw e.defineClientMsg(`Invalid request query filter: '${filter}' ... ${e.message}`)
             .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR);
    }
  }

  // that's all folks
  return mongoQuery;
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
