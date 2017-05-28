import '../../../shared/util/polyfill';
import expect   from 'expect';
import actions  from '../../actions';

// ***
// *** action-creator tests ...
// ***

describe('action-creator tests: actions.userMsg', () => {

  it('test userMsg.display(msg) ... success', () => {
    expect(actions.userMsg.display("MyMsg"))
      .toEqual({
        type:       String(actions.userMsg.display),
        msg:        "MyMsg",
        userAction: undefined,
      });
  });

  it('test userMsg.display() ... missing msg param', () => {
    expect(()=>actions.userMsg.display())
      .toThrow("requires a msg string param");
  });

  it('test userMsg.display() ... non-string msg param', () => {
    expect(()=>actions.userMsg.display({}))
      .toThrow("requires a msg string param");
  });

  it('test userMsg.display(msg, userAction) ... success)', () => {
    const userAction = {
      txt:      'userAction',
      callback: () => {},
    };
    expect(actions.userMsg.display("MyMsg", userAction))
      .toEqual({
        type:       String(actions.userMsg.display),
        msg:        "MyMsg",
        userAction
      });
  });

  it('test userMsg.display(msg, userAction) ... missing userAction.txt)', () => {
    const userAction = {
    //txt:      'userAction',
    //callback: () => {},
    };
    expect(()=>actions.userMsg.display("MyMsg", userAction))
      .toThrow("userAction param requires a .txt string property");
  });

  it('test userMsg.display(msg, userAction) ... non-string userAction.txt)', () => {
    const userAction = {
      txt:      123,
    //callback: () => {},
    };
    expect(()=>actions.userMsg.display("MyMsg", userAction))
      .toThrow("userAction param requires a .txt string property");
  });

  it('test userMsg.display(msg, userAction) ... missing userAction.callback)', () => {
    const userAction = {
      txt:      'userAction',
    //callback: () => {},
    };
    expect(()=>actions.userMsg.display("MyMsg", userAction))
      .toThrow("userAction param requires a .callback function property");
  });

  it('test userMsg.display(msg, userAction) ... non-function userAction.callback)', () => {
    const userAction = {
      txt:      'userAction',
      callback: 'poop',
    };
    expect(()=>actions.userMsg.display("MyMsg", userAction))
      .toThrow("userAction param requires a .callback function property");
  });

});
