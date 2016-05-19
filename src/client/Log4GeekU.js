'use strict';

import Log                          from '../shared/util/Log';
import registerInteractiveLogConfig from '../shared/util/LogInteractiveConfigForBrowser';

/*--------------------------------------------------------------------------------
   Configure logs for GeekUApp.

   This module should be included very early (first) in the GeekUApp start-up 
   initialization process.
   --------------------------------------------------------------------------------*/

const log = new Log('GeekU');

// configure our initial Log Filter Settings
const logConfig = Log.config({
  filter: {
    'root':               'INFO',
    'GeekU':              'none', // 'DEBUG' to see entire Material-UI muiTheme
    'autoBindAllMethods': 'none',
  },

  excludeClientErrors: false,  // false: to see client Errors in log
  
});

// emit our current Log Configuration
log.info(()=>`Current Log Configuration:\n${JSON.stringify(logConfig, null, 2)}`);

// allow browser logs to be interactivally configured through Easter Egg key sequence of 'LogConfig'
registerInteractiveLogConfig('LogConfig');
