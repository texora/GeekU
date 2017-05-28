import {generateActions} from 'action-u';
import assert            from 'assert';

/**
 * @constant {app-node} 'selectItem'
 * @function
 * @description Actions rooted in 'selectItem' (the selected item).
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
   * 
   * @return {Action}
   */
  selectItem: {
                actionMeta: {
                  traits: ['itemType', 'item'],
                },

  } // end of ... selectItem

});
