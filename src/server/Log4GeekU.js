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
    'root':             ['INFO', 'The top-level root of ALL filters, referenced when a given filter has NOT been set.'],
    'GeekU':             'none',
    'GeekU.ProcessFlow': ['none', ` <dl> <dt> WARN:   </dt> <dd> for NO probes </dd>
                                         <dt> INFO:   </dt> <dd> see enter/exit points </dd>
                                         <dt> DEBUG:  </dt> <dd> see service logic </dd>
                                         <dt> TRACE:  </dt> <dd> include returned payload<br/><i>CAUTION: payloads may be BIG</i> </dd>
                                    </dl>`],
  },

  excludeClientErrors: true,  // false: to see client Errors in log
  
});

log.info(()=>`Current Log Configuration:\n${JSON.stringify(logConfig, null, 2)}`);
