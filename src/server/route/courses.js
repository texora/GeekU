'use strict';

import express        from 'express';
import coursesMeta    from '../../shared/model/coursesMeta';
import * as MongoUtil from '../util/MongoUtil';

const courses = express.Router();


//***************************************************************************************************
//*** retrieve a list of courses: /api/courses[? fields=f1,f2,f3 & filter={mongoQuery}]
//***
//***   - use optional "fields" query string to fine tune fields to emit
//***     * specify comma delimited list of field names
//***       ... see: coursesMeta.validFields for valid field names
//***     * DEFAULT: coursesMeta.defaultDisplayFields will be emitted
//***
//***   - use optional "filter" query string to supply selection criteria
//***     * specify a JSON structure conforming to the MongoDB query structure
//***       ... see: https://docs.mongodb.org/manual/tutorial/query-documents/
//***       ... ex:  /api/courses?filter={"_id":{"$in":["CS-1110","CS-1112"]}}
//***                ... returns info from two courses (CS-1110 and CS-1112)
//***       ... ex:  /api/courses?filter={"subjDesc":"Applied & Engineering Physics"}
//***                ... returns courses from the "Applied & Engineering Physics" field of study
//***                    NOTE: always protect data (like the "&" above) by using UrlEncode()
//***     * DEFAULT: return ALL courses
//***
//***************************************************************************************************

courses.get('/api/courses', (req, res, next) => {
  console.log(`INFO: courses.js processing request: ${decodeURIComponent(req.originalUrl)}`);

  // define our fields to display (a mongo projection) 
  // tweaked from the optional client-supplied "fields" query string
  // ... ex: /api/courses?fields=a,b,c
  const displayFields = MongoUtil.mongoFields(coursesMeta.validFields,
                                              coursesMeta.defaultDisplayFields,
                                              req.query.fields);

  // define our mongo query object
  // tweaked from the optional client-supplied "query" query string
  // ... ex: /api/courses?filter={"_id":{"$in":["CS-1110","CS-1112"]}}
  const mongoQuery = MongoUtil.mongoQuery(req.query.filter);

  // perform retrieval
  const coursesColl = req.db.collection('Courses');
  coursesColl.find(mongoQuery, displayFields)
  .toArray()
  .then( courses => {
    res.send(courses);
  })
  .catch( err => {
    // ... unsure if we ALWAYS want to conver up technical message
    // ... it may be due to bad interpretation of mongoQuery
    throw err.setClientMsg("Issue encountered in DB processing.");
  });
});

// ??? retrieve course detail (with enrollment)

export default courses;
