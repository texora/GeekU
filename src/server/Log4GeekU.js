'use strict';

import Log from '../shared/util/Log';

/*--------------------------------------------------------------------------------
   Configure logs for GeekUApp.

   This module should be included very early (first) in the GeekUApp start-up 
   initialization process.
  --------------------------------------------------------------------------------*/

const log = new Log('GeekU');

const logConfig = Log.config({
  filter: {
    'root':              'INFO',
    'GeekU':             'none',
    'GeekU.ProcessFlow': 'none', // 'WARN' for NO probes, 'INFO for enter/exit points, 'TRACE' to see returned payload
  },

  excludeClientErrors: true,  // false: to see client Errors in log
  
});

log.info(()=>`Current Log Configuration:\n${JSON.stringify(logConfig, null, 2)}`);
