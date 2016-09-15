'use strict'

import getActionLog from './getActionLog';


/**
 * Internal utility that machine generates all AT (Action Types), and AC (Action Creators),
 * from the supplied genesis.
 *
 * @param {object} genesis the driving structure for our generation process (see actions.js).
 *
 * @return {object} the newly generated {AT, AC}
 */
export default function generate_AT_AC(genesis) {

  // AT: Action Types container object
  //     EX: AT.userMsg.display = "userMsg.display"
  const AT = {};

  // AC: Action Creators container object
  //     EX: AC.userMsg.display(msg): Action
  const AC = {};

  // machine generate our AT/ACs
  for (const funcName in genesis) {

    const actionType = funcName; // alias ... our funcName is one and the same as our actionType

    // pre-carve out our log filter so as to promote all log filters at startup
    const log = getActionLog(actionType);

    // machine generate our AT entries (Action Types)
    AT[actionType] = new String(actionType); // new String() ... see NOTE above

    // machine generate our AC entries (Action Creator)
    AC[funcName] = function(...args) {

      // further validate/initialize params (when .ratify() function is supplied)
      if (genesis[funcName].ratify) {
        args = genesis[funcName].ratify(...args);
      }

      // validate proper number of params passed in
      const paramNames = genesis[funcName].traits;
      if (paramNames.length !== args.length) {
        // ex: ERROR: Action Creator AC.userMsg.display(msg) expecting 1 parameters, but received 2
        throw new Error(`ERROR: Action Creator AC.${funcName}(${paramNames.toString()}) expecting ${paramNames.length} parameters, but received ${args.length}`);
      }

      // interpret function-based action creators (interpreted by thunk middleware)
      if (genesis[funcName].thunk) {
        const thunk = genesis[funcName].thunk(...args);

        // apply a 'type' property on our thunk, to consistently support any action having a type
        // ... regardless if it is a normal action object, or a function
        thunk.type = funcName;

        return thunk;
      }

      // interpret normal action creator, returning action object
      const action = { type: actionType }; // baseline our action with it's type
      for (let i=0; i<args.length; i++) {  // inject the arguments into our action
        action[paramNames[i]] = args[i];
      }
      return action;
    }

    // inject intermediate federated namespace AC/AT nodes
    // ... ex: allows following equivalent usage:
    //         - AC.userMsg.display('Hello World');
    //           AC['userMsg.display']('Hello World'); // SAME AS PRIOR LINE
    //         - AT.userMsg.display    // ... yeilds type: 'userMsg.display'
    //           AT['userMsg.display'] // ... SAME AS PRIOR LINE
    if (actionType.includes('.')) {
      const nodes = actionType.split('.');
      let   runningStr = '';
      let   runningAT  = {};
      let   runningAC  = {};
      for (const node of nodes) {
        runningStr    += (runningStr ? '.' : '') + node;
        AT[runningStr] = runningAT = runningAT[node] = AT[runningStr] || {};
        AC[runningStr] = runningAC = runningAC[node] = AC[runningStr] || {};
      }
    }

  } // end of LOOP ... machine generate our AT/ACs

  // that's all folks
  return {AT, AC};
}
