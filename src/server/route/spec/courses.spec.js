'use strict';
 
import '../../../shared/util/polyfill';
import expect from 'expect';

// ***
// *** all /api/courses tests ...
// ***

// console.log('??? INFO: running async test with multiple sequential reliant steps!');

describe('/api/courses tests', function() {

  if (1===1) return; // ?? temporally disable IT tests until we can better govern their execution

  let courses  = null;
  let asyncErr = null;

  before( function(asyncComplete) {

    let url = null;
    url = 'http://localhost:8080/route1/route2';                                // KJB: this returns html (currntly programatic doesn't handle very well ... obsecure exception in jsonizing it)
    url = 'http://localhost:8080/api/students/ouch';                            // KJB: this url sends back a NOT Found
    url = 'http://localhost:8080/api/courses?fields=courseNum,ouch,courseDesc'; // KJB: this url sends back a client error: 500: Internal Server Error
    url = 'http://localhost:8080/api/courses';                                  // KJB: this url sends back a good response

    geekUFetch(url)
      .then( res => {
        // console.log('geekUFETCH: res: ', res);
        // console.log(`geekUFETCH: res.headers.get('date'): ${res.headers.get('date')}`)
        courses = res.payload;
        // console.log('geekUFETCH: received courses: ', courses);
        asyncComplete();
      })
      .catch( err => {
        asyncErr = err;
        // console.log('geekUFETCH: err: ', err);
        // console.log(`geekUFETCH: err: '${err}'`);
        // log.error(()=>'',err);
        // for (let prop in err) {
        //   const val = typeof(err[prop]) === "function" ? 'function' : err[prop];
        //   console.log (`... err.${prop}: ${val}`);
        // }
        asyncComplete();
        // asyncComplete(err);
      });

  });

  after( function() {
  });

  it('Should succeed', function() {
    expect(courses).toExist();
    expect(asyncErr).toNotExist();
  });

});
