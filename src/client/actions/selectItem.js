import {generateActions} from 'action-u';
import assert            from 'assert';

/**
 * Actions rooted in 'selectItem' (the Selected Item).
 * @namespace 'selectItem'
 */
export default generateActions.root({

  /**
   * @function 'selectItem'
   *
   * @description
   * Select an item within an itemsView.
   *
   * @intent #byUser, #byLogic, #reducer
   *
   * @param {string} itemType the itemType ('student'/'course').
   *
   * @param {any}    item the item to select (null for de-select)
   */
  selectItem: {
                actionMeta: {
                  traits: ['itemType', 'item'],
                },

  } // end of ... selectItem

});
