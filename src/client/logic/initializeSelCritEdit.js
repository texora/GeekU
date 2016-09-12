'use strict';

import promoteLogic      from './util/promoteLogic';
import getActionLogicLog from './util/getActionLogicLog';

import SelCrit           from '../../shared/domain/SelCrit';
import itemTypes         from '../../shared/domain/itemTypes';


/**
 * Initialize process that edits supplied selCrit:
 *   - interpreting when to create new SelCrit
 *   - injecting additional information needed in action
 */
const [logicName, logic] = promoteLogic('initializeSelCritEdit', {

  type: 'selCrit.edit',

  transform({ getState, action }, next) {

    const log = getActionLogicLog(action, logicName);

    let selCrit = action.selCrit;

    // interpret itemType string as new SelCrit
    // ... injecting into action's real selCrit (new) and maintaining selCritIsNew indicator
    if (typeof selCrit === 'string') {
      log.debug(()=> `injecting new SelCrit of type: ${FMT(selCrit)}`);
      action.selCrit = selCrit = SelCrit.new(selCrit);
      action.selCritIsNew = true;
    }
    else {
      action.selCritIsNew = false;
    }

    log.debug(()=> 'injecting additional information needed in action');

    // inject the DB meta definition we are working for
    const meta = action.meta = itemTypes.meta[selCrit.itemType];

    // inject the total set of fieldOptions promoted to the user
    // ... derived from meta.validFields
    const fieldOptions = action.fieldOptions = [];
    for (const fieldName in meta.validFields) {
      const fieldLabel = meta.validFields[fieldName];
      if (fieldLabel) { // missing field label is a control indication to NOT promote field to user
        fieldOptions.push( { value: fieldName, label: fieldLabel } );
      }
    }

    // inject the total set of sortOptions promoted to the user
    // ... derived from meta.validFields
    const sortOptions = action.sortOptions = [];
    for (const fieldName in meta.validFields) {
      const fieldLabel = meta.validFields[fieldName];
      if (fieldLabel) { // missing field label is a control indication to NOT promote field to user
        sortOptions.push( { value: fieldName, label: fieldLabel, ascDec: 1 } );
      }
    }

    // pass on action with newly injected properties
    next(action);
  },

});

export default logic;
