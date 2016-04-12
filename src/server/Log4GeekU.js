'use strict';

import Log from '../shared/util/Log';

/*--------------------------------------------------------------------------------
   Configure logs for GeekUApp.

   This module should be included very early (first) in the GeekUApp start-up 
   initialization process.
  --------------------------------------------------------------------------------*/

const log = new Log('GeekUApp');

const logConfig = Log.config({
  logLevels: [
    'TRACE',
    'DEBUG',
    'FLOW',  // NEW: used to log process flow enter/exit points
    '*INFO',
    'WARN',
    'ERROR',
    'FATAL',
  ],

  filter: {
    'root':              'INFO',
    'GeekUApp':          'none',
    'ProcessFlow':       'FLOW', // 'none' for virtually NO probes, 'FLOW' for mild enter/exit points, 'TRACE' to see returned payload
    'ProcessFlow.Enter': 'none',
    'ProcessFlow.Exit':  'none',
  },

  //excludeClientErrors: false,  // to see client Errors in log
  
});

log.info(()=>`Current Log Configuration:\n${JSON.stringify(logConfig, null, 2)}`);
