'use strict';

import { createLogic } from 'redux-logic';

import commitSelCritChanges            from './commitSelCritChanges';
import commitSelCritChangesBySaving    from './commitSelCritChangesBySaving';
import communicateUnexpectedErrors     from './communicateUnexpectedErrors';
import debounceHoverItem               from './debounceHoverItem';
import initializeSelCritEdit           from './initializeSelCritEdit';
import logActions                      from './logActions';
import processDetailItemAction         from './processDetailItemAction';
import processFiltersRetrieveAction    from './processFiltersRetrieveAction';
import processItemsViewAction          from './processItemsViewAction';
import processItemsViewRetrieveAction  from './processItemsViewRetrieveAction';
import processSelCritDeleteAction      from './processSelCritDeleteAction';
import processSelCritSaveAction        from './processSelCritSaveAction';
import syncViewOnSelCritChanges        from './syncViewOnSelCritChanges';
import validateSelCritChanges          from './validateSelCritChanges';

//***
//*** accumulation of all app logic
//***

export default [
  // handle dispatch-based unexpected errors ...
  communicateUnexpectedErrors,

  // log all dispatched actions ...
  logActions,

  // retrieve filters (a list of selCrit objects) ...
  processFiltersRetrieveAction,

  // itemsView related ...
  processItemsViewAction,
  processItemsViewRetrieveAction,
  syncViewOnSelCritChanges,
  debounceHoverItem,

  // detailItem related ...
  processDetailItemAction,

  // edit selCrit related ...
  initializeSelCritEdit,
  validateSelCritChanges,
  commitSelCritChanges,
  commitSelCritChangesBySaving,

  // save selCrit ...
  processSelCritSaveAction,

  // delete selCrit ...
  processSelCritDeleteAction,

];
