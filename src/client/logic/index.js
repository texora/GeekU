'use strict';

import { createLogic } from 'redux-logic';

import logDispatchedActions    from './logDispatchedActions';

import selCritChanges  from './selCritChanges';


//***
//*** accumulation of all application logic
//***

export default [
  logDispatchedActions,
  ...selCritChanges
];
