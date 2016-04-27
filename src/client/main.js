'use strict';

import '../shared/util/polyfill';
import Log     from '../shared/util/Log'; // TODO: create a Log4GeekU setup module for logs
import subject from '../shared/model/subject';
import registerInteractiveLogConfig from '../shared/util/LogInteractiveConfigForBrowser';

const log = new Log('GeekUApp');

// show our log messages
Log.config({
  filter: {
    'root': Log.INFO
  }
});

// show that we can interpret some shared components
log.info(()=>`here we are in src/client/main.js: academicGroupExists("Graduate Management"): '${subject.academicGroupExists("Graduate Management")}' !!!`);

// show off some async requests
let url = null;
url = '/route1/route2';                                // KJB: this returns html (currntly programatic doesn't handle very well ... obsecure exception in jsonizing it)
url = '/api/students/ouch';                            // KJB: this url sends back a NOT Found
url = '/api/courses?fields=courseNum,ouch,courseDesc'; // KJB: this url sends back a client error: 500: Internal Server Error
url = '/api/courses';                                  // KJB: this url sends back a good response: All Courses (default  fields)
url = '/api/courses/?fields=courseNum,courseTitle';    // KJB: this url sends back a good response: All Courses (selected fields)
url = '/api/courses/?fields=courseNum,courseTitle&filter={"subjDesc":"Applied %26 Engineering Physics"}';
url = '/api/courses/CS-1132';

geekUFetch(url)
  .then( res => {
    log.info(()=>'geekUFETCH: res: ', res); // really interested in res.payload (if there is a payload)
    log.info(()=>`geekUFETCH: res.headers.get('date'): ${res.headers.get('date')}`)
  })
  .catch( err => {
    log.error(()=>'geekUFETCH: err: ', err);
  });

registerInteractiveLogConfig('LogConfig');

function showLogs() {
  log.trace(()=>'My trace message.');
  log.debug(()=>'My debug message.');
  log.info (()=>'My info  message.');
  log.warn (()=>'My warn  message.');
  log.error(()=>'My error message.');
  log.fatal(()=>'My fatal message.');

  const someErr = new Error('Technical gobbely gook.')
                       .defineClientMsg('Client Messed Up')
                       .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR);
  Log.post('To see an exception, enable ERROR level and disable excludeClientErrors (false).');
  log.error(()=>'Here is an exception.', someErr);
}

document.getElementById('app').innerHTML = '<span id="showLogs" style="cursor: pointer; font-weight: bold">Show Logs</span>';
document.getElementById('showLogs').onclick = showLogs;
