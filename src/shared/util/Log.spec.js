'use strict';

import './polyfill.js';
import expect from 'expect';
import Log    from './Log';

let _logOutput = '';
function captureLogOutput(msgProbe) {
  _logOutput = msgProbe;
}
function resetLogOutput() {
  _logOutput = '';
}

function testOutput(log, expectedEmit, levelName) {
  function genLogs() {
    const msg = `${levelName} msg`;
    const logFn = log[levelName.toLowerCase()].bind(log); // ... ex: log.info
    logFn(()=> msg );
    return msg;
  }
  if (expectedEmit) {
    it(`${levelName} should be emitted`, () => {
      const msg = genLogs();
      expect(_logOutput).toInclude(msg);
    });
  }
  else {
    it(`${levelName} should be dropped`, () => {
      const msg = genLogs();
      expect(_logOutput).toEqual('');
    });
  }
}

describe('Log Tests', () => {

  before( () => {
    Log.config({
      outputHandler: captureLogOutput
    });
  });

  beforeEach( () => {
    resetLogOutput();
  });

  afterEach( () => {
    resetLogOutput();
  });

  describe('Test out-of-box settings', () => {

    let log = new Log('parent.child');
    testOutput(log, false, 'TRACE');
    testOutput(log, false, 'DEBUG');
    testOutput(log, true,  'INFO');
    testOutput(log, true,  'WARN');
    testOutput(log, true,  'ERROR');
    testOutput(log, true,  'FATAL');
  });

  describe('Test filter inheritance', () => {

    let log = new Log('parent.child');

    before( () => {
      Log.config({
        filter: {
          'parent': Log.DEBUG
        }
      });
    });

    testOutput(log, false, 'TRACE');
    testOutput(log, true,  'DEBUG');
    testOutput(log, true,  'INFO');
    testOutput(log, true,  'WARN');
    testOutput(log, true,  'ERROR');
    testOutput(log, true,  'FATAL');
  });

  describe('Test more complex filter inheritance', () => {

    let logParent = new Log('parent');
    let logChild  = new Log('parent.child');

    before( () => {
      Log.config({
        filter: {
          'root':         Log.FATAL,
          'parent':       null,
          'parent.child': Log.ERROR
        }
      });
    });

    testOutput(logChild, false, 'TRACE');
    testOutput(logChild, false, 'DEBUG');
    testOutput(logChild, false, 'INFO');
    testOutput(logChild, false, 'WARN');
    testOutput(logChild, true,  'ERROR');
    testOutput(logChild, true,  'FATAL');

    testOutput(logParent, false, 'TRACE');
    testOutput(logParent, false, 'DEBUG');
    testOutput(logParent, false, 'INFO');
    testOutput(logParent, false, 'WARN');
    testOutput(logParent, false, 'ERROR');
    testOutput(logParent, true,  'FATAL');
  });

  // TODO: test Error veto of probe WITH excludeClientErrors
  // TODO: test object output (plain obj, date, Error)

  // TODO: test various config settings (rather involved)
  // ?? here is some fmt config changes
  // ? const curFmt = Log.config().format;
  // ? Log.config({
  // ?   format: {
  // ?     // formats everything on one line:
  // ?     // fmtProbe:     (filterName, levelName, msgFn, obj)=>`${curFmt.fmtLevel(levelName)} ${curFmt.fmtTimeStamp()} ${curFmt.fmtFilter(filterName)}: ${curFmt.fmtMsg(msgFn)}${curFmt.fmtObj(obj)}`
  // ? 
  // ?     //fmtLevel:     (levelName) => levelName+'_poop',
  // ?     //fmtTimeStamp: () => 'poop_time',
  // ?     //fmtFilter:    (filterName) => filterName+'_poop',
  // ?     //fmtMsg:       (msgFn) => `poop_${msgFn()}`
  // ?   }
  // ? });



  describe('Test Log exception conditions', () => {

    it('Log() constructor requires a filterName param', () => {
      expect( () => {
        new Log();
      }).toThrow(/contructor requires *. filterName/);
    });

    it('Log() constructor requires a filterName param of type string', () => {
      expect( () => {
        new Log({});
      }).toThrow(/contructor requires *. filterName .* type string/);
    });

    // TODO: test various config assertions
  });



});
