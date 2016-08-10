'use strict'

import promoteThunk          from './promoteThunk';
import {AC}                  from '../actions';
import {encodeJsonQueryStr}  from '../../../shared/util/QueryStrUtil';
import handleUnexpectedError from '../../util/handleUnexpectedError';
import assert                from 'assert';


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

    assert(selCrit, 'AC.retrieveStudents(selCrit) ... selCrit param NOT supplied');
    
    // mark async operation in-progress (typically spinner)
    dispatch( AC[thunkName].start(selCrit) );

    const url = '/api/students?' + encodeJsonQueryStr('selCrit', selCrit, log);
    log.debug(()=>`launch retrieval ... encoded URL: '${url}'`);

    return geekUFetch(url) // return this promise supporting chaining of promises within our dispatch
    .then( res => {
      // sync app with results
      const students = res.payload;
      log.debug(()=>`successful retrieval ... ${students.length} students returned`);
      dispatch( AC[thunkName].complete(selCrit, students) ); // mark async operation complete (typically spinner)
      return students; // return supports promise chaining
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

  };
  
});

export default retrieveStudentsThunk;
