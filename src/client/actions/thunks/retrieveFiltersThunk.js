'use strict'

import promoteThunk          from './promoteThunk';
import {AC}                  from '../actions';
import handleUnexpectedError from '../../util/handleUnexpectedError';


/**
 * AC.retrieveFilters(): an async action creator (thunk) to
 * retrieve our filters (our selCrit list).
 */
const [retrieveFiltersThunk, thunkName, log] = promoteThunk('retrieveFilters', () => {
  
  return (dispatch, getState) => { // function interpreted by redux-thunk middleware

    // perform async retrieval of filters
    log.debug(()=>'initiating async filters retrieval');
    
    // mark async operation in-progress (typically spinner)
    dispatch( AC[thunkName].start() );

    const url = '/api/selCrit';
    log.debug(()=>`launch retrieval ... encoded URL: '${url}'`);

    return geekUFetch(url) // return this promise supporting chaining of promises within our dispatch
    .then( res => {
      // sync app with results
      const filters = res.payload;
      log.debug(()=>`successful retrieval ... ${filters.length} filters returned`);
      dispatch( AC[thunkName].complete(filters) ); // mark async operation complete (typically spinner)
      return filters; // return supports subsequent promise chaining [if any]
    })
    .catch( err => {
      // communicate async operation failed
      dispatch([
        AC[thunkName].fail(err),                         // mark async operation FAILED complete (typically spinner)
        handleUnexpectedError(err, 'retrieving filters'), // report unexpected condition to user (logging details for tech reference)
      ]);
      return Promise.reject(err); // return supports subsequent promise chaining (insuring subsequent .then() clauses [if any] are NOT invoked) ... same as: throw err
    });

  };
  
});

export default retrieveFiltersThunk;
