'use strict';

import '../../../shared/util/polyfill';
import expect       from 'expect';
import {AT, AC}     from '../actions';
import getActionLog from '../getActionLog';


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

  // NOTE: Utilize a AT/AC that has an intermediate placeholder node
  //       ... detailStudent:                    thunk
  //           detailStudent.retrieve:           intermediate placeholder node
  //           detailStudent.retrieve.start:     action-object
  //           detailStudent.retrieve.complete:  action-object
  //           detailStudent.retrieve.fail:      action-object

  it("AT.detailStudent same-as AT['detailStudent'] (a thunk)", () => {
    expect(AT.detailStudent)
             .toBe(AT['detailStudent'])
             .toBeA('object') // a String object
             .toEqual('detailStudent');
  });

  it("AC.detailStudent same-as AC['detailStudent'] (a thunk)", () => {
    expect(AC.detailStudent)
             .toBe(AC['detailStudent'])
             .toBeA('function'); // a thunk
  });

  it("AT.detailStudent.retrieve same-as AT['detailStudent.retrieve'] (an intermediate node)", () => {
    expect(AT.detailStudent.retrieve)
             .toBe(AT['detailStudent.retrieve'])
             .toBeA('object');  // an intermediate node
  });

  it("AC.detailStudent.retrieve same-as AC['detailStudent.retrieve'] (an intermediate node)", () => {
    expect(AC.detailStudent.retrieve)
             .toBe(AC['detailStudent.retrieve'])
             .toBeA('object');  // an intermediate node
  });

  // check ALL 3 of the bottom nodes
  for (const node of ['start', 'complete', 'fail']) {
    it(`AT.detailStudent.retrieve.${node} same-as AT['detailStudent.retrieve.${node}'] (an action-object)`, () => {
      expect(AT.detailStudent.retrieve[node])
               .toBe(AT[`detailStudent.retrieve.${node}`])
               .toBeA('object') // a String object
               .toEqual(`detailStudent.retrieve.${node}`);
    });

    it(`AC.detailStudent.retrieve.${node} same-as AC['detailStudent.retrieve.${node}'] (an action-object)`, () => {
      expect(AC.detailStudent.retrieve[node])
               .toBe(AC[`detailStudent.retrieve.${node}`])
               .toBeA('function');  // an action-creator
    });
  }

});


describe('test getActionLog(actionType)', () => {

  it('getActionLog() should work equally well with String vs. string', () => {
    expect(getActionLog('selCrit.edit.close'))
      .toBe(getActionLog(new String('selCrit.edit.close')));
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
