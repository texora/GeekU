'use strict';

import '../../../shared/util/polyfill';
import expect               from 'expect';
import MochaAsyncTestHelper from '../../../shared/util/MochaAsyncTestHelper';

const asyncHelper = new MochaAsyncTestHelper();

// Suite 1
asyncHelper.testSuite(() => {

  describe('SWAPI Suite 1', function() { // NOTE: To allow access to the mochaCtx (i.e. this), our callback CANNOT be an arrow function (per mocha doc)

    asyncHelper.suiteContext(this);

    let people   = null;
    let asyncErr = null;

    before( asyncComplete => {

      fetch('http://swapi.co/api/people')
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

    it('Should succeed', () => {
      // expect(1).toEqual(2); // ?? flip this to fail test
      expect(people).toExist();
      expect(asyncErr).toNotExist();
    });

    it('Really succeed', () => {
      expect(people).toExist();
      expect(asyncErr).toNotExist();
    });

    it('Really Really succeed', () => {
      expect(people).toExist();
      expect(asyncErr).toNotExist();
    });
  });
});


// Suite 2
asyncHelper.testSuite(() => {

  describe('SWAPI Suite 2', function() { // NOTE: To allow access to the mochaCtx (i.e. this), our callback CANNOT be an arrow function (per mocha doc)

    asyncHelper.suiteContext(this);

    let people   = null;
    let asyncErr = null;

    before( asyncComplete => {

      fetch('http://swapi.co/api/people')
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

    it('Should succeed', () => {
      // expect(1).toEqual(2); // ?? flip this to fail test
      expect(people).toExist();
      expect(asyncErr).toNotExist();
    });

    it('Really succeed', () => {
      expect(people).toExist();
      expect(asyncErr).toNotExist();
    });

    it('Really Really succeed', () => {
      expect(people).toExist();
      expect(asyncErr).toNotExist();
    });
  });
});

// start the ball rolling
asyncHelper.startTesting();
