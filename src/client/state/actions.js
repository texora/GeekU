'use strict'

import Log from '../../shared/util/Log';

const log = new Log('actions'); // ?? currently NOT used

const thunks = _defineThunks();

/**
 * Promote all actions used in our app ... both:
 *
 *   - AC: Action Creators
 *         A series of public functions that create actions.
 *         EX Usage:  AC.saleComplete(receiptId, receiptItems): Action     ?? update example to GeekU
 *         EX Action: { type: "saleComplete", receiptId, receiptItems }    ?? update example to GeekU
 *
 *   - AT: Action Types
 *         A series of Strings, representing our Action Types
 *         (used internally by our reducers [injected into each action]).
 *         EX: AT.saleComplete = "saleComplete"                            ?? update example to GeekU
 *
 * PUBLIC NOTE: 
 *   To determine what Action Creators are availble, simply interpret
 *   the genesis structure (below) as follows:
 *     - The genesis key is the function name
 *     - The genesis value.params array represents the expected function parameters
 *   EXAMPLE: AC.saleComplete(receiptId, receiptItems): Action             ?? update example to GeekU
 *
 *
 * INTERNAL NOTE: 
 *   This technique of creating AC/ATs has the following benefits:
 *   
 *    - The Action Creators (AC) 
 *      * Concisely defines all the actions you can perform within the app
 *      * Promotes and validates the exact set of expected parameters
 *        ... at least the number of parameters
 *        ... the parameter types are not validated, but the name gives a hint of expectations
 *        ... here is an example error that is thrown if number of params are incorrect:
 *            ERROR: Action Creator AC.saleComplete(receiptId,receiptItems) expecting 2 parameters, but received 3   ?? update example to GeekU
 *      * Correctly constructs the action every time
 *   
 *    - The Action Types (AT):
 *      * Are consisely defined from the same definition
 *   
 *    - Minimal development effort in maintaining the AC/ATs
 */

const genesis = {

  retrieveStudents:         { params: ['selCrit'],                 thunk: thunks.retrieveStudents },
  retrieveStudentsStart:    { params: ['selCrit'] },
  retrieveStudentsComplete: { params: ['selCrit', 'arr'] },
  retrieveStudentsFail:     { params: ['selCrit', 'err'] },

  // ?? ReduxEvaluation ENTRIES ... eventually delete
  // ? buyItem:               ["item"],
  // ? catalogItemsDefined:   ["items"],
  // ? checkout:              ["total"],
  // ? closeCart:             [],
  // ? closeCheckout:         [],
  // ? closeReceipt:          [],
  // ? filterCatalogCategory: ["category"],
  // ? openCart:              [],
  // ? removeCartItem:        ["cartItem"],
  // ? saleComplete:          ["receiptId", "receiptItems"],
  // ? setCartItemQty:        ["cartItem", "qty"],
  // ? setCheckoutField:      ["name", "value"],
  // ? toggleItemDetail:      ["item"],
};

// AT: Action Types container object
//     EX: AT.saleComplete = "saleComplete"   ?? update example to GeekU
export const AT = {};

// AC: Action Creators container object
//     EX: AC.saleComplete(receiptId, receiptItems): Action  ?? update example to GeekU
export const AC = {};

// machine generate our AT/ACs
for (let funcName in genesis) {

  const actionType = funcName; // alias ... our funcName is one and the same as our actionType

  // machine generate our AT entries (Action Types)
  AT[actionType] = actionType;

  // machine generate our AC entries (Action Creator)
  AC[funcName] = function(...args) {

    // validate proper number of params passed in
    const paramNames = genesis[funcName].params;
    if (paramNames.length !== args.length) {
      // ex: ERROR: Action Creator AC.saleComplete(receiptId,receiptItems) expecting  parameters, but received 3  ?? update example to GeekU
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

}


// ***
// *** Async Action Function Definitions (i.e. Thunks)
// ***

// An internal utility that 'hoists' all our thunk definitions to the start of our module
//    NOTE: We need more than simple functions (which auto hoist)
//          because of the scoping technique (used below)
//    NOTE: Each thunk function is encapsolated in it's own scope (using bracket notation) which: 
//            a) minimizes the repeated usage of the function name, and
//            b) auto-binds the appropriate named log instance.
function _defineThunks() {

  const thunks = {}; // all our promoted thunks


  // internal utility to promote the supplied thunk, and define it's logging filter
  function _promoteThunk(thunkName, thunkFunct) {

    // promote our thunk function
    thunks[thunkName] = thunkFunct;

    // pre-carve out our log filter so as to promote all log filters at startup
    const log = new Log(`actions.${thunkName}`); 

    // promote BOTH thunkName and log
    return { thunkName, log };
  }
  

  // TODO: Consider making all/most of these async methods a generic run-time utility.
  //       Wait till more functionality is fleshed out (with more methods)
  //       For the most part it is boilerplate, except:
  //         - the interpretation of the selCrit
  //           ... could be done in outer funct and pass in as url, post payload, etc.




  /**
   * retrieveStudents(selCrit): an async action creator to retrievie students.
   *
   * @param {Obj} selCrit the selection criteria used in defining the students to retrieve.
   */
  {
    const {thunkName, log} = _promoteThunk('retrieveStudents', function(selCrit) {
  
      return (dispatch, getState) => { // function interpreted by redux-thunk middleware

        // ??? is this covered in our dispatch logging middleware?
        log.info(()=>'??? initiating retrieval using selCrit: ', selCrit); // ?? debug
  
        // notify app that an async operation is beginning
        dispatch( AC[`${thunkName}Start`](selCrit) );
  
        // async retrieval of students
        geekUFetch('/api/students') // TODO: interpret selCrit ... for now: all Students (return default fields)
          .then( res => {
            const students = res.payload;
            // ??? is this covered in our dispatch logging middleware?
            log.info (()=>`??? successful retrieval ... ${students.length} students returned`);
            log.debug(()=>'??? students: ', students);
        
            // notify app that an async operation is complete
            dispatch( AC[`${thunkName}Complete`](selCrit, students));
          })
          .catch( err => {
            // ??? is this covered in our dispatch logging middleware?
            log.error(()=>'??? err: ', err);
        
            // notify app that an async operation errored
            dispatch( AC[`${thunkName}Fail`](selCrit, err));
          });
      };
  
    });
  }



  // wrapping up our internal _defineThunks() utility
  return thunks;
}
