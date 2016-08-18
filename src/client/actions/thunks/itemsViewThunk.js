'use strict'

import promoteThunk          from './promoteThunk';
import {AC}                  from '../actions';
import {encodeJsonQueryStr}  from '../../../shared/util/QueryStrUtil';
import SelCrit               from '../../../shared/util/SelCrit';
import itemTypes             from '../../../shared/model/itemTypes';

import handleUnexpectedError from '../../util/handleUnexpectedError';
import assert                from 'assert';


/**
 * AC.itemsView(retrieve, activate): retrieve and/or activate the Items View for the specified itemType.
 *
 * @param {string} itemType the the itemType ... 'student'/'course'
 *
 * @param {SelCrit or string} retrieve the retrieval directive, one of:
 *   - null:      no retrieval at all (DEFAULT)
 *   - selCrit:   conditionally retrieve items when different from ItemsView selCrit (or out-of-date)
 *   - 'refresh': unconditionally refresh ItemsView with latest items (using view's current selCrit)
 *
 * @param {string} activate the activate directive, one of:
 *   - 'activate':    activate/visualize this itemType ItemsView (DEFAULT for all but 'refresh' retrieval)
 *   - 'no-activate': DO NOT activate                            (DEFAULT for 'refresh' retrieval)
 */
const [itemsViewThunk, thunkName, log] = promoteThunk('itemsView', (itemType,
                                                                    retrieve=null,
                                                                    activate=selCrit!=='refresh' ? 'activate' : 'no-activate') => {
  
  return (dispatch, getState) => { // function interpreted by redux-thunk middleware

    const appState = getState();

    log.debug(()=>`Entering AC.itemsView(itemType: ${FMT(itemType)}, retrieve: ${FMT(retrieve)}, activate: ${FMT(activate)})`);

    // validate supplied parameters
    assert(itemTypes[itemType],
           `AC.itemsView() Invalid itemType param: ${FMT(itemType)}`);

    assert(retrieve === null      ||
           retrieve === 'refresh' ||
           SelCrit.isSelCrit(retrieve),
           `AC.itemsView() Invalid retrieve param: ${FMT(retrieve)}`);

    assert(activate === 'activate' ||
           activate === 'no-activate',
           `AC.itemsView() Invalid activate param: ${FMT(activate)}`);

    const itemsLabel = itemTypes.meta[itemType].label.plural;


    // interpret activate directive
    const shouldActivate = activate === 'activate';


    // interpret the retrieval directive
    const selCrit = (retrieve === 'refresh')
                      ? appState.itemsView[itemType].selCrit // refresh current view (can be null if never retrieved)
                      : SelCrit.isFullyEqual(retrieve, appState.itemsView[itemType].selCrit)
                          ? null      // same selCrit as in view (no retrieval needed)
                          : retrieve; // a different selCrit from our view

    // when NO retrieval is necessary, simply activate our view, and we are done
    if (!selCrit) {
      if (shouldActivate) {
        log.debug(()=>'no retrieval necessary, simply activating our view');
        dispatch( AC[thunkName].activate(itemType) );
      }
      else {
        throw new Error(`ERROR: AC.itemsView() parameters define NOTHING to do (i.e. retrieve or activate) ... retrieve: ${FMT(retrieve)}, activate: ${FMT(activate)}`);
      }
      return Promise.resolve(); // supports promise chaining (from dispatch invocation)
    }


    //***
    //*** at this point we know we must retrieve/refresh our items
    //***

    // mark async operation in-progress (typically spinner), and conditionally activate our view
    const actions = [ AC[thunkName].retrieveStart(itemType, selCrit) ];
    if (shouldActivate) {
      actions.push( AC[thunkName].activate(itemType) );
    }
    dispatch(actions);

    // perform async retrieval of items
    log.debug(()=>`initiating ${itemsLabel} retrieval using selCrit: ${FMT(selCrit)}`);

    const url = `/api/${itemTypes.meta[itemType].apiNode}?${encodeJsonQueryStr('selCrit', selCrit, log)}`;
    log.debug(()=>`retrieval encoded URL: '${url}'`);

    return geekUFetch(url) // return this promise supporting chaining of promises within our dispatch
    .then( res => {
      // sync app with results
      const items = res.payload;
      log.debug(()=>`successful retrieval ... ${items.length} ${itemsLabel} returned`);
      dispatch( AC[thunkName].retrieveComplete(itemType, selCrit, items) ); // mark async operation complete (typically spinner)
      return items; // return supports subsequent promise chaining [if any]
    })
    .catch( err => {
      // communicate async operation failed
      dispatch([
        AC[thunkName].retrieveFail(itemType, selCrit, err),     // mark async operation FAILED complete (typically spinner)
        handleUnexpectedError(err, 'retrieving ${itemsLabel}'), // report unexpected condition to user (logging details for tech reference)
      ]);
      return Promise.reject(err); // return supports subsequent promise chaining (insuring subsequent .then() clauses [if any] are NOT invoked) ... same as: throw err
    });

  };
  
});

export default itemsViewThunk;
