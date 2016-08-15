'use strict';

import {batchActions, BATCH} from 'redux-batched-actions';
import getActionLog          from '../../actions/getActionLog';
import actionTypeAmplified   from '../../util/actionTypeAmplified';

import Log                   from '../../../shared/util/Log';

const log = new Log('middleware.thunkBatchHandler');

/**
 * Our thunk/batch handler middleware component, supporting BOTH 
 * thunks and action arrays (containing both objects and thunks).
 */
const thunkBatchHandler = ({dispatch, getState}) => next => action => {
  try {
    log.inspect(()=>`ENTER ${log.filterName} for action: ${actionTypeAmplified(action)}`);

    //***
    //*** Phase I: Collect Phase - collect all action objects (resolving thunks into action objects)
    //***

    let phase = 'collectActions'; // in effect during the direct execution of thunks

    // our collection of ALL action object(s)
    // ... thunks are resolved by collecting any optional actions they dispatch within their direct execution (via our wrappedDispatch)
    const allActionObjects = [];

    // maintain any thunk return value(s)
    const thunkReturnVals    = []; // ex: promise(s) returned from thunk(s)
    function evalThunkReturnVals() {
      switch (thunkReturnVals.length) {
        case 0:  return undefined;
        case 1:  return thunkReturnVals[0];
        default: return thunkReturnVals;
      }
    }

    // utility to add supplied action (an object, or an array, or a thunk), resolving into action object
    function addActionObject(action) {

      // for action thunks, we directly execute the thunk
      // ... this is similar to redux-thunk middleware
      //     - EXCEPT we collect action objects in allActionObjects
      //       ... via wrappedDispatch (in our 'collectActions' phase)
      //       ... KEY: supporting our batching philosophy
      //     - please refer to the redux-thunk source: 
      //       ... https://github.com/gaearon/redux-thunk/blob/master/src/index.js
      if (typeof action === 'function') {
        const thunkReturnVal = action(wrappedDispatch, getState);
        if (thunkReturnVal) {
          thunkReturnVals.push(thunkReturnVal);
        }
      }

      // for action arrays, we resolve each action (which could be an action object, or a thunk)
      else if (Array.isArray(action)) {
        action.forEach( (action) => {
          addActionObject(action);
        });
      }

      // for action objects, simply collect them
      else {
        allActionObjects.push(action);
      }
    }

    // here is our wrapped dispatch object that operates differently within our two phases
    function wrappedDispatch(otherAction) {

      // within our 'collectActions' phase, we merely collect actions from any thunk execution
      if (phase === 'collectActions') {
        addActionObject(otherAction);
      }

      // within our execution phase, we simply pass-through to the real dispatch
      // ... this occurs once all thunks have initially executed
      //     ex: a future execution of a thunk's inner callback
      else {
        dispatch(otherAction);
      }
    }

    // bootstrap our process by adding the initial action supplied to our middleware
    addActionObject(action);


    //***
    //*** Phase II: Execution Phase - all actions have been resolved as action objects (i.e. NOT thunks)
    //***

    phase = 'executeActions'; // in effect during a future execution of a thunk's inner callback

    switch (allActionObjects.length) {

      case 0:  // NO action objects to dispatch (ex: thunk with delayed dispatch)
        log.debug(()=>'NO action object to dispatch (ex: thunk with delayed dispatch)');
        return evalThunkReturnVals();

      case 1:  // A single action object to dispatch
        log.debug(()=>`Dispatch a single action object, ${actionTypeAmplified(allActionObjects[0])}`);
        next(allActionObjects[0]);
        return evalThunkReturnVals();

      default: // multiple action objects to dispatch
        // ... in support batching of actions, 
        //     we re-dispatch an action array morphed into batchActions (using redux-batched-actions middleware)
        log.debug(()=>`Re-Dispatch multiple action objects (by morphing them into batch), ${actionTypeAmplified(allActionObjects)}`);
        return dispatch( batchActions( allActionObjects ));
    }

  }
  finally {
    log.inspect(()=>`EXIT ${log.filterName} for action: ${actionTypeAmplified(action)}`);
  }
}

// prime the log-filter pump for the BATCHING_REDUCER, because this is NOT part of our AT
// ... this merely promotes the log filter prior to it being executed at run-time
//     normally this happens in the module scope
getActionLog(BATCH);

export default thunkBatchHandler;
