'use strict';

import '../../../shared/util/polyfill';
import expect from 'expect';


const _tests   = []; // ??? can this be in the new AsyncTestHelper() too?
let   _testNum = 0;
function runNextTest() {
  const nextTest = _tests[_testNum++];
  if (!nextTest)
    return;
  nextTest();
}

// Test 1
_tests.push(() => {

  const url = 'http://swapi.co/api/people';
  const testName = 'SWAPI Test 1';

  describe(testName, function() { // ??? unsure WHY this can't be an arrow function, which diss-allows access to curTest in the after fn below

    let people   = null;
    let asyncErr = null;

    let curTest = this; // ?? encapsolate this ... new class AsyncTestHelper(mochaCtx)
    let numTests = 0;   // ?? encapsolate this ... member of 

    before( asyncComplete => {

      console.log(`INFO: Starting ${testName}: ${url}'`);

      fetch(url)
        .then( res => {
          return res.json();
        })
        .then( peopleRes => {
          people = peopleRes.results;
          console.log('SWAPI: received people: ', people);
          asyncComplete();
        })
        .catch( err => {
          console.log('SWAPI: err: ', err);
          asyncErr = err;
          asyncComplete(err);
        });

    });

    after( () => {
      console.log(`??? curTest: ${curTest}`);
      if (numTests >= curTest.tests.length) { // ?? encapsolate this ... possibly through a wrapped after()
        runNextTest();
      }
    });

    it('Should succeed', () => {
      expect(people).toExist();
      expect(asyncErr).toNotExist();
      numTests++; // ?? encapsolate this ... possibly through a wrapped it()
    });

    it('Really succeed', () => {
      expect(people).toExist();
      expect(asyncErr).toNotExist();
      numTests++; // ?? encapsolate this ... possibly through a wrapped it()
    });

    it('Really Really succeed', () => {
      expect(people).toExist();
      expect(asyncErr).toNotExist();
      numTests++; // ?? encapsolate this ... possibly through a wrapped it()
    });
  });
});


// Test 2
_tests.push(() => {

  const url = 'http://swapi.co/api/people';
  const testName = 'SWAPI Test 2';

  describe(testName, () => {

    let people   = null;
    let asyncErr = null;

    before( asyncComplete => {

      console.log(`INFO: Starting ${testName}: ${url}'`);

      fetch(url)
        .then( res => {
          return res.json();
        })
        .then( peopleRes => {
          people = peopleRes.results;
          console.log('SWAPI: received people: ', people);
          asyncComplete();
        })
        .catch( err => {
          console.log('SWAPI: err: ', err);
          asyncErr = err;
          asyncComplete(err);
        });

    });

    after( () => {
      runNextTest();
    });

    it('Should succeed', () => {
      expect(people).toExist();
      expect(asyncErr).toNotExist();
    });

  });
});

// start the ball rolling
runNextTest();
