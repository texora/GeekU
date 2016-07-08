'use strict'

import Log from '../../shared/util/Log';

/**
 * A ReduxSubReducer object orchestrates redux state changes through
 * a sub-reducer object, containing a set of sub-reducer functions
 * indexed by the standard redux action.type.
 *
 * In it's most rudimentary form, this class provides a more elegant
 * solution to the switch statement, commonly used to provide this
 * control mechanism.
 * 
 * @api public
 * @author Kevin Bridges
 */
class ReduxSubReducer {

  /**
   * Construct a ReduxSubReducer instance with the supplied state.
   *
   * @param {string} reducerName the name of our reducer.  This is
   * also used as our logging filter name.
   *
   * @param {Object} subReducer the sub-reducer object containing a
   * set of sub-reducer functions indexed by the standard redux
   * action.type.  
   * 
   * Each sub-reducer function has the followin signature:
   *   function(state, action): [nextState, subLogMsgFn]
   * 
   * For example:
   *   {
   *     [AT.retrieveStudents.complete](items, action) {
   *       return [
   *         action.items,
   *         ()=>`set items from action: ${action.items.length} students`
   *       ];
   *     },
   *     ... more
   *   }
   */
  constructor(reducerName, subReducer) {
    this.reducerName = reducerName;
    this.subReducer  = subReducer;
    this.log         = new Log(reducerName);
  }

  /**
   * Resolve the next redux state, by giving control to a sub-reducer
   * (if any).  If no applicable sub-reducer is found, the current
   * state is returned.
   * 
   * @param {Object} state the current redux state.
   * @param {Object} action the standard redux action, who's state
   * property orchastrates the sub-reducer redirection.
   * 
   * @return {Object} the next redux state.
   */
  resolve(state, action) {

    const subReducer = this.subReducer[action.type];
    const [nextState, subLogMsgFn] = subReducer
                                      ? subReducer(state, action) 
                                      : [state, null];


    // apply a VERY useful log process, that distinguishes between state changes,
    // allowing FOLLOW/DEBUG enablement at a top-level with useful insight -AND- minimal output!
    // Log Levels: 
    //   FOLLOW: monitor reducer state changes only
    //   DEBUG:  include explicit reducer logic action reasoning (regardless if state changes)
    //   TRACE:  include ALL reducer enter/exit points (NO real value - simply shows ALL appState reducers)
    const logIt = ((state !== nextState)
                     ? this.log.follow     // state change - use log.follow()
                     : (subReducer)
                         ? this.log.debug  // no state change, but app-specific logic - use log.debug()
                         : this.log.trace) // no state change, and no app-logic = use log.trace()
                   .bind(this.log);
    logIt(()=> {
      const stateChanged  = state !== nextState
                              ? '(STATE CHANGED)'
                              : '(*NO* state change)';
      const subReducerMsg = subReducer 
                              ? `... sub-reducer: ${subLogMsgFn()}`
                              : '';
      return `Reducer: ${this.reducerName}, Action: '${action.type}' ${stateChanged} ${subReducerMsg}`
    });
    
    return nextState;
  }

}

export default ReduxSubReducer
