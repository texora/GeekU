'use strict'

import Log from '../../shared/util/Log';

const _actionLogCache = {}; // Key: Action Type, Value: Log instance
const _thunks = _defineThunks();

/**
 * Promote all actions used in our app ... both:
 *
 *   - AC: Action Creators
 *         A series of public functions that create actions.
 *         EX Usage:  AC.userMsg.display(msg): Action
 *         EX Action: { type: "userMsg.display", msg }
 *
 *   - AT: Action Types
 *         A series of Strings, representing our Action Types
 *         (used internally by our reducers [injected into each action]).
 *         EX: AT.userMsg.display = "userMsg.display"
 * PUBLIC NOTE: 
 *   - To determine what Action Creators are availble (AC), simply interpret
 *     the genesis structure (below) as follows:
 *      * The genesis key is the AC function name
 *      * The genesis value.params array represents the expected function parameters
 *     EXAMPLE: AC.userMsg.display(msg): Action
 *   - AC/AT may contain dots ('.') ... i.e. a federated namespace.
 *     In this case you may use one of two reference techniques ... the following are equivalent:
 *       * AC.userMsg.display('Hello World');
 *         AC['userMsg.display']('Hello World'); // SAME AS PRIOR LINE
 *       * AT.userMsg.display    // ... yeilds type: 'userMsg.display'
 *         AT['userMsg.display'] // ... SAME AS PRIOR LINE
 *   - To support federated namespace, the action types (AT) utilize String objects, rather than native strings.
 *       * This allows an intermediate sub-type (String) to contain additional properties (more-detailed types)
 *       * KEY: Because of this, you cannot rely on === semantics in compairing type strings.
 *         ... you can utilize === semantics with type.valueOf()
 *
 * INTERNAL NOTE: 
 *
 *   This technique of creating AC/ATs has the following benefits:
 *   
 *    - The Action Creators (AC) 
 *      * Concisely defines all the actions you can perform within the app
 *      * Promotes and validates the exact set of expected parameters
 *        ... at least the number of parameters
 *        ... the parameter types are NOT validated, but the name gives a hint of expectations
 *        ... here is an example error that is thrown if number of params are incorrect:
 *            ERROR: Action Creator AC.userMsg.display(msg) expecting 1 parameters, but received 2
 *      * Correctly constructs the action every time
 *   
 *    - The Action Types (AT):
 *      * Are consisely defined from the same definition
 *   
 *    - Minimal development effort in maintaining the AC/ATs
 */

const genesis = {

  'userMsg.display': { params: ['msg'] },
  'userMsg.close':   { params: [] },

  'retrieveStudents':          { params: ['selCrit'],                 thunk: _thunks.retrieveStudents },
  'retrieveStudents.start':    { params: ['selCrit'] },
  'retrieveStudents.complete': { params: ['selCrit', 'items'] },
  'retrieveStudents.fail':     { params: ['selCrit', 'error'] },

};

// AT: Action Types container object
//     EX: AT.userMsg.display = "userMsg.display"
export const AT = {};

// AC: Action Creators container object
//     EX: AC.userMsg.display(msg): Action
export const AC = {};

// machine generate our AT/ACs
for (const funcName in genesis) {

  const actionType = funcName; // alias ... our funcName is one and the same as our actionType

  // pre-carve out our log filter so as to promote all log filters at startup
  const log = getActionLog(actionType);

  // machine generate our AT entries (Action Types)
  AT[actionType] = new String(actionType); // new String() ... see NOTE above

  // machine generate our AC entries (Action Creator)
  AC[funcName] = function(...args) {

    // validate proper number of params passed in
    const paramNames = genesis[funcName].params;
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
  // ??? MUST UNIT TEST
  if (actionType.includes('.')) {
    const nodes = actionType.split('.');
    let   runningStr = '';
    let   runningAT  = null;
    let   runningAC  = null;

    for (const node of nodes) {
      if (!runningStr) {  // starting federated node ... assign root-level AT/AC (if not already there)
        runningStr += node;
        runningAT   = AT[node] = AT[runningStr] || {}; // ??? NOT: new String(runningStr);
        runningAC   = AC[node] = AC[runningStr] || {};
      }
      else {              // intermediate/end federated node
        runningStr += '.' + node;
        runningAT   = runningAT[node] = AT[runningStr] || {}; // ??? NOT: new String(runningStr);
        runningAC   = runningAC[node] = AC[runningStr] || {};
      }
    }
  }

} // end of LOOP ... machine generate our AT/ACs


// ***
// *** Action Log Cache
// ***

export function getActionLog(actionType) { // ??? test if this works equally well with String and string
  let log = _actionLogCache[actionType];
  if (!log) { // ... lazily create on first usage
    log = _actionLogCache[actionType] = new Log(`actions.${actionType}`);
  }
  return log;
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

    // hook into the appropriate action log
    const log = getActionLog(thunkName);

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
        dispatch( AC[thunkName].start(selCrit) );
  
        // async retrieval of students
        geekUFetch('/api/students') // TODO: interpret selCrit ... for now: all Students (return default fields)
          .then( res => {
            const students = res.payload;
            // ??? is this covered in our dispatch logging middleware?
            log.info (()=>`??? successful retrieval ... ${students.length} students returned`);
            log.debug(()=>'??? students: ', students);
        
            // notify app that an async operation is complete
            dispatch( AC[thunkName].complete(selCrit, students) );

          })
          .catch( err => {
            // ??? is this covered in our dispatch logging middleware?
            log.error(()=>'??? err: ', err);
        
            // notify app that an async operation errored
            dispatch( AC[thunkName].fail(selCrit, err) );
          });
      };
  
    });
  }



  // wrapping up our internal _defineThunks() utility
  return thunks;
}
