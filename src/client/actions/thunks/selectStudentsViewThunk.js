'use strict'

import promoteThunk          from './promoteThunk';
import {AC}                  from '../actions';
import {encodeJsonQueryStr}  from '../../../shared/util/QueryStrUtil';
import SelCrit               from '../../../shared/util/SelCrit';
import handleUnexpectedError from '../../util/handleUnexpectedError';
import assert                from 'assert';


/**
 * AC.selectStudentsView(selCrit): activate the Students View,
 * optionally retrieving students via selCrit directive.
 *
 * @param {object or string} selCrit the OPTIONAL selection criteria
 * used to reflect in the Students View.
 *  - SelCrit obj: activate the Students View ... conditionally retrieving Students when different selCrit (or out-of-date)
 *  - null:        activate the Students View (in it's current state) ... NO Students retrieval
 *  - 'refresh':   NO activate ... simply refresh Students retrieval (with same selCrit)
 */
const [selectStudentsViewThunk, thunkName, log] = promoteThunk('selectStudentsView', (selCrit) => {
  
  return (dispatch, getState) => { // function interpreted by redux-thunk middleware

    const appState = getState();

    // adjust the supplied selCrit in support of various directives
    log.debug(()=>`analyzing/adjusting supplied selCrit: ${FMT(selCrit)}`);
    const shouldActivate = selCrit !== 'refresh'; // only time we do not activate is on a refresh request
    selCrit = (selCrit === 'refresh')
                ? appState.studentsView.selCrit // refresh current view (can be null if never retrieved)
                : SelCrit.isFullyEqual(selCrit, appState.studentsView.selCrit)
                    ? null     // same selCrit as in view (no retrieval needed)
                    : selCrit; // a different selCrit from our view

    // when NO retrieval is necessary, simply activate our view (conditionally), and we are done
    if (!selCrit) {
      if (shouldActivate) {
        log.debug(()=>'no retrieval necessary, simply activate our view');
        dispatch( AC[thunkName].activate() );
      }
      else {
        log.debug(()=>'no retrieval or activation necessary, no-oping');
      }
      return Promise.resolve(); // supports promise chaining (from dispatch invocation)
    }


    //***
    //*** at this point we know we must retrieve/refresh our students
    //***

    // mark async operation in-progress (typically spinner), and conditionally activate our view
    const actions = [ AC[thunkName].retrieveStart(selCrit) ];
    if (shouldActivate) {
      actions.push( AC[thunkName].activate() );
    }
    dispatch(actions);


    // perform async retrieval of students
    log.debug(()=>`initiating students retrieval using selCrit: ${FMT(selCrit)}`);

    const url = '/api/students?' + encodeJsonQueryStr('selCrit', selCrit, log);
    log.debug(()=>`retrieval encoded URL: '${url}'`);

    return geekUFetch(url) // return this promise supporting chaining of promises within our dispatch
    .then( res => {
      // sync app with results
      const students = res.payload;
      log.debug(()=>`successful retrieval ... ${students.length} students returned`);
      dispatch( AC[thunkName].retrieveComplete(selCrit, students) ); // mark async operation complete (typically spinner)
      return students; // return supports subsequent promise chaining [if any]
    })
    .catch( err => {
      // communicate async operation failed
      dispatch([
        AC[thunkName].retrieveFail(selCrit, err),          // mark async operation FAILED complete (typically spinner)
        handleUnexpectedError(err, 'retrieving students'), // report unexpected condition to user (logging details for tech reference)
      ]);
      return Promise.reject(err); // return supports subsequent promise chaining (insuring subsequent .then() clauses [if any] are NOT invoked) ... same as: throw err
    });

  };
  
});

export default selectStudentsViewThunk;
