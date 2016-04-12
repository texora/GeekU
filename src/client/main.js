'use strict';

import '../shared/util/polyfill';
import Log     from '../shared/util/Log'; // TODO: create a Log4GeekU setup module for logs
import subject from '../shared/model/subject';

const log = new Log('GeekUApp');

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
