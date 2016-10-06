'use strict'

import assert          from 'assert';
import SelCrit         from '../../shared/domain/SelCrit';
import itemTypes       from '../../shared/domain/itemTypes';
import generate_AT_AC  from './generate_AT_AC';


/**
 * Promote all actions used in our app ... both:
 *
 *   - AC: Action Creators
 *         A series of public functions that create actions.
 *         EX Usage:  AC.userMsg.display(msg): Action
 *         EX Action: { type: "userMsg.display", msg }
 *
 *   - AT: Action Types
 *         A series of Strings, representing our Action Types
 *         (used internally by our reducers [injected into each action]).
 *         EX: AT.userMsg.display = "userMsg.display"
 *
 *
 * IMPORTANT:
 *
 *   In order to gain a better understanding of any reactive application, it
 *   is important to fully understand it's emitted actions.  To that end,
 *   the following hash-tags are documented with each action:
 *
 *     #byUser:    dispatched by user action      (i.e. initiated directly from UI)
 *     #byLogic:   dispatched by app logic        (i.e. sourced from other actions)
 *     #reducer:   of interest to reducer         (i.e. state should change as a result)
 *     #noReducer: of NO real interest to reducer (i.e. used to stimulate logic)
 *
 *   As an example, the 'selCrit.edit.save' action is of no interest to
 *   reducers (#noReducer) because application logic monitoring this action
 *   will emit a more general action 'selCrit.changed' which provides
 *   a more central opportunity to maintain our state (#byLogic,
 *   #reducer).
 *
 *
 * NOTES: 
 *
 *   - To determine what Action Creators/Types are availble (AC/AT), simply interpret
 *     the genesis structure (below) as follows:
 *      * The genesis key is both the AC function name and the AT type
 *      * The genesis traits array represents both the AC function parameters
 *        and the AT action properties.
 *     EXAMPLE: 
 *      * The Action Creator:
 *          AC.userMsg.display(msg): Action
 *      * Generates the following Action:
 *          {
 *             type: 'userMsg.display',
 *             msg:  <supplied-param>
 *          }
 *
 *   - AC/AT may contain dots ('.') ... i.e. a federated namespace.
 *     In this case you may use one of two reference techniques
 *     ... the following are equivalent:
 *       * AC.userMsg.display('Hello World');
 *         AC['userMsg.display']('Hello World'); // SAME AS PRIOR LINE
 *       * AT.userMsg.display    // ... yeilds type: 'userMsg.display'
 *         AT['userMsg.display'] // ... SAME AS PRIOR LINE
 *
 *   - To support federated namespace, the action types (AT) utilize
 *     String objects, rather than native strings.
 *       * This allows an intermediate sub-type (String) to contain
 *         additional properties (i.e. more detailed types)
 *       * KEY: Because of this, you cannot rely on === semantics
 *         in compairing type strings.
 *         ... you can utilize === semantics with type.valueOf()
 *
 *
 * INTERNAL NOTES: 
 *
 *   This technique of creating AC/ATs has the following benefits:
 *   
 *    - The Action Creators (AC) 
 *      * Concisely defines all the actions you can perform within the app
 *      * Promotes and validates the exact set of expected parameters
 *        - by default, the correct number of parameters are validated
 *          ... here is an example error that is thrown if number of params are incorrect:
 *              ERROR: Action Creator AC.selCrit.edit(selCrit, isNew, syncDirective) expecting 3 parameters, but received 2
 *        - paramater types may be further validated/initialized through the 
 *          ratify() function.
 *      * Correctly constructs the action every time
 *   
 *    - The Action Types (AT):
 *      * Are consisely defined from the same definition
 *   
 *    - Minimal development effort in maintaining the AC/ATs
 */

