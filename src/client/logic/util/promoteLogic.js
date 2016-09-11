'use strict'

import {createLogic} from 'redux-logic';


/**
 * Convenience utility that consolidates all logic component
 * definition in one concise return ... streamlining logicName usage.
 *
 * @param {string} logicName this component's logic name (injected in
 * logic-based logging probes ... see: getActionLogicLog()).
 *
 * @param {Logic} logicDef the logic definition ... supplied to
 * redux-logic createLogic().
 *
 * @return {Array} a convenience object consolidating two pieces
 * of information: [ logicName, logic ]
 */
export default function promoteLogic(logicName, logicDef) {
  // create the logic component, promoting our consolidated information
  return [ logicName, createLogic(logicDef) ];
}
