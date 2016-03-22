'use strict';

import express from 'express';

const courses = express.Router();

// /api/courses: retrieve courses
courses.get('/api/courses', (req, res) => {
  console.log('INFO: /api/courses request!');

  const coursesColl = req.db.collection('Courses');
  coursesColl.find({}).toArray()  // ??? I think we have to try/catch for synchronous errors in the find() because we have NOT got to the promis yet
    .then( courses => {
      res.send(courses);
    })
    .catch( err => {
      console.log('ERROR: ??? problem in /api/courses: ' + err.stack);
      res.status(500).send(err); // ??? from Mark ??? TEST THIS OUT
    });
});

// ??? more here

export default courses;
