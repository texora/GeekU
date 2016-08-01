'use strict'

import promoteThunk         from './promoteThunk';
import {AC}                 from '../actions';
import {hashSelCrit}        from '../../../shared/util/selCritUtil'; // ?? not needed when temp code is gone
import {encodeJsonQueryStr} from '../../../shared/util/QueryStrUtil';


/**
 * AC.retrieveStudents(selCrit): an async action creator (thunk) to
 * retrieve students.
 *
 * @param {Obj} selCrit the selection criteria used in defining the
 * students to retrieve.
 */
const [retrieveStudentsThunk, thunkName, log] = promoteThunk('retrieveStudents', (selCrit) => {
  
  return (dispatch, getState) => { // function interpreted by redux-thunk middleware

    // perform async retrieval of students
    log.debug(()=>'initiating async students retrieval using selCrit: ', selCrit);

    // TODO: interpret selCrit ... for now: hard-code it for testing (when NOT supplied)
    if (! selCrit) {
      selCrit = {
        key:    'TEST-KEY', // may need to periodically change the key (in support of save)
        userId: 'common',
        target: 'Students',
        name:   'MO/IN',
        desc:   'from: Missouri/Indiana, ordered by: Graduation/Name',
        fields: [
          
          'gender',     // these are all part of studentEssentials (grouped our display logic forces them to render together)
          'firstName',
          'lastName',
          'studentNum',

          'graduation',
          
          'degree',
          'gpa',
          // 'birthday',
          // 'addr',
          // 'addr.state',
        ],
        sort: [
          "-graduation",
          "firstName",
          "lastName"
        ],
        distinguishMajorSortField: true,
        filter: [
          {field: "gender",     op: "EQ",  value: "F"},
          {field: "addr.state", op: "IN",  value: ["Missouri","Indiana"]},
          {field: "gpa",        op: "GTE", value: "3.65"}
        ],
      };
      selCrit.curHash=hashSelCrit(selCrit);
    }
    const url = '/api/students?' + encodeJsonQueryStr('selCrit', selCrit, log);
    log.debug(()=>`launch retrieval ... encoded URL: '${url}'`);

    geekUFetch(url)
    .then( res => {
      // sync app with results
      const students = res.payload;
      log.debug(()=>`successful retrieval ... ${students.length} students returned`);
      dispatch( AC[thunkName].complete(selCrit, students) ); // mark async operation complete (typically spinner)
    })
    .catch( err => {
      // communicate async operation failed
      // TODO: how do we communicate details of selCrit
      //       ... should this be part of the err, so we don't have to worry about it here
      //       ... however done, it would need to be in detail only (NOT the qual message to user)
      //           ... for example: concatinate it to the err.message (only shows in detail and log)
      dispatch([
        AC[thunkName].fail(selCrit, err),                  // mark async operation FAILED complete (typically spinner)
        handleUnexpectedError(err, 'retrieving students'), // report unexpected condition to user (logging details for tech reference)
      ]);
    });
    
    // mark async operation in-progress (typically spinner)
    dispatch( AC[thunkName].start(selCrit) );

  };
  
});

export default retrieveStudentsThunk;
