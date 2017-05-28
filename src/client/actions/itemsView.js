import {generateActions} from 'action-u';
import assert            from 'assert';
import SelCrit           from '../../shared/domain/SelCrit';
import itemTypes         from '../../shared/domain/itemTypes';


/**
 * @constant {app-node} 'itemsView'
 * @function
 * @description Actions rooted in 'itemsView' (items in view).
 */
export default generateActions.root({

  /**
   * @function 'itemsView'
   *
   * @description
   * Retrieve and/or activate the itemsView for the specified
   * itemType.  Use this action when you wish to do BOTH
   * retrieve/activate.
   *
   * @intent #byUser, #noReducer
   *
   * @param {string} itemType the itemType ('student'/'course').
   *
   * @param {any} [retrieve=.null] the retrieval directive, one of:
   * <ul>
   *   <li> null:        no retrieval at all (DEFAULT)</li>
   *   <li> SelCrit:     conditionally retrieve items when supplied selCrit is different (or out-of-date) from ItemsView selCrit</li>
   *   <li> 'refresh':   unconditionally refresh ItemsView with latest items (using view's current selCrit)</li>
   * </ul>
   *
   * @param {string} [activate=see desc]: an activate directive, one of:
   * <ul>
   *   <li> 'activate':    activate/visualize this itemType ItemsView (DEFAULT for all but 'refresh' retrieval)</li>
   *   <li> 'no-activate': DO NOT activate                            (DEFAULT for 'refresh' retrieval)</li>
   * </ul>
   * 
   * @return {Action}
   */
  itemsView: {
               actionMeta: {
                 traits: ['itemType', 'retrieve', 'activate'],
                 ratify(itemType,
                        retrieve=null,
                        activate=retrieve!=='refresh' ? 'activate' : 'no-activate') {
                   assert(itemTypes[itemType],
                          `actions.itemsView() Invalid itemType param: ${FMT(itemType)}`);
                   assert(retrieve === null      ||
                          retrieve === 'refresh' ||
                          SelCrit.isSelCrit(retrieve),
                          `actions.itemsView() Invalid retrieve param: ${FMT(retrieve)}`);
                   assert(activate === 'activate' ||
                          activate === 'no-activate',
                          `actions.itemsView() Invalid activate param: ${FMT(activate)}`);
                   return [itemType, retrieve, activate];
                 }
               },

    /**
     * @function 'itemsView.retrieve'
     *
     * @description
     * Retrieve the Items View for the specified itemType.
     *
     * @intent #byUser, #byLogic, #reducer(spinner only)
     *
     * @param {string} itemType the itemType ('student'/'course').
     *
     * @param {any} selCrit the selCrit driving the retrieval, one of:
     * <ul>
     *   <li>SelCrit:   conditionally retrieve items when supplied selCrit is different (or out-of-date) from ItemsView selCrit</li>
     *   <li>'refresh': unconditionally refresh ItemsView with latest items (using view's current selCrit)</li>
     * </ul>
     * 
     * @return {Action}
     */
    retrieve: {
                actionMeta: {
                  traits: ['itemType', 'selCrit'],
                  ratify(itemType, selCrit) {
                    assert(itemTypes[itemType],
                           `actions.itemsView.retrieve() Invalid itemType param: ${FMT(itemType)}`);
                    assert(selCrit === 'refresh' ||
                           SelCrit.isSelCrit(selCrit),
                           `actions.itemsView.retrieve() Invalid selCrit param: ${FMT(selCrit)}`);
                    return [itemType, selCrit];
                  }
                },

      /**
       * @function 'itemsView.retrieve.complete'
       *
       * @description
       * Retrieval completed of items for the Items View.
       *
       * @intent #byLogic, #reducer
       *
       * @param {string} itemType the itemType ('student'/'course').
       *
       * @param {any} selCrit the selCrit driving the retrieval, one of:
       * <ul>
       *   <li>SelCrit:     conditionally retrieve items when supplied selCrit is different (or out-of-date) from ItemsView selCrit</li>
       *   <li>'refresh':   unconditionally refresh ItemsView with latest items (using view's current selCrit)</li>
       * </ul>
       *
       * @param {Item[]} items the items retrieved.
       * 
       * @return {Action}
       */
      complete: {
                  actionMeta: {
                    traits: ['itemType', 'selCrit', 'items'],
                  },
      },

      /**
       * @function 'itemsView.retrieve.fail'
       *
       * @description
       * Retrieval failed of items for the Items View.
       *
       * @intent #byLogic, #reducer(spinner only)
       *
       * @param {string} itemType the itemType ('student'/'course').
       *
       * @param {any} selCrit the selCrit driving the retrieval, one of:
       * <ul>
       *   <li>SelCrit:     conditionally retrieve items when supplied selCrit is different (or out-of-date) from ItemsView selCrit</li>
       *   <li>'refresh':   unconditionally refresh ItemsView with latest items (using view's current selCrit)</li>
       * </ul>
       *
       * @param {Error} error the Error detailing the failure.
       * 
       * @return {Action}
       */
      fail: {
              actionMeta: {
                traits: ['itemType', 'selCrit', 'err'],
              },
      },

    }, // end of ... retrieve

    /**
     * @function 'itemsView.activate'
     *
     * @description
     * Activate the Items View for the specified itemType.
     *
     * @intent #byUser, #byLogic, #reducer
     *
     * @param {string} itemType the itemType ('student'/'course').
     * 
     * @return {Action}
     */
    activate: {
                actionMeta: {
                  traits: ['itemType'],
                },
    },

  } // end of ... itemsView
});
