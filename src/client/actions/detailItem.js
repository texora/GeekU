import {generateActions} from 'action-u';
import assert            from 'assert';

/**
 * @constant {app-node} 'detailItem'
 * @function
 * @description Actions rooted in 'detailItem' (Item Detailed in visual dialog).
 */
export default generateActions.root({

  /**
   * @function 'detailItem'
   *
   * @description
   * Activate a dialog detailing (and/or editing) the supplied item.
   *
   * An up-to-date item image is retrieved prior to it's display.
   *
   * @intent #byUser, #reducer(spinner only)
   *
   * **Note**: The **Action Type** is promoted through a string
   * coercion of this action creator (it's toString() has been
   * overloaded).
   *
   * @param {string} itemType the itemType ('student'/'course').
   * @param {string} itemNum the item number to detail (studentNum/courseNum).
   * @param {boolean} editMode an indicator as to wheter the dialog
   * starts out in read-only (false) or edit-mode (true).
   * 
   * @return {Action}
   */
  detailItem: {
                  actionMeta: {
                    traits: ['itemType', 'itemNum', 'editMode'],
                  },
    retrieve: {
      complete: { // @intent #byLogic, #reducer
                  actionMeta: {
                    traits: ['itemType', 'item', 'editMode'],
                  },
      },
      fail: {     // @intent #byLogic, #reducer(spinner only)
                  actionMeta: {
                    traits: ['itemType', 'itemNum', 'editMode', 'err'],
                  },
      },
    }, // end of ... retrieve

    change: {
      detailEditMode: { // @intent #byUser, #reducer
                        actionMeta: {
                          traits: ['itemType'],
                        },
      },
    }, // end of ... change

    close: { // @intent #byUser, #reducer
             actionMeta: {
               traits: ['itemType'],
             },
    }, // end of ... close

  } // end of ... detailItem
});
