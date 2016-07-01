'use strict';

import express        from 'express';
import studentsMeta   from '../../shared/model/studentsMeta';
import * as MongoUtil from '../util/MongoUtil';

const students = express.Router();


//***************************************************************************************************
//*** retrieve a list of students: /api/students[?query-string ... see below]
//***
//***   - by default, all students will be retrieved, in random order, emitting fields defined in
//***     studentsMeta.defaultDisplayFields.
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
//***   - DEPRECATED: use optional "fields" query-string to fine tune fields to emit ?? OBSOLETE
//***     * specify comma delimited list of field names
//***       ... see: studentsMeta.validFields for valid field names
//***     * DEFAULT: studentsMeta.defaultDisplayFields will be emitted
//***
//***   - DEPRECATED: use optional "filter" query-string to supply selection criteria ?? OBSOLETE
//***     * specify a JSON structure conforming to the MongoDB query structure
//***       ... see: https://docs.mongodb.org/manual/tutorial/query-documents/
//***       ... ex:  /api/students?filter={"_id":{"$in":["S-001002","S-001989"]}}
//***                ... returns info from two students (S-001002 AND S-001989)
//***       ... ex:  /api/students?filter={"gender":"M","addr.state": "Missouri"}
//***                ... returns all male students from Missouri
//***                    NOTE: always protect data (like the "&" above) by using UrlEncode()
//***     * DEFAULT: return ALL students
//***
//***   - DEPRECATED: use optional "sort" query-string to define sort order of returned results ?? OBSOLETE
//***     * specify a JSON structure conforming to the MongoDB sort structure
//***       ... see: https://docs.mongodb.com/manual/reference/method/cursor.sort/
//***       ... ex:  /api/students?sort={"lastName":1,"firstName":1,"birthday":-1}
//***
//***************************************************************************************************

students.get('/api/students', (req, res, next) => {

  // define our optional top-level selCrit from the request object
  const selCrit = MongoUtil.selCrit(req, studentsMeta);

  // perform retrieval
  const studentsColl = req.geekU.db.collection('Students');
  studentsColl.find(selCrit.mongoFilter, selCrit.mongoFields)
              .sort(selCrit.mongoSort)
              .toArray()
              .then( students => {
                res.geekU.send(students);
              })
              .catch( err => {
                // NOTE: unsure if we ALWAYS want to cover up technical message
                //       ... it may be due to bad interpretation of mongoFilter
                throw err.defineClientMsg("Issue encountered in DB processing of /api/students");
              });
});



//******************************************************************************
//*** retrieve a student detail (with enrollment): /api/students/:studentNum
//***   - when studentNum is Not Found, a 404 status is returned (Not Found)
//******************************************************************************

students.get('/api/students/:studentNum', (req, res, next) => {

  const studentNum = req.params.studentNum;

  // perform retrieval
  const studentsColl = req.geekU.db.collection('Students');
  studentsColl.aggregate([
    { $match: {_id: studentNum} },
    { $lookup: {
      from:         "Enrollment",
      localField:   "studentNum",
      foreignField: "student.studentNum",
      as:           "enrollment" } },
    { $project: {
      _id: false,
	    "studentNum": true,
	    "gender":     true,
	    "firstName":  true,
	    "lastName":   true,
	    "birthday":   true,
	    "phone":      true,
	    "email":      true,
	    "addr":       true,
	    "gpa":        true,
      'graduation': true,
	    "degree":     true,
      "enrollment.term":   true,
      "enrollment.grade":  true,
      "enrollment.course": true } }
  ])
  .toArray()
  .then( students => {
    if (students.length === 0) {
      res.geekU.sendNotFound();
    }
    else {
      res.geekU.send(students[0]);
    }
  })
  .catch( err => {
    throw err.defineClientMsg("Issue encountered in DB processing of /api/students/:studentNum");
  });

});


export default students;
