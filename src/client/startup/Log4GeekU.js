'use strict';

import Log                          from '../../shared/util/Log';
import registerInteractiveLogConfig from '../../shared/util/LogInteractiveConfigForBrowser';

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
    'FLOW',    // NEW level emiting high-level enter/exit points
    '*INFO',
    'WARN',
    'ERROR'],
  filter: {
    'root':               ['INFO', 'The top-level root of ALL filters, referenced when a given filter has NOT been set.'],

    'startup':                'none',
    'startup.createAppStore': 'none',
    'startup.muiTheme':      ['none', ` <dl> <dt> DEBUG: </dt> <dd> see entire Material-UI muiTheme </dd>
                                        </dl>`],

    'middleware':             ['none', ` <dl> <dt> DEBUG: </dt> <dd> see ENTER/EXIT of redux middleware components </dd>
                                         </dl> ... may apply lower (ex: 'middleware.batchHandler')`],
    'middleware.errorHandler': 'none',
    'middleware.batchHandler': 'none',
    'middleware.actionLogger': 'none',
    

    'actions':           ['none', ` <dl> <dt> FLOW:   </dt> <dd> see dispatched action enter/exit points </dd>
                                         <dt> DEBUG:  </dt> <dd> include action app logic (in thunks) </dd>
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
