'use strict';

import express     from 'express';
import coursesMeta from '../../shared/model/coursesMeta';
import {projectMongoFields} from '../util/MongoUtil';

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

courses.get('/api/courses', (req, res) => {
  console.log(`INFO: courses.js processing request: ${decodeURIComponent(req.originalUrl)}`);

  // define the fields to display (a mongo projection) 
  // tweaked from the optional "fields" query string
  // ... ex: /api/courses?fields=a,b,c
  const displayFields = projectMongoFields(coursesMeta.validFields,
                                           coursesMeta.defaultDisplayFields,
                                           req.query.fields);

  // apply any user-supplied filter selection criteria (mongo query object)
  let mongoQuery = {}; // default to return all
  if (req.query.filter) {
    const filter = decodeURIComponent(req.query.filter);
    mongoQuery = JSON.parse(filter); // ??? should handle exceptions gracefully
  }

  // perform retrieval
  const coursesColl = req.db.collection('Courses');
  coursesColl.find(mongoQuery, displayFields)
  .toArray()  // ??? I think we have to try/catch for synchronous errors in the find() because we have NOT got to the promis yet
  .then( courses => {
    res.send(courses);
  })
  .catch( err => {
    console.log('ERROR: ??? problem in /api/courses: ' + err.stack);
    res.status(500).send(err); // ??? from Mark ??? TEST THIS OUT
    // ??? have also seen this (from some git hub folks)
    // ? let error = new Error('msg here');
    // ? error.status = 400;
    // ? next(error);
  });
});

// ??? retrieve course detail (with enrollment)

export default courses;
