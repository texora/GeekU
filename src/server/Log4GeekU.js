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
    'GeekU.ProcessFlow': ['none', ` <dl> <dt> WARN:   </dt> <dd> for NO probes </dd>
                                         <dt> INFO:   </dt> <dd> see enter/exit points </dd>
                                         <dt> TRACE:  </dt> <dd> include returned payload<br/><i>CAUTION: payloads may be BIG</i> </dd>
                                    </dl>`],
  },

  excludeClientErrors: true,  // false: to see client Errors in log
  
});

log.info(()=>`Current Log Configuration:\n${JSON.stringify(logConfig, null, 2)}`);
