'use strict';

import '../../../shared/util/polyfill';
import expect                 from 'expect';
import {AT, AC, getActionLog} from '../actions';


// ***
// *** action-creator tests ...
// ***

describe('action-creator tests: AC.userMsg', () => {

  it('test userMsg.display(msg) ... success', () => {
    expect(AC.userMsg.display("MyMsg"))
             .toEqual({
               type:       AT.userMsg.display,
               msg:        "MyMsg",
               userAction: undefined,
             });
  });

  it('test userMsg.display() ... missing msg param', () => {
    expect(()=>AC.userMsg.display())
                 .toThrow("ERROR: Action Creator AC.userMsg.display('undefined') ... requires a msg string param");
  });

  it('test userMsg.display() ... non-string msg param', () => {
    expect(()=>AC.userMsg.display({}))
                 .toThrow("ERROR: Action Creator AC.userMsg.display('[object Object]') ... requires a msg string param");
  });

  it('test userMsg.display(msg, userAction) ... success)', () => {
    const userAction = {
      txt:      'userAction',
      callback: () => {},
    };
    expect(AC.userMsg.display("MyMsg", userAction))
             .toEqual({
               type:       AT.userMsg.display,
               msg:        "MyMsg",
               userAction
             });
  });

  it('test userMsg.display(msg, userAction) ... missing userAction.txt)', () => {
    const userAction = {
    //txt:      'userAction',
    //callback: () => {},
    };
    expect(()=>AC.userMsg.display("MyMsg", userAction))
                 .toThrow("ERROR: Action Creator AC.userMsg.display('MyMsg', {}) ... userAction param requires a .txt string property");
  });

  it('test userMsg.display(msg, userAction) ... non-string userAction.txt)', () => {
    const userAction = {
      txt:      123,
    //callback: () => {},
    };
    expect(()=>AC.userMsg.display("MyMsg", userAction))
                 .toThrow("ERROR: Action Creator AC.userMsg.display('MyMsg', {\"txt\":123}) ... userAction param requires a .txt string property");
  });

  it('test userMsg.display(msg, userAction) ... missing userAction.callback)', () => {
    const userAction = {
      txt:      'userAction',
    //callback: () => {},
    };
    expect(()=>AC.userMsg.display("MyMsg", userAction))
      .toThrow("ERROR: Action Creator AC.userMsg.display('MyMsg', {\"txt\":\"userAction\"}) ... userAction param requires a .callback function property");
  });

  it('test userMsg.display(msg, userAction) ... non-function userAction.callback)', () => {
    const userAction = {
      txt:      'userAction',
      callback: 'poop',
    };
    expect(()=>AC.userMsg.display("MyMsg", userAction))
      .toThrow("ERROR: Action Creator AC.userMsg.display('MyMsg', {\"txt\":\"userAction\",\"callback\":\"poop\"}) ... userAction param requires a .callback function property");
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
