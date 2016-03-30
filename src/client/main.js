'use strict';

import '../shared/util/polyfill';
import subject from '../shared/model/subject';
// import axios  from 'axios';

// show that we can interpret some shared components
console.log(`here we are in src/client/main.js: academicGroupExists("Graduate Management"): '${subject.academicGroupExists("Graduate Management")}' !!!`);

// show off some async requests
let url = null;
url = '/route1/route2';                                // KJB: this returns html (currntly programatic doesn't handle very well ... obsecure exception in jsonizing it)
url = '/api/students/ouch';                            // KJB: this url sends back a NOT Found
url = '/api/courses?fields=courseNum,ouch,courseDesc'; // KJB: this url sends back a client error: 500: Internal Server Error
url = '/api/courses';                                  // KJB: this url sends back a good response

// axios.get(url)
//   .then( res => { // KJB: auto jsonized
//     console.log(`AXIOS: res.status: ${res.status}, res.statusText: ${res.statusText}`);
//     console.log('AXIOS: res: ', res);
//   })
//   .catch( respErr => { // KJB: automatically segregates resp outside the range of 2xx
//                        //      can be a resp with http status NOT 2xx -OR- a real Error (problem in setting up request)
//     console.log("AXIOS: respErr: ", respErr);
//   });
//        
// fetch(url)
//   .then( res => {
//     console.log('FETCH: res: ', res);
//   })
//   .catch( err => {
//     console.log('FETCH: err: ', err);
//   });

geekUFetch(url)
  .then( res => {
    console.log('geekUFETCH: res: ', res); // really interested in res.payload (if there is a payload)
    console.log(`geekUFETCH: res.headers.get('date'): ${res.headers.get('date')}`)
  })
  .catch( err => {
    console.log('geekUFETCH: err: ', err);
  });
