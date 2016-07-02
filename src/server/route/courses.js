'use strict';

import express        from 'express';
import coursesMeta    from '../../shared/model/coursesMeta';
import * as MongoUtil from '../util/MongoUtil';

const courses = express.Router();

//***************************************************************************************************
//*** retrieve a list of courses: /api/courses[?query-string ... see below]
//***
//***   - by default, all courses will be retrieved, in random order, emitting fields defined in
//***     coursesMeta.defaultDisplayFields.
//***
//***   - use optional "selCrit" query-string to fine tune retrieval/sort functionality.
//***
//***     This is a common structure for ALL DB retrievals
//***      ... see: src/client/state/appState.md for details
//***
//***     NOTE: Client's should always protect the data (above) by using the
//***           encodeJsonQueryStr(queryName, jsonObj) utility.
//***           ... src/shared/util/QueryStrUtil.js
//***
//***************************************************************************************************

courses.get('/api/courses', (req, res, next) => {

  // define our optional top-level selCrit from the request object
  const selCrit = MongoUtil.selCrit(req, coursesMeta);

  // force courseNum to always be emitted
  if (!selCrit.mongoFields.courseNum) {
    selCrit.mongoFields.courseNum = true;
  }

  // perform retrieval
  const coursesColl = req.geekU.db.collection('Courses');
  coursesColl.find(selCrit.mongoFilter, selCrit.mongoFields)
             .sort(selCrit.mongoSort)
             .toArray()
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
