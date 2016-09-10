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
                 .toThrow("requires a msg string param");
  });

  it('test userMsg.display() ... non-string msg param', () => {
    expect(()=>AC.userMsg.display({}))
                 .toThrow("requires a msg string param");
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
                 .toThrow("userAction param requires a .txt string property");
  });

  it('test userMsg.display(msg, userAction) ... non-string userAction.txt)', () => {
    const userAction = {
      txt:      123,
    //callback: () => {},
    };
    expect(()=>AC.userMsg.display("MyMsg", userAction))
                 .toThrow("userAction param requires a .txt string property");
  });

  it('test userMsg.display(msg, userAction) ... missing userAction.callback)', () => {
    const userAction = {
      txt:      'userAction',
    //callback: () => {},
    };
    expect(()=>AC.userMsg.display("MyMsg", userAction))
      .toThrow("userAction param requires a .callback function property");
  });

  it('test userMsg.display(msg, userAction) ... non-function userAction.callback)', () => {
    const userAction = {
      txt:      'userAction',
      callback: 'poop',
    };
    expect(()=>AC.userMsg.display("MyMsg", userAction))
      .toThrow("userAction param requires a .callback function property");
  });

});

describe('insure AT/AC constants utilize federated namespace', () => {

  // NOTE: Utilize a AT/AC that has an intermediate placeholder node
  //       ... selCrit:                intermediate placeholder node
  //           selCrit.save:           thunk
  //           selCrit.save.start:     action-object
  //           selCrit.save.complete:  action-object
  //           selCrit.save.fail:      action-object

  it("AT.selCrit same-as AT['selCrit'] (an intermediate node)", () => {
    expect(AT.selCrit)
             .toBe(AT['selCrit'])
             .toBeA('object');  // an intermediate node
  });
  
  it("AC.selCrit same-as AC['selCrit'] (an intermediate node)", () => {
    expect(AC.selCrit)
             .toBe(AC['selCrit'])
             .toBeA('object');  // an intermediate node
  });

  it("AC.selCrit.save same-as AC['selCrit.save'] (a thunk)", () => {
    expect(AC.selCrit.save)
             .toBe(AC['selCrit.save'])
             .toBeA('function'); // a thunk
  });

  it("AT.selCrit.save same-as AT['selCrit.save'] (a thunk)", () => {
    expect(AT.selCrit.save)
             .toBe(AT['selCrit.save'])
             .toBeA('object');
  });

  // check ALL 3 of the bottom nodes
  for (const node of ['start', 'complete', 'fail']) {
    it(`AT.selCrit.save.${node} same-as AT['selCrit.save.${node}'] (an action-object)`, () => {
      expect(AT.selCrit.save[node])
               .toBe(AT[`selCrit.save.${node}`])
               .toBeA('object') // a String object
               .toEqual(`selCrit.save.${node}`);
    });

    it(`AC.selCrit.save.${node} same-as AC['selCrit.save.${node}'] (an action-object)`, () => {
      expect(AC.selCrit.save[node])
               .toBe(AC[`selCrit.save.${node}`])
               .toBeA('function');  // an action-creator
    });
  }

});


describe('test getActionLog(actionType)', () => {

  it('getActionLog() should work equally well with String vs. string', () => {
    expect(getActionLog('selCrit.edit.complete'))
      .toBe(getActionLog(new String('selCrit.edit.complete')));
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