const genesis = {

  // ***
  // *** Various User Notifications ...
  // ***

  /**
   * AC.userMsg.display(msg [,userAction]) ...
   *
   * Display a user message via Material UI Snackbar.
   *
   * NOTE: An alternate technique to activate a user message is through
   *       the static UserMsg.display(msg [, userAction]) method.  This
   *       may be preferred when you have no access to the dispatcher.
   *
   * @param {string} msg the message to display.
   *
   * @param {Obj} userAction an optional structure defining a user click action:
   *                {
   *                  txt:      'your-button-label-here',
   *                  callback: function(event) {
   *                    code-executed-on-button-click
   *                  }
   *                }
   */
  'userMsg.display': { traits: ['msg', 'userAction'],  // ... #byUser, #byLogic, #reducer
                       ratify(msg, userAction) {
                         const errPrefix = () => {
                           const userActionStr = userAction ? `, ${JSON.stringify(userAction)}` : '';
                           return `ERROR: AC.userMsg.display('${msg}'${userActionStr}) ...`;
                         };
                         assert(typeof msg === 'string', `${errPrefix()} requires a msg string param`);
                         if (userAction) {
                           assert(typeof userAction.txt      === 'string',   `${errPrefix()} userAction param requires a .txt string property`);
                           assert(typeof userAction.callback === 'function', `${errPrefix()} userAction param requires a .callback function property`);
                         }
                         return [msg, userAction];
                       }},
  'userMsg.close':   { traits: [] },  // ... #byLogic, #reducer


  // ***
  // *** Items View related
  // ***

  /**
   * AC.itemsView(itemType [, retrieve, activate]) ...
   *
   * Retrieve and/or activate the itemsView for the specified
   * itemType.  Use this action when you wish to do BOTH
   * retrieve/activate.
   *
   * @param {string} itemType the itemType ('student'/'course').
   *
   * @param {any} retrieve the retrieval directive, one of:
   *   - null:        no retrieval at all (DEFAULT)
   *   - SelCrit:     conditionally retrieve items when supplied selCrit is different (or out-of-date) from ItemsView selCrit
   *   - 'refresh':   unconditionally refresh ItemsView with latest items (using view's current selCrit)
   *
   * @param {string} activate: an activate directive, one of:
   *   - 'activate':    activate/visualize this itemType ItemsView (DEFAULT for all but 'refresh' retrieval)
   *   - 'no-activate': DO NOT activate                            (DEFAULT for 'refresh' retrieval)
   */
  'itemsView': { traits: ['itemType', 'retrieve', 'activate'], // ... #byUser, #noReducer
                 ratify(itemType,
                        retrieve=null,
                        activate=retrieve!=='refresh' ? 'activate' : 'no-activate') {
                   assert(itemTypes[itemType],
                          `AC.itemsView() Invalid itemType param: ${FMT(itemType)}`);
                   assert(retrieve === null      ||
                          retrieve === 'refresh' ||
                          SelCrit.isSelCrit(retrieve),
                          `AC.itemsView() Invalid retrieve param: ${FMT(retrieve)}`);
                   assert(activate === 'activate' ||
                          activate === 'no-activate',
                          `AC.itemsView() Invalid activate param: ${FMT(activate)}`);
                   return [itemType, retrieve, activate];
                 }},


  /**
   * AC.itemsView.retrieve(itemType, selCrit) ...
   *
   * Retrieve the Items View for the specified itemType.
   *
   * @param {string} itemType the itemType ('student'/'course').
   *
   * @param {any} selCrit the selCrit driving the retrieval, one of:
   *   - SelCrit:     conditionally retrieve items when supplied selCrit is different (or out-of-date) from ItemsView selCrit
   *   - 'refresh':   unconditionally refresh ItemsView with latest items (using view's current selCrit)
   */
  'itemsView.retrieve': { traits: ['itemType', 'selCrit'],  // ... #byUser, #byLogic, #reducer(spinner only)
                          ratify(itemType, selCrit) {
                            assert(itemTypes[itemType],
                                   `AC.itemsView.retrieve() Invalid itemType param: ${FMT(itemType)}`);
                            assert(selCrit === 'refresh' ||
                                   SelCrit.isSelCrit(selCrit),
                                   `AC.itemsView.retrieve() Invalid selCrit param: ${FMT(selCrit)}`);
                            return [itemType, selCrit];
                          }},
  'itemsView.retrieve.complete': { traits: ['itemType', 'selCrit', 'items'] }, // ... #byLogic, #reducer
  'itemsView.retrieve.fail':     { traits: ['itemType', 'selCrit', 'err'] },   // ... #byLogic, #reducer(spinner only)


  /**
   * AC.itemsView.activate(itemType) ...
   *
   * Activate the Items View for the specified itemType.
   *
   * @param {string} itemType the itemType ('student'/'course').
   */
  'itemsView.activate': { traits: ['itemType'] }, // ... #byUser, #byLogic, #reducer


  // ***
  // *** hovered item ...
  // ***

  /**
   * AC.hoverItem(itemType, item) ...
   *
   * The supplied item is being hovered over within an itemsView.
   *
   * @param {string} itemType the itemType ('student'/'course').
   * @param {any}    item the item that is hovered (null for none)
   */
  'hoverItem': { traits: ['itemType', 'item'] }, // ... #byUser, #reducer


  // ***
  // *** selected item ...
  // ***

  /**
   * AC.selectItem(itemType, item) ...
   *
   * Select an item within an itemsView.
   *
   * @param {string} itemType the itemType ('student'/'course').
   * @param {any}    item the item to select (null for de-select)
   */
  'selectItem': { traits: ['itemType', 'item'] }, // ... #byUser, #byLogic, #reducer


  // ***
  // *** detail item, after fresh retrieval, in a visual Dialog for either view/edit
  // ***

  /**
   * AC.detailItem(itemType, itemNum, editMode) ...
   *
   * Activate a dialog detailing (and/or editing) the supplied item.
   *
   * An up-to-date item image is retrieved prior to it's display.
   *
   * @param {string} itemType the itemType ('student'/'course').
   * @param {string} itemNum the item number to detail (studentNum/courseNum).
   * @param {boolean} editMode an indicator as to wheter the dialog
   * starts out in read-only (false) or edit-mode (true).
   */
  'detailItem':                       { traits: ['itemType', 'itemNum', 'editMode'] },        // ... #byUser,           #reducer(spinner only)
  'detailItem.retrieve.complete':     { traits: ['itemType', 'item',    'editMode'] },        // ...          #byLogic, #reducer
  'detailItem.retrieve.fail':         { traits: ['itemType', 'itemNum', 'editMode', 'err'] }, // ...          #byLogic, #reducer(spinner only)
  'detailItem.change.detailEditMode': { traits: ['itemType'] },                               // ... #byUser,           #reducer
  'detailItem.close':                 { traits: ['itemType'] },                               // ... #byUser,           #reducer


  // ***
  // *** filters (i.e. selCrit objects) ...
  // ***

  /**
   * AC.filters.retrieve() ...
   *
   * Retrieve filters ... a list of selCrit objects.
   */
  'filters.retrieve':          { traits: [] },          // ... #byLogic, #reducer(spinner only)
  'filters.retrieve.complete': { traits: ['filters'] }, // ... #byLogic, #reducer
  'filters.retrieve.fail':     { traits: ['err'] },     // ... #byLogic, #reducer(spinner only)


  // ***
  // *** edit selCrit (in interactive dialog)
  // ***

  /**
   * AC.selCrit.edit(selCrit' [, isNew, syncDirective]) ...
   *
   * Start an edit dialog session of the supplied selCrit.
   *
   * @param {SelCrit} selCrit the selCrit to edit.
   *
   * @param {boolean} isNew indicator as to whether the supplied selCrit
   * is new (true), or previously existed (false) ... DEFAULT: false
   *
   * @param {SelCrit.SyncDirective} syncDirective a directive that indicates
   * how selCrit changes should be synced in selCrit-based views
   * ... DEFAULT: SelCrit.SyncDirective.default
   */
  'selCrit.edit': { traits: ['selCrit', 'isNew', 'syncDirective'], // ... #byUser, #reducer
                    ratify(selCrit,
                           isNew=false,
                           syncDirective=SelCrit.SyncDirective.default) {
                      assert(SelCrit.isSelCrit(selCrit),
                             `AC.selCrit.edit() Invalid selCrit param: ${FMT(selCrit)}`);
                      assert(SelCrit.SyncDirective[syncDirective],
                             `AC.selCrit.edit() Invalid syncDirective param: ${FMT(syncDirective)}`);
                      return [selCrit, isNew, syncDirective];
                    }},

  // various selCrit attribute changes
  // ... #byUser, #reducer
  'selCrit.edit.change.name':   { traits: ['name'] },
  'selCrit.edit.change.desc':   { traits: ['desc'] },
  'selCrit.edit.change.fields': { traits: ['selectedFieldOptions'] },
  'selCrit.edit.change.sort':   { traits: ['selectedSortOptions'] },
  'selCrit.edit.change.filter': { traits: ['newFilter'] },
  'selCrit.edit.change.distinguishMajorSortField': { traits: ['value'] },

  // various ways to complete an edit session
  // ... use selCrit in edit session without persisting to DB
  //     (subject to validation)
  'selCrit.edit.use':   { traits: [] },         // ... #byUser,  #noReducer
  // ... save/use selCrit in edit session
  //     (subject to validation)
  'selCrit.edit.save':  { traits: [] },         // ... #byUser,  #noReducer
  // ... close out edit session dialog
  //     used BOTH to cancel edit session
  //     -or- complete edit session from use/save
  'selCrit.edit.close': { traits: [] },         // ... #byUser, #byLogic, #reducer


  // ***
  // *** central notification of selCrit change completion
  // ***

  /**
   * AC.selCrit.changed(selCrit [, syncDirective]) ...
   *
   * A central notification that the supplied selCrit has changed (and
   * is in a completed/valid state).
   *
   * This is emitted by various logic points under any circumstance of
   * a completed/valid change (ex: edit dialog completion, save,
   * etc.), and is of interest to reducers to to maintain overall
   * state.
   * 
   * @param {SelCrit} selCrit the selCrit that has changed.
   * @param {SelCrit.SyncDirective} syncDirective a directive that indicates
   * how selCrit changes should be synced in selCrit-based views.
   * ... DEFAULT: SelCrit.SyncDirective.default
   */
  'selCrit.changed': { traits: ['selCrit', 'syncDirective'], // ... #byLogic, #reducer
                       ratify(selCrit,
                              syncDirective=SelCrit.SyncDirective.default) {
                         assert(SelCrit.isSelCrit(selCrit),
                                `AC.selCrit.changed() Invalid selCrit param: ${FMT(selCrit)}`);
                         assert(SelCrit.SyncDirective[syncDirective],
                                `AC.selCrit.changed() Invalid syncDirective param: ${FMT(syncDirective)}`);
                         return [selCrit, syncDirective];
                       }},


  // ***
  // *** save specified selCrit
  // ***

  /**
   * AC.selCrit.save(selCrit [, syncDirective]) ...
   *
   * Save the supplied selCrit.
   * 
   * Any view that is based on this selCrit is automatically updated.
   * 
   * @param {SelCrit} selCrit the selCrit to save.
   * @param {SelCrit.SyncDirective} syncDirective a directive that indicates
   * how selCrit changes should be synced in selCrit-based views.
   * ... DEFAULT: SyncDirective.default
   */
  'selCrit.save': { traits: ['selCrit', 'syncDirective'], // ... #byUser, #byLogic, #reducer(spinner only)
                    ratify(selCrit,
                           syncDirective=SelCrit.SyncDirective.default) {
                      assert(SelCrit.isSelCrit(selCrit),
                             `AC.selCrit.save() Invalid selCrit param: ${FMT(selCrit)}`);
                      assert(SelCrit.SyncDirective[syncDirective],
                             `AC.selCrit.save() Invalid syncDirective param: ${FMT(syncDirective)}`);
                      return [selCrit, syncDirective];
                    }},
  'selCrit.save.complete': { traits: ['selCrit'] },        // ... #byLogic, #reducer(spinner only - NOTE: monitor selCrit.changed for overall changes)
  'selCrit.save.fail':     { traits: ['selCrit', 'err'] }, // ... #byLogic, #reducer(spinner only)


  // ***
  // *** delete specified selCrit
  // ***

  /**
   * AC.selCrit.delete(selCrit) ...
   *
   * Delete the supplied selCrit, after obtaining a user confirmation.
   * 
   * Any view that is based on this selCrit is automatically updated (see impactView).
   * 
   * @param {SelCrit} selCrit the selCrit to delete.  This can either be a local in-memory
   * representation -or- on persisted in the DB.
   */
  'selCrit.delete':          { traits: ['selCrit'] },               // ... #byUser,           #reducer(spinner only)
  'selCrit.delete.complete': { traits: ['selCrit', 'impactView'] }, // ...          #byLogic, #reducer ... impactView is the itemType of an impacted view if any (null indicates NO view was impacted)
  'selCrit.delete.fail':     { traits: ['selCrit', 'err'] },        // ...          #byLogic, #reducer(spinner only)

};


// machine generate (and promote) our AT (Action Types), and AC (Action Creators)
const  {AT, AC} = generate_AT_AC(genesis);
export {AT, AC};
