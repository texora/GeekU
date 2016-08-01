'use strict'

import promoteThunk from './promoteThunk';
import {AC}         from '../actions';


/**
 * AC.detailStudent(studentNum, editMode): an async action creator
 * (thunk) that activates a dialog revealing the details of a student.
 * A fresh image is retrieved of the student prior to it's display.
 *
 * @param {string} studentNum the student number to detail.
 * @param {boolean} editMode an indicator as to wheter the edit
 * session starts out read (false) or edit (true).
 */
const [detailStudentThunk, thunkName, log] = promoteThunk('detailStudent', (studentNum, editMode) => {
  
  return (dispatch, getState) => { // function interpreted by redux-thunk middleware

    // perform async retrieval of student
    log.debug(()=>`initiating async detail student num: ${studentNum}`);

    geekUFetch(`/api/students/${studentNum}`)
    .then( res => {
      // sync app with results
      const student = res.payload;
      log.debug(()=>'successful retrieval of detailed student: ', student);
      dispatch( AC[thunkName].retrieve.complete(student, editMode) );  // mark async operation complete (typically spinner)
    })
    .catch( err => {
      // communicate async operation failed
      dispatch([
        AC[thunkName].retrieve.fail(studentNum, err),                               // mark async operation FAILED complete (typically spinner)
        handleUnexpectedError(err, `retrieving student detail for: ${studentNum}`), // report unexpected condition to user (logging details for tech reference)
      ]);
    });
    
    // mark async operation in-progress (typically spinner)
    dispatch( AC[thunkName].retrieve.start(studentNum, editMode) );
  };
  
});

export default detailStudentThunk;
