'use strict';
 
import '../../../shared/util/polyfill';
import expect from 'expect';
import axios  from 'axios';

// ??? requires server to be running ... somehow check this and no-op with WARNING

// ***
// *** all /api/courses tests ...
// ***

const httpClient = axios.create({
  baseURL: 'http://localhost:8080/'
});

describe('/api/courses tests', function() {

  let goodResp = null;
  let errResp  = null;

  before( function(done) {
    console.log('??? hitting rest api service');
    // ? httpClient.get('http://swapi.co/api/people') // KJB: axios handles a different rest service correctly
    // ? httpClient.get('/api/courses?fields=courseNum,ouch,courseDesc') // KJB: this url sends back a client error: 500: Internal Server Error
    httpClient.get('/api/courses') // KJB: this url sends back a good response
    .then( function(resp) {
        goodResp = resp;
        const courses = resp.data;
        console.log('??? received courses: ', courses);
        for (let prop in resp) {
          console.log(`   ? resp.${prop}: ${resp[prop]}`);
        }
        done();
      })
    .catch( function(resp) {
        errResp = resp;
        console.log("??? err: ", resp);
        console.log("??? err jsonized: " + JSON.stringify(resp));
        for (let prop in resp) {
          console.log(`   ? resp.${prop}: ${resp[prop]}`);
        }
        done(resp); // KJB: wow, this emits "Network Error"
      })
  });

  after( function() {
  });

  it('Should succeed', function() {
    // ? // ??? FOR swapi
    // ? let people = goodResp.data.results;
    // ? console.log(`??? first person: name: : ${people[0].name}, hair_color: ${people[0].hair_color}`);

    expect(goodResp).toExist();
    expect(errResp).toNotExist();
  });

});
