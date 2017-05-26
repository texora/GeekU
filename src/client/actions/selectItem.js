import {generateActions} from 'action-u';
import assert            from 'assert';

/**
 * @constant {app-node} 'selectItem'
 * @function
 * @description Actions rooted in 'selectItem' (the Selected Item).
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
   * **Note**: The **Action Type** is promoted through a string
   * coercion of this action creator (it's toString() has been
   * overloaded).
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
