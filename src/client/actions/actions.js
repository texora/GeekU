'use strict'

import detailItemThunk         from './thunks/detailItemThunk';
import retrieveFiltersThunk    from './thunks/retrieveFiltersThunk';
import selCritDeleteThunk      from './thunks/selCritDeleteThunk';
import selCritSaveThunk        from './thunks/selCritSaveThunk';
import itemsViewThunk          from './thunks/itemsViewThunk';
                               
import userMsgDisplayAC        from './creators/userMsgDisplayAC';
                               
import generate_AT_AC          from './generate_AT_AC';


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
 * NOTES: 
 *
 *   - To determine what Action Creators/Types are availble (AC/AT), simply interpret
 *     the genesis structure (below) as follows:
 *      * The genesis key is both the AC function name and the AT type
 *      * The genesis value.params array represents the expected AC function parameters
 *        and the AT action type state.
 *     EXAMPLE: AC.userMsg.display(msg): Action
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
 * INTERNAL NOTES: 
 *
 *   This technique of creating AC/ATs has the following benefits:
 *   
 *    - The Action Creators (AC) 
 *      * Concisely defines all the actions you can perform within the app
 *      * Promotes and validates the exact set of expected parameters
 *        TODO: currently validation is disabled till we provide a means of defining optional/defaulted params
 *        ... at least the number of parameters
 *        ... the parameter types are NOT validated, but the name gives a hint of expectations
 *        ... here is an example error that is thrown if number of params are incorrect:
 *            ERROR: Action Creator AC.selCrit.edit(selCrit) expecting 2 parameters, but received 1
 *      * Correctly constructs the action every time
 *   
 *    - The Action Types (AT):
 *      * Are consisely defined from the same definition
 *   
 *    - Minimal development effort in maintaining the AC/ATs
 */

const genesis = {

  // ***
  // *** display a user message via Material UI Snackbar
  // ***
  //       AC.userMsg.display(msg [,userAction])
  //          ... see: userMsgDisplayAC.js for full documentation
  'userMsg.display':           { params: ['msg', 'userAction'],       ac: userMsgDisplayAC },
  'userMsg.close':             { params: [] },


  // ***
  // *** retrieve and/or activate the Items View for the specified itemType
  // ***
  //       AC.itemsView(itemType, retrieve, activate)
  //          ... see: itemsViewThunk.js for full documentation
  //        * itemType:    the itemType ... 'student'/'course'
  //        * retrieve:    the retrieval directive, one of:
  //          - null:        no retrieval at all (DEFAULT)
  //          - selCrit:     conditionally retrieve items when different from ItemsView selCrit (or out-of-date)
  //          - 'refresh':   unconditionally refresh ItemsView with latest items (using view's current selCrit)
  //        * activate:    the activate directive, one of:
  //          - 'activate':    activate/visualize this itemType ItemsView (DEFAULT for all but 'refresh' retrieval)
  //          - 'no-activate': DO NOT activate                            (DEFAULT for 'refresh' retrieval)
  'itemsView':                  { params: ['itemType', 'retrieve', 'activate'], thunk: itemsViewThunk },
  'itemsView.activate':         { params: ['itemType'] },
  'itemsView.retrieveStart':    { params: ['itemType', 'selCrit'] },          // conditionally emitted when retrieval needed
  'itemsView.retrieveComplete': { params: ['itemType', 'selCrit', 'items'] }, // ditto
  'itemsView.retrieveFail':     { params: ['itemType', 'selCrit', 'error'] }, // ditto


  // ***
  // *** select item
  // ***
  //       AC.selectItem(itemType, item)
  //        * itemType:    the itemType ... 'student'/'course'
  //        * item:        the item to select (null for de-select)
  'selectItem': { params: ['itemType', 'item'] },


  // ***
  // *** detail item, after fresh retrieval, in a visual Dialog for either view/edit
  // ***
  //       AC.detaiItem(itemNum, itemType, editMode)
  //          ... see: detailItemThunk.js for full documentation
  //        * itemNum:     the item key ... 'studentNum'/'courseNum'
  //        * itemType:    the itemType ... 'student'/'course'
  //        * editMode:    true: edit, false: view
  'detailItem':                  { params: ['itemType', 'itemNum', 'editMode'],  thunk: detailItemThunk },
  'detailItem.retrieveStart':    { params: ['itemType', 'itemNum', 'editMode'] },
  'detailItem.retrieveComplete': { params: ['itemType', 'item',    'editMode'] },
  'detailItem.retrieveFail':     { params: ['itemType', 'itemNum', 'editMode', 'err'] },
  'detailItem.close':            { params: ['itemType'] },
  'detailItem.changeEditMode':   { params: ['itemType'] },

  'retrieveFilters':          { params: [],    thunk: retrieveFiltersThunk },
  'retrieveFilters.start':    { params: [] },
  'retrieveFilters.complete': { params: ['filters'] },
  'retrieveFilters.fail':     { params: ['error'] },

  // PRIVATE AC: emitted from <EditSelCrit>
  'selCrit.edit':              { params: ['selCrit', 'meta'] }, // start a selCrit edit session
  'selCrit.edit.nameChange':   { params: ['name'] },
  'selCrit.edit.descChange':   { params: ['desc'] },
  'selCrit.edit.fieldsChange': { params: ['selectedFieldOptions'] },
  'selCrit.edit.sortChange':   { params: ['selectedSortOptions'] },
  'selCrit.edit.filterChange': { params: ['newFilter'] },
  'selCrit.edit.distinguishMajorSortFieldChange': { params: ['value'] },
  'selCrit.edit.close':        { params: [] },  // close dialog
  // PUBLIC AC: emitted from <EditSelCrit>
  'selCrit.edit.changed':      { params: ['selCrit'] }, // selCrit has changed with the app ... see EditSelCrit.js for full doc

  'selCrit.save':          { params: ['selCrit'],    thunk: selCritSaveThunk },
  'selCrit.save.start':    { params: ['selCrit'] },
  'selCrit.save.complete': { params: ['selCrit'] },
  'selCrit.save.fail':     { params: ['selCrit', 'error'] },

  'selCrit.delete':          { params: ['selCrit', 'impactView'], thunk: selCritDeleteThunk }, // impactView: the itemType of our impacted view if any (null indicates NO view was impacted) ... 'student'/'course'/null
  'selCrit.delete.start':    { params: ['selCrit', 'impactView'] },
  'selCrit.delete.complete': { params: ['selCrit', 'impactView'] },
  'selCrit.delete.fail':     { params: ['selCrit', 'impactView', 'error'] },

};


// machine generate (and promote) our AT (Action Types), and AC (Action Creators)
const  {AT, AC} = generate_AT_AC(genesis);
export {AT, AC};
