'use strict';

/**
 * Promotes various MongoDB utilities.
 */

//***
//*** Public API
//***

// return a Mongo projection object, defining the fields to promote.
// PARAMS:
// - validFields:    valid fields for the desired collection
// - defaultFields:  the default fields to display (when NO reqQueryFields is supplied)
// - reqQueryFields: an optional http request query string parameter enumerating the fields to display
//                   ... ex: http://localhost:8080/api/courses?fields=a,b,c
export function projectMongoFields(validFields, defaultFields, reqQueryFields) {

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
      throw Error(`ERROR: projectMongoFields() invalid field ('${field}') specified in req query field parameter: '${reqQueryFields}'`);
    }
    projection[field] = true;
  }

  // when NO _id has been requested to display, we must explicity turn it off (a mongo heuristic)
  if (!projection._id) {
    projection._id = false;
  }

  // that's all
  return projection
}
