'use strict'

import getActionLog from '../getActionLog';


/**
 * Convenience utility that consolidates all thunk component definition
 * in one concise return.
 *
 * @param {string} thunkName the thunk name corresponding to the log
 * filter -AND- the conventions of AC action creator (see actions.js)
 * ... ex: 'selCrit.save'
 *
 * @param {function} thunkFunc the thunk function to promote, conforming to
 * the parameters defined in AC (see actions.js) -AND- returning a function 
 * conforming to (interpreted by) the redux-thunk middleware.
 *
 * @return {Array} a convenience object consolidating three pieces
 * of information: [ thunkFunc, thunkName, log ]
 */
export default function promoteThunk(thunkName, thunkFunc) {

  // hook into the appropriate action log
  const log = getActionLog(thunkName);

  // promote the consolidated information
  return [ thunkFunc, thunkName, log ];
}
