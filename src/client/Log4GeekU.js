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
    'VERBOSE', // NEW level emitting lot's of detail or large content
    'DEBUG',
    'FLOW',  // NEW level emiting high-level enter/exit points
    '*INFO',
    'WARN',
    'ERROR'],
  filter: {
    'root':               'INFO',

    'startup':            'none',
    'startup.appStore':   'none',
    'startup.muiTheme':  ['none', ` <dl> <dt> DEBUG:  </dt> <dd> see entire Material-UI muiTheme </dd>
                                    </dl>`],

    'actions':           ['none', ` <dl> <dt> FLOW:   </dt> <dd> see action enter/exit points </dd>
                                         <dt> DEBUG:  </dt> <dd> include action app logic </dd>
                                         <dt> VERBOSE:</dt> <dd> include action content too<br/><i>CAUTION: actions with payload may be BIG</i> </dd>
                                    </dl> ... may apply lower (ex: 'actions.userMsg')`],

    'appState':          ['none', ` <dl> <dt> DEBUG:  </dt> <dd> see reducer app logic </dd>
                                    </dl> ... may apply lower (ex: 'appState.userMsg')`],


    'autoBindAllMethods': 'none',
  },

  excludeClientErrors: false,  // false: to see client Errors in log
  
});

// allow browser logs to be interactivally configured through Easter Egg key sequence of 'LogConfig'
registerInteractiveLogConfig('log/config');
