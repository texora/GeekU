'use strict';

import '../../../shared/util/polyfill';
import '../../startup/Log4GeekU'; // configure logs for GeekUApp (NOTE: include VERY early in our start-up process)
import expect                  from 'expect';
import processDetailItemAction from '../processDetailItemAction';
import itemTypes               from '../../../shared/domain/itemTypes';
import actions                 from '../../../client/actions';


describe('logic processDetailItemAction', () => {

  describe('test successful api retrieval', () => {

    let   dispatch;
    const itemType = itemTypes.student;
    const itemNum  = 'itemNum';
    const editMode = true;
    const action   = actions.detailItem(itemType, itemNum, editMode);
    const testItem = { myTestItem: 123 };

    beforeEach( (asyncDone) => {
      // mock out our api
      const api = {
        items: {
          retrieveItemDetail(itemTypeParam, itemNumParam, logParam) {
            expect(itemTypeParam).toBe(itemType);
            expect(itemNumParam).toBe(itemNum);
            return new Promise((resolve, reject) => {
              resolve(testItem);
            });
          }
        }
      };

      // monitor our dispatch invocations
      dispatch = expect.createSpy().andCall(() => asyncDone());

      // invoke our logic module under test
      processDetailItemAction.process( {action, api}, dispatch);
    });

    it('dispatched action should be actions.detailItem.retrieve.complete with supplied action data', () => {
      expect(dispatch.calls.length).toBe(1);
      const dispatchArgs   = dispatch.calls[0].arguments;
      const expectedAction = actions.detailItem.retrieve.complete(itemType, testItem, editMode);
      expect(dispatchArgs[0]).toEqual(expectedAction);
    });

  });



  describe('test ERROR in api retrieval', () => {

    let   dispatch;
    const itemType = itemTypes.student;
    const itemNum  = 'itemNum';
    const editMode = true;
    const action   = actions.detailItem(itemType, itemNum, editMode);
    const testErr  = new Error('Simulated error in retrieval');

    beforeEach( (asyncDone) => {
      // mock out our api
      const api = {
        items: {
          retrieveItemDetail(itemTypeParam, itemNumParam, logParam) {
            expect(itemTypeParam).toBe(itemType);
            expect(itemNumParam).toBe(itemNum);
            return new Promise((resolve, reject) => {
              reject(testErr);
            });
          }
        }
      };

      // monitor our dispatch invocations
      dispatch = expect.createSpy().andCall(() => asyncDone());

      // invoke our logic module under test
      processDetailItemAction.process( {action, api}, dispatch);
    });

    it('dispatched action should be actions.detailItem.retrieve.fail with supplied action data', () => {
      expect(dispatch.calls.length).toBe(1);
      const dispatchArgs   = dispatch.calls[0].arguments;
      const expectedAction = actions.detailItem.retrieve.fail(itemType, itemNum, editMode, testErr);
      expect(dispatchArgs[0]).toEqual(expectedAction);
    });

  });

});
