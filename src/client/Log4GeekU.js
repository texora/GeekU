'use strict';

import Log                          from '../shared/util/Log';
import registerInteractiveLogConfig from '../shared/util/LogInteractiveConfigForBrowser';

/*--------------------------------------------------------------------------------
   Configure logs for GeekUApp.

   This module should be included very early (first) in the GeekUApp start-up 
   initialization process.
   --------------------------------------------------------------------------------*/

// configure our initial Log Filter Settings
const logConfig = Log.config({
  logLevels: [
    'DEBUG',
    'FLOW',  // NEW level emiting enter/exit points
    '*INFO',
    'WARN',
    'ERROR'],
  filter: {
    'root':               'INFO',
    'actions':            'FLOW',  // 'FLOW' to see ALL action enter/exit points, 'DEBUG' to see ALL action content, -OOOORRRRRR- individual action
    'startup':            'none',
    'startup.muiTheme':   'none',  // 'DEBUG' to see entire Material-UI muiTheme
    'startup.appStore':   'none',
    'autoBindAllMethods': 'none',
  },

  excludeClientErrors: false,  // false: to see client Errors in log
  
});

// allow browser logs to be interactivally configured through Easter Egg key sequence of 'LogConfig'
registerInteractiveLogConfig('log/config');
