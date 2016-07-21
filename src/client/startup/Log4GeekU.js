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
  logLevels: [ // NOTE: log levels should be consistent between client/server for shared utilities to operate
    'ERROR',
    'WARN',
    '*INFO',
    'INSPECT', // NON-Standard level (providing more control between INFO/DEBUG)
    'DEBUG',
    'TRACE',
  ],
  filter: {
    'root':               ['INFO', 'The top-level root of ALL filters, referenced when a given filter has NOT been set.'],

    'startup':                'none',
    'startup.createAppStore': 'none',
    'startup.muiTheme':      ['none', ` <dl> <dt> DEBUG: </dt> <dd> see entire Material-UI muiTheme </dd>
                                        </dl>`],

    'middleware':             ['none', ` <dl> <dt> INSPECT: </dt> <dd> see ENTER/EXIT of redux middleware components </dd>
                                              <dt> DEBUG:   </dt> <dd> include middleware logic </dd>
                                         </dl> ... may apply lower (ex: 'middleware.thunkBatchHandler')`],
    'middleware.errorHandler':      'none',
    'middleware.thunkBatchHandler': 'none',
    'middleware.actionLogger':      'none',

    'actions':           ['none', ` <dl> <dt> INSPECT: </dt> <dd> see ENTER/EXIT of dispatched actions </dd>
                                         <dt> DEBUG:   </dt> <dd> include action app logic (in thunks) </dd>
                                         <dt> TRACE:   </dt> <dd> include action content too<br/><i>CAUTION: actions with payload may be BIG</i> </dd>
                                    </dl> ... may apply lower (ex: 'actions.userMsg')`],

    'appState':          ['none', `  <dl> <dt> INSPECT: </dt> <dd> monitor reducer state changes only </dd>
                                          <dt> DEBUG:   </dt> <dd> include explicit reducer logic action reasoning (regardless if state changes) </dd>
                                          <dt> TRACE:   </dt> <dd> include ALL reducer enter/exit points (<i>NO real value - simply shows ALL appState reducers</i>) </dd>
                                     </dl> ... may apply lower (ex: 'appState.userMsg')`],

    'autoBindAllMethods': 'none',
  },

  excludeClientErrors: false,  // false: to see client Errors in log
  
});

// allow browser logs to be interactivally configured through Easter Egg key sequence of 'LogConfig'
registerInteractiveLogConfig('log/config');
