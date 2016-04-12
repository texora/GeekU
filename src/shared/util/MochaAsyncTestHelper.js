'use strict'

/**
 * MochaAsyncTestHelper is a Mocha test utility class that simplifies
 * running multiple reliant async test suites sequentially.
 *
 * As an example, consider an integration test of a rest service.  We
 * may wish to insert some data, and validate it through a subsequent
 * retrieval.  The rest service dictates an asynchronous test.  The
 * first suite (i.e. describe()) will insert the data, and the second
 * suite will retrieve and validate the data just inserted.  The second
 * suite can must wait on the first suite to successfully complete.
 *
 * Each test suite is run in sequence, providing there are no test
 * failures.  A test failure will stop subsequent suites from running.
 *
 * Usage:
 *
 *   - Within the global scope or your test, create a MochaAsyncTestHelper
 *     instance.
 *   
 *   - Wrap each test suite (i.e. describe()) with a function registered
 *     to the MochaAsyncTestHelper instance, using the testSuite(suiteFn)
 *     method.
 *   
 *   - Within each test suite, register the Mocha Context, using the 
 *     suiteContext(mochaCtx) method, supporting the execution hooks
 *     of each suite.
 *
 *   - To kick off the entire process off, simply invoke the startTesting() 
 *     method, within your test's global scope.
 *
 * Here is a complete example: 
 *
 *   import MochaAsyncTestHelper from 'src/shared/util/MochaAsyncTestHelper';
 *   
 *   const asyncHelper = new MochaAsyncTestHelper();
 *   
 *   // Our First Suite
 *   asyncHelper.testSuite(() => {
 *   
 *     describe('First Suite', function() { // NOTE: To allow access to the mochaCtx (i.e. this), our callback CANNOT be an arrow function (per mocha doc)
 *   
 *       asyncHelper.suiteContext(this);
 *   
 *       ... normal Mocha hooks: before/beforeEach/after/afterEach/it/etc.
 *   
 *     });
 *   });
 *   
 *   // Our Second Suite
 *   asyncHelper.testSuite(() => {
 *   
 *     describe('Second Suite', function() { // NOTE: To allow access to the mochaCtx (i.e. this), our callback CANNOT be an arrow function (per mocha doc)
 *   
 *       asyncHelper.suiteContext(this);
 *   
 *       ... normal Mocha hooks: before/beforeEach/after/afterEach/it/etc.
 *   
 *     });
 *   });
 *   
 *  ... etc.
 * 
 *  // start the ball rolling
 *  asyncHelper.startTesting();
 *
 */
class MochaAsyncTestHelper {

  /**
   * Construct a new MochaAsyncTestHelper instance.
   * @api public
   */
  constructor() {
    this._testSuites       = []; // {function[]}
    this._curTestSuiteIndx = 0;  // {int}
  }

  /**
   * Register another test suite, that will be run in sequence.
   *
   * @param {function} suiteFn the test suite function to register
   *
   * @api public
   */
  testSuite(suiteFn) {
    this._testSuites.push(suiteFn);
  }

  /**
   * Register the test suite mocha context, providing the execution
   * hooks of each suite.  This should be invoked for each suite
   * (i.e. describe());
   *
   * @param {Context} mochaCtx the Mocha context to register.
   *
   * @api public
   */
  suiteContext(mochaCtx) {

    // register our before hook to simply log that we are executing the suite
    mochaCtx.beforeAll('MochaAsyncTestHelper Before Hook', () => {
      console.log(`INFO: MochaAsyncTestHelper Running Suite: '${mochaCtx.title}'`);
    });

    // register our after hook to conditionally execute the next suite (on test success)
    mochaCtx.afterAll('MochaAsyncTestHelper After Hook', () => {

      // determine if any of our suite tests failed
      let failedTest = null;
      for (let test of mochaCtx.tests) {
        if (test.state !== 'passed') {
          failedTest = test;
          break;
        }
      }
      // execute our next suite, ONLY on test success
      if (failedTest) {
        console.log(`WARN: MochaAsyncTestHelper Stopping Suite Sequence at: '${mochaCtx.title}', BECAUSE there were test failures in '${failedTest.title}'!`);
      }
      else {
        this.runNextTestSuite();
      }
    });

  }


  /**
   * Kick off the entire process.
   * @api public
   */
  startTesting() {
    this.runNextTestSuite();
  }


  /**
   * Run the next test suite in sequence (i.e. order of registration).
   * @api private
   */
  runNextTestSuite() {
    // locate our next test suite to run
    const nextTestSuite = this._testSuites[this._curTestSuiteIndx++];

    // no-op if we have exhausted all our testSuites
    if (!nextTestSuite) {
      return;
    }

    // run the next test suite
    nextTestSuite();
  }

}

export default MochaAsyncTestHelper
