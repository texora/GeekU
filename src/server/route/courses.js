'use strict';

import express        from 'express';
import coursesMeta    from '../../shared/model/coursesMeta';
import * as MongoUtil from '../util/MongoUtil';

const courses = express.Router();


//***************************************************************************************************
//*** retrieve a list of courses: /api/courses[?query-string ... see below]
//***
//***   - use optional "fields" query-string to fine tune fields to emit
//***     * specify comma delimited list of field names
//***       ... see: coursesMeta.validFields for valid field names
//***     * DEFAULT: coursesMeta.defaultDisplayFields will be emitted
//***
//***   - use optional "filter" query-string to supply selection criteria
//***     * specify a JSON structure conforming to the MongoDB query structure
//***       ... see: https://docs.mongodb.org/manual/tutorial/query-documents/
//***       ... ex:  /api/courses?filter={"_id":{"$in":["CS-1110","CS-1112"]}}
//***                ... returns info from two courses (CS-1110 and CS-1112)
//***       ... ex:  /api/courses?filter={"subjDesc":"Applied & Engineering Physics"}
//***                ... returns courses from the "Applied & Engineering Physics" field of study
//***                    NOTE: always protect data (like the "&" above) by using UrlEncode()
//***     * DEFAULT: return ALL courses
//***
//***   - use optional "sort" query-string to define sort order of returned results
//***     * specify a JSON structure conforming to the MongoDB sort structure
//***       ... see: https://docs.mongodb.com/manual/reference/method/cursor.sort/
//***       ... ex:  /api/courses?sort={"academicGroup":1,"courseNum":1}
//***
//***************************************************************************************************

courses.get('/api/courses', (req, res, next) => {

  // define our fields to display (a mongo projection) 
  // tweaked from the optional client-supplied "fields" query-string
  // ... ex: /api/courses?fields=a,b,c
  const displayFields = MongoUtil.mongoFields(coursesMeta.validFields,
                                              coursesMeta.defaultDisplayFields,
                                              req.query.fields);

  // define our mongo filter object
  // tweaked from the optional client-supplied "filter" query-string
  // ... ex: /api/courses?filter={"_id":{"$in":["CS-1110","CS-1112"]}}
  const mongoFilter = MongoUtil.mongoFilter(req.query.filter);

  // define our mongo sort object
  // tweaked from the optional client-supplied "sort" query-string
  // ... ex: /api/courses?sort={"academicGroup":1,"courseNum":1}
  const mongoSort = MongoUtil.mongoSort(req.query.sort);

  // perform retrieval
  const coursesColl = req.geekU.db.collection('Courses');
  coursesColl.find(mongoFilter, displayFields)
             .sort(mongoSort)  .toArray()
             .then( courses => {
               res.geekU.send(courses);
             })
             .catch( err => {
               // NOTE: unsure if we ALWAYS want to cover up technical message
               //       ... it may be due to bad interpretation of mongoFilter
               throw err.defineClientMsg("Issue encountered in DB processing of /api/courses");
             });
});



//******************************************************************************
//*** retrieve a course detail (with enrollment): /api/courses/:courseNum
//***   - when courseNum is Not Found, a 404 status is returned (Not Found)
//******************************************************************************

courses.get('/api/courses/:courseNum', (req, res, next) => {

  const courseNum = req.params.courseNum;

  // perform retrieval
  const coursesColl = req.geekU.db.collection('Courses');
  coursesColl.aggregate([
    { $match: {_id: courseNum} },
    { $lookup: {
        from:         "Enrollment",
        localField:   "courseNum",
        foreignField: "course.courseNum",
        as:           "enrollment" } },
    { $project: {
      _id: false,
      "courseNum":     true,
      "courseTitle":   true,
      "courseDesc":    true,
      "academicGroup": true,
      "subjDesc":      true,
      "enrollment.term":    true,
      "enrollment.grade":   true,
      "enrollment.student": true } }
  ])
  .toArray()
  .then( courses => {
    if (courses.length === 0) {
      res.geekU.sendNotFound();
    }
    else {
      res.geekU.send(courses[0]);
    }
  })
  .catch( err => {
    throw err.defineClientMsg("Issue encountered in DB processing of /api/courses/:courseNum");
  });

});


export default courses;
