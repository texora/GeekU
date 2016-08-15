'use strict'

import promoteThunk          from './promoteThunk';
import {AC}                  from '../actions';
import {encodeJsonQueryStr}  from '../../../shared/util/QueryStrUtil';
import SelCrit               from '../../../shared/util/SelCrit';
import handleUnexpectedError from '../../util/handleUnexpectedError';
import assert                from 'assert';


/**
 * AC.selectStudentsView(retrieve, activate): retrieve and/or activate the Students View.
 *
 * @param {SelCrit or string} retrieve the retrieval directive, one of:
 *   - null:      no retrieval at all (DEFAULT)
 *   - selCrit:   conditionally retrieve Students when different from StudentsView selCrit (or out-of-date)
 *   - 'refresh': unconditionally refresh StudentsView with latest Students (using view's current selCrit)
 *
 * @param {string} activate the activate directive, one of:
 *   - 'activate':    activate/visualize StudentsView (DEFAULT for all but 'refresh' retrieval)
 *   - 'no-activate': DO NOT activate                 (DEFAULT for 'refresh' retrieval)
 */
const [selectStudentsViewThunk, thunkName, log] = promoteThunk('selectStudentsView', (retrieve=null,
                                                                                      activate=selCrit!=='refresh' ? 'activate' : 'no-activate') => {
  
  return (dispatch, getState) => { // function interpreted by redux-thunk middleware

    const appState = getState();

    log.debug(()=>`Entering AC.selectStudentsView(retrieve: ${FMT(retrieve)}, activate: ${FMT(activate)})`);

    // validate supplied parameters
    assert(retrieve === null      ||
           retrieve === 'refresh' ||
           retrieve.target,
           `AC.selectStudentsView() Invalid retrieve param: ${FMT(retrieve)}`);

    assert(activate === 'activate' ||
           activate === 'no-activate',
           `AC.selectStudentsView() Invalid activate param: ${FMT(activate)}`);


    // interpret activate directive
    const shouldActivate = activate === 'activate';


    // interpret the retrieval directive
    const selCrit = (retrieve === 'refresh')
                      ? appState.studentsView.selCrit // refresh current view (can be null if never retrieved)
                      : SelCrit.isFullyEqual(retrieve, appState.studentsView.selCrit)
                          ? null      // same selCrit as in view (no retrieval needed)
                          : retrieve; // a different selCrit from our view

    // when NO retrieval is necessary, simply activate our view, and we are done
    if (!selCrit) {
      if (shouldActivate) {
        log.debug(()=>'no retrieval necessary, simply activating our view');
        dispatch( AC[thunkName].activate() );
      }
      else {
        throw new Error(`ERROR: AC.selectStudentsView() parameters define NOTHING to do (i.e. retrieve or activate) ... retrieve: ${FMT(retrieve)}, activate: ${FMT(activate)}`);
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
