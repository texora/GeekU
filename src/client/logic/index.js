'use strict';

import { createLogic } from 'redux-logic';

import actionLogger    from './actionLogger';
import selCritChanges  from './selCritChanges';


//***
//*** accumulation of all application logic
//***

export default [
  actionLogger,
  ...selCritChanges
];
