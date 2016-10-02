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
    'VERBOSE', // NON-Standard level (used in more sizable/frequent output)
  ],
  filter: {
    'root':               ['INFO', 'The top-level root of ALL filters, referenced when a given filter has NOT been set.'],

    'startup':                'none',
    'startup.createAppStore': 'none',
    'startup.muiTheme':      ['none', ` <dl> <dt> DEBUG: </dt> <dd> see entire Material-UI muiTheme </dd>
                                        </dl>`],

    'actions':           ['none', ` <dl> <dt> DEBUG:   </dt> <dd> include action app logic (redux-logic) </dd>
                                         <dt> TRACE:   </dt> <dd> see dispatched actions </dd>
                                         <dt> VERBOSE: </dt> <dd> see dispatched actions INCLUDING action content<br/><i>CAUTION: action content can be BIG</i> </dd>
                                    </dl> ... may apply lower (ex: 'actions.userMsg')`],

    'api':               ['none', 'NOTE: api.xxx probes may ALSO be enabled through the actions.xxx filters'],

    'appState':          ['none', `  <dl> <dt> INSPECT: </dt> <dd> monitor reducer state changes only </dd>
                                          <dt> DEBUG:   </dt> <dd> include explicit reducer logic action reasoning (regardless if state changes) </dd>
                                          <dt> TRACE:   </dt> <dd> include ALL reducer enter/exit points (<i>NO real value - simply shows ALL appState reducers</i>) </dd>
                                     </dl> ... may apply lower (ex: 'appState.userMsg')`],
  },

  excludeClientErrors: false,  // false: to see client Errors in log
  
});

// allow browser logs to be interactivally configured through Easter Egg key sequence of 'LogConfig'
registerInteractiveLogConfig('log/config');
