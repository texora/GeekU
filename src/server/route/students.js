'use strict';

import express        from 'express';
import studentsMeta   from '../../shared/model/studentsMeta';
import * as MongoUtil from '../util/MongoUtil';

const students = express.Router();


//***************************************************************************************************
//*** retrieve a list of students: /api/students[?query-string ... see below]
//***
//***   - use optional "fields" query-string to fine tune fields to emit
//***     * specify comma delimited list of field names
//***       ... see: studentsMeta.validFields for valid field names
//***     * DEFAULT: studentsMeta.defaultDisplayFields will be emitted
//***
//***   - use optional "filter" query-string to supply selection criteria
//***     * specify a JSON structure conforming to the MongoDB query structure
//***       ... see: https://docs.mongodb.org/manual/tutorial/query-documents/
//***       ... ex:  /api/students?filter={"_id":{"$in":["S-001002","S-001989"]}}
//***                ... returns info from two students (S-001002 AND S-001989)
//***       ... ex:  /api/students?filter={"gender":"M","addr.state": "Missouri"}
//***                ... returns all male students from Missouri
//***                    NOTE: always protect data (like the "&" above) by using UrlEncode()
//***     * DEFAULT: return ALL students
//***
//***   - use optional "sort" query-string to define sort order of returned results
//***     * specify a JSON structure conforming to the MongoDB sort structure
//***       ... see: https://docs.mongodb.com/manual/reference/method/cursor.sort/
//***       ... ex:  /api/students?sort={"lastName":1,"firstName":1,"birthday":-1}
//***
//***************************************************************************************************

students.get('/api/students', (req, res, next) => {

  // define our fields to display (a mongo projection) 
  // tweaked from the optional client-supplied "fields" query-string
  // ... ex: /api/students?fields=a,b,c
  const displayFields = MongoUtil.mongoFields(studentsMeta.validFields,
                                              studentsMeta.defaultDisplayFields,
                                              req.query.fields);

  // define our mongo filter object
  // tweaked from the optional client-supplied "filter" query-string
  // ... ex: /api/students?filter={"_id":{"$in":["CS-1110","CS-1112"]}}
  const mongoFilter = MongoUtil.mongoFilter(req.query.filter);

  // define our mongo sort object
  // tweaked from the optional client-supplied "sort" query-string
  // ... ex: /api/students?sort={"lastName":1,"firstName":1,"birthday":-1}
  const mongoSort = MongoUtil.mongoSort(req.query.sort);

  // perform retrieval
  const studentsColl = req.geekU.db.collection('Students');
  studentsColl.find(mongoFilter, displayFields)
              .sort(mongoSort)
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
