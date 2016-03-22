'use strict';

import express     from 'express';
import coursesMeta from '../../shared/model/coursesMeta';
import {projectMongoFields} from '../util/MongoUtil';

const courses = express.Router();

// retrieve a list of courses ... /api/courses[?fields=a,b,c]
// - use OPTIONAL "fields" query string (with comma delimited list) of fields to display
//   ... see: coursesMeta.validFields for valid field names
//   ... if NOT specified, fields in coursesMeta.defaultDisplayFields will be displayed
courses.get('/api/courses', (req, res) => {
  console.log('INFO: /api/courses request!');

  // define the fields to display (a mongo projection) 
  // from an optional fields paramater (http request query string)
  // ... ex: http://localhost:8080/api/courses?fields=a,b,c
  const displayFields = projectMongoFields(coursesMeta.validFields, coursesMeta.defaultDisplayFields, req.query.fields);

  const coursesColl = req.db.collection('Courses');
  coursesColl.find({}, displayFields)
  .toArray()  // ??? I think we have to try/catch for synchronous errors in the find() because we have NOT got to the promis yet
  .then( courses => {
    res.send(courses);
  })
  .catch( err => {
    console.log('ERROR: ??? problem in /api/courses: ' + err.stack);
    res.status(500).send(err); // ??? from Mark ??? TEST THIS OUT
  });
});

// ??? retrieve course detail (with enrollment)

export default courses;
