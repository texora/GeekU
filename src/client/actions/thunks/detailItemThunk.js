'use strict'

import promoteThunk          from './promoteThunk';
import {AC}                  from '../actions';
import handleUnexpectedError from '../../util/handleUnexpectedError';
import itemTypes             from '../../../shared/model/itemTypes';


/**
 * AC.detailItem(itemType, itemNum, editMode): an async action creator
 * (thunk) that activates a dialog detailing the supplied item.
 * A fresh image is retrieved of the item prior to it's display.
 *
 * @param {string} itemType the itemType ('student'/'course').
 * @param {string} itemNum the item number to detail (studentNum/courseNum).
 * @param {boolean} editMode an indicator as to wheter the dialog
 * starts out in read-only (false) or edit-mode (true).
 */
const [detailItemThunk, thunkName, log] = promoteThunk('detailItem', (itemType, itemNum, editMode) => {
  
  return (dispatch, getState) => { // function interpreted by redux-thunk middleware

    // perform async retrieval of item
    log.debug(()=>`initiating async detail itemNum: ${itemNum}`);
    
    // mark async operation in-progress (typically spinner)
    dispatch( AC[thunkName].retrieveStart(itemType, itemNum, editMode) );

    return geekUFetch(`/api/${itemTypes.meta[itemType].apiNode}/${itemNum}`) // return this promise supporting chaining of promises within our dispatch
    .then( res => {
      // sync app with results
      const item = res.payload;
      log.debug(()=>`successful retrieval of detailed item: ${FMT(item)}`);
      dispatch( AC[thunkName].retrieveComplete(itemType, item, editMode) );  // mark async operation complete (typically spinner)
      return item; // return supports subsequent promise chaining [if any]
    })
    .catch( err => {
      // communicate async operation failed
      dispatch([
        AC[thunkName].retrieveFail(itemType, itemNum, editMode, err),              // mark async operation FAILED complete (typically spinner)
        handleUnexpectedError(err, `retrieving item detail for: ${FMT(itemNum)}`), // report unexpected condition to user (logging details for tech reference)
      ]);
      return Promise.reject(err); // return supports subsequent promise chaining (insuring subsequent .then() clauses [if any] are NOT invoked) ... same as: throw err
    });
  };
  
});

export default detailItemThunk;
