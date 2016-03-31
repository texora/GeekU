'use strict';
 
import '../../../shared/util/polyfill';
import expect from 'expect';

// ??? requires server to be running ... somehow check this and no-op with WARNING

// ***
// *** all /api/courses tests ...
// ***

// ??? axios version
// ? const httpClient = axios.create({
// ?   baseURL: 'http://localhost:8080/'
// ? });
// ? 
// ? describe('/api/courses tests', function() {
// ? 
// ?   let goodResp = null;
// ?   let errResp  = null;
// ? 
// ?   before( function(done) {
// ?     console.log('??? hitting rest api service');
// ?     // ? httpClient.get('http://swapi.co/api/people') // KJB: axios handles a different rest service correctly
// ?     // ? httpClient.get('/api/courses?fields=courseNum,ouch,courseDesc') // KJB: this url sends back a client error: 500: Internal Server Error
// ?     httpClient.get('/api/courses') // KJB: this url sends back a good response
// ?     .then( function(resp) {
// ?         goodResp = resp;
// ?         const courses = resp.data;
// ?         console.log('??? received courses: ', courses);
// ?         for (let prop in resp) {
// ?           console.log(`   ? resp.${prop}: ${resp[prop]}`);
// ?         }
// ?         done();
// ?       })
// ?     .catch( function(resp) {
// ?         errResp = resp;
// ?         console.log("??? err: ", resp);
// ?         console.log("??? err jsonized: " + JSON.stringify(resp));
// ?         for (let prop in resp) {
// ?           console.log(`   ? resp.${prop}: ${resp[prop]}`);
// ?         }
// ?         done(resp); // KJB: wow, this emits "Network Error"
// ?       })
// ?   });
// ? 
// ?   after( function() {
// ?   });
// ? 
// ?   it('Should succeed', function() {
// ?     // ? // ??? FOR swapi
// ?     // ? let people = goodResp.data.results;
// ?     // ? console.log(`??? first person: name: : ${people[0].name}, hair_color: ${people[0].hair_color}`);
// ? 
// ?     expect(goodResp).toExist();
// ?     expect(errResp).toNotExist();
// ?   });
// ? 
// ? });

// ??? fetch version
describe('/api/courses tests', function() {

  let courses  = null;
  let asyncErr = null;

  before( function(asyncComplete) {

    let url = null;
    url = 'http://localhost:8080/route1/route2';                                // KJB: this returns html (currntly programatic doesn't handle very well ... obsecure exception in jsonizing it)
    url = 'http://localhost:8080/api/courses?fields=courseNum,ouch,courseDesc'; // KJB: this url sends back a client error: 500: Internal Server Error
    url = 'http://localhost:8080/api/students/ouch';                            // KJB: this url sends back a NOT Found
    url = 'http://localhost:8080/api/courses';                                  // KJB: this url sends back a good response

    console.log('??? hitting rest api service: ' + url);

    geekUFetch(url)
      .then( res => {
        // console.log('geekUFETCH: res: ', res);
        // console.log(`geekUFETCH: res.headers.get('date'): ${res.headers.get('date')}`)
        courses = res.payload;
        console.log('geekUFETCH: received courses: ', courses);
        asyncComplete();
      })
      .catch( err => {
        asyncErr = err;
        // ? console.log('geekUFETCH: err: ', err);
        // ? console.log(`geekUFETCH: err: '${err}'`);
        err.log();
        // ? for (let prop in err) {
        // ?   const val = typeof(err[prop]) === "function" ? 'function' : err[prop];
        // ?   console.log (`... err.${prop}: ${val}`);
        // ? }
        asyncComplete();
        // asyncComplete(err); // ??? hmmm is coming back with Network request failed
      });

  });

  after( function() {
  });

  it('Should succeed', function() {
    expect(courses).toExist();
    expect(asyncErr).toNotExist();
  });

});
