'use strict'

import promoteThunk          from './promoteThunk';
import {AC}                  from '../actions';
import handleUnexpectedError from '../../util/handleUnexpectedError';

/**
 * AC.selCrit.delete(selCrit, impactView): an async action creator (thunk)
 * that deletes the supplied selCrit.
 *
 * @param {object} selCrit the selection criteria to delete.
 * @param {string} impactView the itemType of our impacted view if any
 * (null indicates NO view was impacted) ... 'student'/'course'/null
 */
const [selCritDeleteThunk, thunkName, log] = promoteThunk('selCrit.delete', (selCrit, impactView) => {
  
  return (dispatch, getState) => { // function interpreted by redux-thunk middleware

    // perform async delete of selCrit
    log.debug(()=>`initiating async delete of selCrit key: ${selCrit.key}`);

    // mark async operation in-progress (typically spinner)
    dispatch( AC[thunkName].start(selCrit, impactView) );

    return geekUFetch(`/api/selCrit/${selCrit.key}`, { // return this promise supporting chaining of promises within our dispatch
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selCrit)
    })
    .then( res => {
      // sync app with results
      log.debug(()=>`successful delete of selCrit key: ${selCrit.key}`);
      dispatch( AC[thunkName].complete(selCrit, impactView) ); // mark async operation complete (typically spinner)
      return selCrit.key; // return supports subsequent promise chaining [if any]
    })
    .catch( err => {
      // communicate async operation failed
      dispatch([
        AC[thunkName].fail(selCrit, impactView, err),                           // mark async operation FAILED complete (typically spinner)
        handleUnexpectedError(err, `deleting selCrit for key: ${selCrit.key}`), // report unexpected condition to user (logging details for tech reference)
      ]);
      return Promise.reject(err); // return supports subsequent promise chaining (insuring subsequent .then() clauses [if any] are NOT invoked) ... same as: throw err
    });

  };
  
});

export default selCritDeleteThunk;
