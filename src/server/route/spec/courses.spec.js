'use strict';
 
import '../../../shared/util/polyfill';
import expect from 'expect';
import axios  from 'axios';

// ??? requires server to be running ... somehow check this and no-op with WARNING

// ***
// *** all /api/courses tests ...
// ***


// TODO: either technique is legit ... using global axios, or crateing an instance, or specifing full url in request
axios.defaults.baseURL = 'http://localhost:8080/';
// const httpClient = axios.create({
//   baseURL: 'http://localhost:8080/'
// });

// ? // NOTE: Coded this way, we do NOT seem to get the async semantics in place
// ? describe('/api/courses tests', () => {
// ? 
// ?   // ? it('POOP', () => {
// ?   // ?   expect(1).toEqual(2);
// ?   // ? });
// ? 
// ? 
// ?   console.log('??? hitting rest api service');
// ?   // axios or httpClient
// ?   // axios.get('/api/courses/?fields=courseNum,courseTitle&filter={"_id":{"$in":["CS-1110","CS-1112"]}}')
// ?   axios.get('http://swapi.co/api/people')
// ?     .then(resp => {
// ?       const courses = resp.data;
// ? 
// ?       console.log(`??? received courses: ${courses}`);
// ? 
// ?       it('Should have multiple results', () => {
// ?         expect(courses.length).toEqual(4);
// ?       });
// ? 
// ?     })
// ?     .catch(err => { // ??? is ALSO RESP
// ?     
// ?       console.log("??? err: ", err);
// ?       console.log("??? err.data: ", err.data);
// ?     
// ?       it(`Unexpected err: ${err.status} ${err.data}`, () => {
// ?         // ? expect().fail('POOP');
// ?         expect().toExist('FAIL'); // ??? use a generic fail
// ?       });
// ?     
// ?     });
// ? 
// ? });


// NOTE: Coded this way, async promises seem to work (using mocha's done semantics)
//       HOWEVER, WE DON'T WANT TO RUN THE ASYNC FUNCTION BEFORE EACH IT ... GRRRR
describe('/api/courses tests', () => {

  let goodResp = null;
  let errResp  = null;

  before( done => {
    console.log('??? hitting rest api service');
    // axios or httpClient
    axios.get('/api/courses/?fields=courseNum,courseTitle&filter={"_id":{"$in":["CS-1110","CS-1112"]}}')
    // ? axios.get('http://swapi.co/api/people')
      .then(resp => {
        goodResp = resp;
        const courses = resp.data;
        console.log('??? received courses: ', courses);
        for (let prop in resp) {
          console.log(`   ? resp.${prop}: ${resp[prop]}`);
        }
        done();
      })
      .catch(resp => {
        errResp = resp;
        console.log("??? err: ", resp);
        for (let prop in resp) {
          console.log(`   ? resp.${prop}: ${resp[prop]}`);
        }
        done();
      })
  });

  it('Should succeed', () => {
    // ? // ??? FOR swapi
    // ? let people = goodResp.data.results;
    // ? console.log(`??? first person: name: : ${people[0].name}, hair_color: ${people[0].hair_color}`);

    expect(goodResp).toExist();
    expect(errResp).toNotExist();
  });

  // ? it('Should be good', () => {
  // ?   expect(goodResp).toExist();
  // ?   expect(errResp).toNotExist();
  // ? });
  
});
