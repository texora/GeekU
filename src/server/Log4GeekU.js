'use strict';

import Log from '../shared/util/Log';

/*--------------------------------------------------------------------------------
   Configure logs for GeekUApp.

   This module should be included very early (first) in the GeekUApp start-up 
   initialization process.
  --------------------------------------------------------------------------------*/

const log = new Log('GeekU');

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
    'root':             ['INFO', 'The top-level root of ALL filters, referenced when a given filter has NOT been set.'],
    'GeekU':             'none',
    'GeekU.ProcessFlow': ['none', ` <dl> <dt> WARN:   </dt> <dd> for NO probes </dd>
                                         <dt> INFO:   </dt> <dd> see transaction enter/exit points </dd>
                                         <dt> DEBUG:  </dt> <dd> include service logic </dd>
                                         <dt> TRACE:  </dt> <dd> include returned payload<br/><i>CAUTION: payloads may be BIG</i> </dd>
                                    </dl>`],
  },

  excludeClientErrors: true,  // false: to see client Errors in log
  
});

log.info(()=>`Current Log Configuration:\n${FMT(logConfig)}`);
