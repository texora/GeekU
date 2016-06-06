'use strict';

import '../../../shared/util/polyfill';
import expect                 from 'expect';
import {AT, AC, getActionLog} from '../actions';


// ***
// *** action-creator tests ...
// ***

describe('action-creator tests', () => {

  it('test userMsg.display(msg) (sampling of machine-generated action-creator)', () => {
    expect(AC.userMsg.display("MyMsg"))
             .toEqual({
               type: AT.userMsg.display,
               msg:  "MyMsg",
             });
  });

});

describe('insure AT/AC constants utilize federated namespace', () => {

  it("AT.retrieveStudents.start same-as AT['retrieveStudents.start']", () => {
    expect(AT.retrieveStudents.start)
             .toBe(AT['retrieveStudents.start']);
  });

  it("AT.retrieveStudents.start same-as 'retrieveStudents.start'", () => {
    expect(AT.retrieveStudents.start)
             .toEqual('retrieveStudents.start')
             .toNotBe('retrieveStudents.start');
  });

  it("AC.retrieveStudents.start same-as AC['retrieveStudents.start']", () => {
    expect(AC.retrieveStudents.start)
             .toBe(AC['retrieveStudents.start']);
  });

  it("AT.retrieveStudents same-as 'retrieveStudents' (dual usage intermediate node)", () => {
    expect(AT.retrieveStudents)
             .toEqual('retrieveStudents')
             .toNotBe('retrieveStudents');
  });

});


describe('test getActionLog(actionType)', () => {

  it('getActionLog() should work equally well sith String vs. string', () => {
    expect(getActionLog('retrieveStudents.start'))
           .toBe(getActionLog(new String('retrieveStudents.start')));
  });

});

describe('GeekU AT/AC federated namespace relys on String object containing properties [simply demonstrate JS features in this regard]', () => {

  const strObj   = new String('test String props');
  strObj.subProp = new String('subProp');

  it('strObj string literal check', () => {
    expect(strObj)
          .toEqual('test String props')
          .toNotBe('test String props');
  });

  it('strObj.subProp string literal check', () => {
    expect(strObj.subProp)
          .toEqual('subProp')
          .toNotBe('subProp');
  });

  it('String.valueOf() allows === check', () => {
    expect(strObj.valueOf())
          .toBe('test String props');
  });

  it('indexing String/string ... AT[string] === AT[String]', () => {
    expect(AT['userMsg.display'])
           .toBe(AT[new String('userMsg.display')]);
  });

});
