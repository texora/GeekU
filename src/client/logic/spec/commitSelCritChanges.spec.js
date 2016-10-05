'use strict';

import '../../../shared/util/polyfill';
import '../../startup/Log4GeekU'; // configure logs for GeekUApp (NOTE: include VERY early in our start-up process)
import expect               from 'expect';
import commitSelCritChanges from '../commitSelCritChanges';
import SelCrit              from '../../../shared/domain/SelCrit';
import itemTypes            from '../../../shared/domain/itemTypes';
import {AC, AT}             from '../../../client/actions';

describe('logic commitSelCritChanges', () => {

  describe('new selCrit', () => {

    let   dispatch;
    const syncDirective = SelCrit.SyncDirective.default;

    // mock our selCrit (within our appState)
    const selCrit = SelCrit.new(itemTypes.student);
    selCrit.desc    = 'desc (making fully valid)';

    beforeEach( () => {

      // mock our action (only used action.type to obtain log entry)
      const action = {
        type: AT.selCrit.edit.use.valueOf(),
      };

      // mock our appState
      const getState = () => ({
        editSelCrit: {
          selCrit,
          extra: {
            isNew: true,
            syncDirective,
          }
        }
      });

      // monitor our dispatch invocations
      dispatch = expect.createSpy();

      // invoke our logic module under test
      commitSelCritChanges.process( {getState, action}, dispatch);
    });

    it('should invoke dispatch twice', () => {
      expect(dispatch.calls.length).toBe(2);
    });

    it('first dispatch action should be AT.selCrit.changed with supplied syncDirective', () => {
      expect(dispatch.calls.length).toBe(2);
      const dispatchArgs = dispatch.calls[0].arguments;
      const expectedAction = AC.selCrit.changed(selCrit, syncDirective);
      expect(dispatchArgs[0]).toEqual(expectedAction);
    });

    it('second dispatch action should be AT.selCrit.edit.close', () => {
      expect(dispatch.calls.length).toBe(2);
      const dispatchArgs = dispatch.calls[1].arguments;
      const expectedAction = AC.selCrit.edit.close();
      expect(dispatchArgs[0]).toEqual(expectedAction);
    });

  });



  describe('changed selCrit', () => {

    let   dispatch;
    const syncDirective = SelCrit.SyncDirective.default;

    // mock our selCrit (within our appState)
    const selCrit = SelCrit.new(itemTypes.student);
    selCrit.desc    = 'desc (making fully valid)';

    beforeEach( () => {

      // mock our action (only used action.type to obtain log entry)
      const action = {
        type: AT.selCrit.edit.use.valueOf(),
      };

      // mock our appState
      const getState = () => ({
        editSelCrit: {
          selCrit,
          extra: {
            isNew:           false,
            startingCurHash: 'changedHash',
            syncDirective,
          }
        }
      });

      // monitor our dispatch invocations
      dispatch = expect.createSpy();

      // invoke our logic module under test
      commitSelCritChanges.process( {getState, action}, dispatch);
    });

    it('should invoke dispatch twice', () => {
      expect(dispatch.calls.length).toBe(2);
    });

    it('first dispatch action should be AT.selCrit.changed with supplied syncDirective', () => {
      expect(dispatch.calls.length).toBe(2);
      const dispatchArgs = dispatch.calls[0].arguments;
      const expectedAction = AC.selCrit.changed(selCrit, syncDirective);
      expect(dispatchArgs[0]).toEqual(expectedAction);
    });

    it('second dispatch action should be AT.selCrit.edit.close', () => {
      expect(dispatch.calls.length).toBe(2);
      const dispatchArgs = dispatch.calls[1].arguments;
      const expectedAction = AC.selCrit.edit.close();
      expect(dispatchArgs[0]).toEqual(expectedAction);
    });

  });



  describe('un-changed selCrit', () => {

    let   dispatch;
    const syncDirective = SelCrit.SyncDirective.default;

    // mock our selCrit (within our appState)
    const selCrit = SelCrit.new(itemTypes.student);
    selCrit.desc    = 'desc (making fully valid)';

    beforeEach( () => {

      // mock our action (only used action.type to obtain log entry)
      const action = {
        type: AT.selCrit.edit.use.valueOf(),
      };

      // mock our appState
      const getState = () => ({
        editSelCrit: {
          selCrit,
          extra: {
            isNew:           false,
            startingCurHash: selCrit.curHash, // same hash
            syncDirective,
          }
        }
      });

      // monitor our dispatch invocations
      dispatch = expect.createSpy();

      // invoke our logic module under test
      commitSelCritChanges.process( {getState, action}, dispatch);
    });

    it('should invoke dispatch one time', () => {
      expect(dispatch.calls.length).toBe(1);
    });

    it('only dispatch action should be AT.selCrit.edit.close', () => {
      expect(dispatch.calls.length).toBe(1);
      const dispatchArgs = dispatch.calls[0].arguments;
      const expectedAction = AC.selCrit.edit.close();
      expect(dispatchArgs[0]).toEqual(expectedAction);
    });
  });

});
