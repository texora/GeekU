'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import handleUnexpectedError         from '../util/handleUnexpectedError';


/**
 * Monitor unexpected conditions within the redux dispatch process
 * (where most of our app logic resides) ...
 *    - communicating problem to the user
 *    - and logging the details (for tech support)
 */
export default createNamedLogic('communicateUnexpectedErrors', {

  type: [/\.fail$/,                // ... from GeekU async '*.fail' actions
         'UNHANDLED_LOGIC_ERROR'], // ... from redux-logic error handler
         
  process({getState, action, log}, dispatch) {

    const err = action.err ||   // ... from GeekU async '*.fail' actions
                action.payload; // ... from redux-logic error handler

    dispatch( handleUnexpectedError(err) );
  },

});
