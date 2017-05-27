import {generateActions} from 'action-u';
import assert            from 'assert';

export default generateActions.root({

  /**
   * @constant {app-node} 'userMsg'
   * @function
   * @description Actions rooted in 'userMsg' (user notifications).
   */
  userMsg: {

    /**
     * @function 'userMsg.display'
     *
     * @description
     * Display a user message via Material UI Snackbar.
     *
     * NOTE: An alternate technique to activate a user message is through
     *       the static UserMsg.display(msg [, userAction]) method.  This
     *       may be preferred when you have no access to the dispatcher.
     *
     * @intent #byUser, #byLogic, #reducer
     *
     * **Note**: The **Action Type** is promoted through a string
     * coercion of this action creator (it's toString() has been
     * overloaded).
     *
     * @param {string} msg the message to display.
     *
     * @param {Obj} userAction an optional structure defining a user click action:
     *                {
     *                  txt:      'your-button-label-here',
     *                  callback: function(event) {
     *                    code-executed-on-button-click
     *                  }
     *                }
     * 
     * @return {Action}
     */
    display: {
               actionMeta: {
                 traits: ['msg', 'userAction'],
                 ratify(msg, userAction) {
                   const errPrefix = () => {
                     const userActionStr = userAction ? `, ${JSON.stringify(userAction)}` : '';
                     return `ERROR: actions.userMsg.display('${msg}'${userActionStr}) ...`;
                   };
                   assert(typeof msg === 'string', `${errPrefix()} requires a msg string param`);
                   if (userAction) {
                     assert(typeof userAction.txt      === 'string',   `${errPrefix()} userAction param requires a .txt string property`);
                     assert(typeof userAction.callback === 'function', `${errPrefix()} userAction param requires a .callback function property`);
                   }
                   return [msg, userAction];
                 }
               }
    },

    /**
     * @function 'userMsg.close'
     *
     * @description
     * Close the user message dialog.
     *
     * @intent #byLogic, #reducer
     *
     * **Note**: The **Action Type** is promoted through a string
     * coercion of this action creator (it's toString() has been
     * overloaded).
     * 
     * @return {Action}
     */
    close: {
             actionMeta: {}
    }
  }
});
