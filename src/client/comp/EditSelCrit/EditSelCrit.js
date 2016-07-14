'use strict';

import React              from 'react';
import ReduxUtil          from '../../util/ReduxUtil';

import autoBindAllMethods from '../../../shared/util/autoBindAllMethods';
import assert             from 'assert';
import {AC}               from '../../state/actions';
import {hashSelCrit}      from '../../util/selCritUtil';

import studentsMeta       from '../../../shared/model/studentsMeta';
import coursesMeta        from '../../../shared/model/coursesMeta';
const  metaXlate = {      // indexed via selCrit.target
         'Students': studentsMeta,
         'Courses':  coursesMeta,
       };

import Dialog      from 'material-ui/lib/dialog';
import TextField   from 'material-ui/lib/text-field';
import Select      from 'react-select'
import FieldValue  from './FieldValue'
import SortValue   from './SortValue'


/**
 * The EditSelCrit component edits a supplied selCrit object, through
 * an interactive modal dialog.  Any selCrit.target is supported (for
 * example: Students, Courses, etc.).  
 *
 * An edit session is initiated through the edit() static method.  The
 * incentive for this programmatic interface is an edit session can be
 * invoked from a variety of different places - programmatically
 * (i.e. the invoker does NOT need access to the dispatcher).
 *
 * USAGE:
 *
 *   To use the EditSelCrit component, you must first pre-instantiate
 *   it somewhere within the app's DOM.  Only one instance should ever
 *   be created within the app.  The EditSelCrit component is
 *   initially hidden. until an edit session is programatically
 *   initiated.
 *   
 *       <EditSelCrit/>
 *   
 *   An edit edit session may then be programatically initiated (in a
 *   variety of different logic points) by simply calling the static
 *   edit() method:
 *   
 *       EditSelCrit.edit(selCrit, extraActionsOnCompletionCb): void
 *         ... see JavaDoc (below)
 * 
 * Edit Complete - External Synchronization:
 * 
 *   selCrit objects may reside in a variety of different places (for
 *   example: in the LefNav menu [to choose], and driving the dispay
 *   content in a view).  Each selCrit object has a unique key, that
 *   identifies that specific instance.
 * 
 *   When an edit session is complete, it may be necessary to
 *   syncronize the modifications to a variety of places.  This is
 *   acomplished throught the following actions:
 * 
 *     EditSelCrit based actions:
 * 
 *       - AC.selCrit.edit.complete (Action Object)
 *         ... client should sync to all instances with the same selCrit.key
 * 
 *       - ?? AC.selCrit.save(selCrit) (Action Thunk ?? I suspect)
 *           ... ?? consider this:
 *                  this async save, could be acomplished in-line (without redux thunk)
 *                  BECAUSE: nothing in the selCrit will change (as we even provide the key)
 *                           THAT IS, if we apply the selCrit.dbHash at this time
 *                  I THINK this is where Dan Abramov would use promise chaining to Save -> broadcast edit.complete
 * 
 *     Extra Actions (invoker based):
 *
 *       - additional actions identified by the optional extraActionsOnCompletionCb callback
 *         (ex: refresh a retrieval based on this selCrit)
 *         NOTE: additional actions CANNOT be acomplished by monotoring the standard EditSelCrit actions,
 *               because this would require a reducer to issue actions (an anti-pattern).
 */
const EditSelCrit = ReduxUtil.wrapCompWithInjectedProps(

  class EditSelCrit extends React.Component { // component definition

    constructor(props, context) {
      super(props, context);

      autoBindAllMethods(this);

      // keep track of our one-and-only instance
      assert(!_singleton, "<EditSelCrit> only ONE EditSelCrit is needed and therefore may be instantiated within the app.");
      _singleton = this;
    }

    /**
     * Edit the supplied selCrit by activating a modal dialog.
     * 
     * NOTE: This method is very close to an AC, except that it
     *       automatically dispatches the appropriate action.  As a
     *       result it can be programmatically invoked at any logic
     *       point.  In addition, it insures an <EditSelCrit> has been
     *       instantiated.
     * 
     * @parm {SelCrit} selCrit the selCrit to edit.
     * @parm {function} extraActionsOnCompletionCb an optional client
     * callback, executed on edit completion, supporting additional
     * logic over-and-above the normal synchronization (ex: refresh a
     * retrieval based on this selCrit).
     *   API: extraActionsOnCompletionCb(selCrit): Action -or- Action[]
     * 
     * @public
     */
    static edit(selCrit, extraActionsOnCompletionCb) {
      // validate that an <EditSelCrit> has been instantiated
      assert(_singleton, "EditSelCrit.edit() ... ERROR: NO <EditSelCrit> has been instantiated within the app.");

      // pass-through to our instance method
      _singleton.edit(selCrit, extraActionsOnCompletionCb);
    }

    // internal instance method that initiates the selCrit edit session
    edit(selCrit, extraActionsOnCompletionCb) {
      const p = this.props;

      // determine the DB meta definition we are working for
      this.meta = metaXlate[selCrit.target];

      // define the total set of fieldOptions promoted to the user
      // ... derived from meta.validFields
      this.fieldOptions = [];
      for (const fieldName in this.meta.validFields) {
        const fieldLabel = this.meta.validFields[fieldName];
        if (fieldLabel) { // missing field label is a control indication to NOT promote field to user
          this.fieldOptions.push( { value: fieldName, label: fieldLabel } );
        }
      }

      // define the total set of sortOptions promoted to the user
      // ... derived from meta.validFields
      this.sortOptions = [];
      for (const fieldName in this.meta.validFields) {
        const fieldLabel = this.meta.validFields[fieldName];
        if (fieldLabel) { // missing field label is a control indication to NOT promote field to user
          this.sortOptions.push( { value: fieldName, label: fieldLabel, ascDec: 1 } );
        }
      }

      // retain extraActionsOnCompletionCb in self for future reference (on close)
      this.extraActionsOnCompletionCb = extraActionsOnCompletionCb;

      // retain the starting selCrit.curHash, providing the ability to determine when self has changed the selCrit
      // ... NOTE: we have to calculate it, because the appState selCrit.curHash is not defined till after
      //           the following dispatch cycle
      this.starting_curHash = hashSelCrit(selCrit);
      // console.log(`?? <EditSelCrit>.edit() initial selCrit: ${JSON.stringify(selCrit, null, 2)}`); // our hash check appears to be working!


      // dispatch the appropriate action
      p.dispatch( AC.selCrit.edit(selCrit, this.meta) );
    }

    handleEditComplete() {
      const p = this.props;

      // ??? apply validation

      // ??? conditionally apply some actions only when selCrit changed
      //     ?? one problem is: we need the AC.selCrit.edit.complete() to close the dialog
      //        ... ?? we would need to make that a seperate action ... AC.selCrit.edit.close()
      //        ... ?? and possibly renaming AC.selCrit.edit.complete TO: AC.selCrit.edit.changed(selCrit)
      // console.log(`?? <EditSelCrit>.handleEditComplete() originalHash: '${this.starting_curHash}', curHash: '${p.selCrit.curHash}'`); // our hash check appears to be working!
      // console.log(`?? <EditSelCrit>.handleEditComplete() cur selCrit: ${JSON.stringify(p.selCrit, null, 2)}`); // our hash check appears to be working!
      if (this.starting_curHash === p.selCrit.curHash) {
        console.log('?? <EditSelCrit>.handleEditComplete() ... there is NO need to broadcast change, because selCrit has NOT changed!');
      }

      const actions = [];

      // publish our standard synchronization actions
      actions.push( AC.selCrit.edit.complete(p.selCrit) );

      // apply invoker-based 'extra' synchronization (ex: refresh a retrieval based on this selCrit)
      // ... we cannot accomplish this in our standard synchronization actions, 
      //     because it would require a reducer to dispatch other actions (an anti-pattern)
      if (this.extraActionsOnCompletionCb) {
        const extraActions = this.extraActionsOnCompletionCb(p.selCrit); 
        if (extraActions) {
          if (Array.isArray(extraActions))
            actions.push(...extraActions);
          else
            actions.push(extraActions);
        }
      }

      p.dispatch( actions );

    }

    handleNameChange(event) {
      const p = this.props;
      p.dispatch( AC.selCrit.edit.nameChange(event.target.value) );
    }

    handleDescChange(event) {
      const p = this.props;
      p.dispatch( AC.selCrit.edit.descChange(event.target.value) );
    }

    handleFieldsChange(selectedFieldOptions) { // selectedFieldOptions: Option[ {value, label}, ...]
      const p = this.props;
      p.dispatch( AC.selCrit.edit.fieldsChange(selectedFieldOptions) );
    }

    handleSortChange(selectedSortOptions) { // selectedSortOptions: Option[ {value, label, ascDec}, ...]
      const p = this.props;
      p.dispatch( AC.selCrit.edit.sortChange(selectedSortOptions) );
    }

    render() {
      const p = this.props;

      // no-op, when we are not in an edit session
      if (!p.selCrit)
        return null;

      return <Dialog modal={false}
                     title={`${p.selCrit.target} Filter`}
                     open={true}
                     autoScrollBodyContent={true}
                     onRequestClose={this.handleEditComplete}
                     contentStyle={{
                         width:         '90%',
                         maxWidth:      'none',
                         verticalAlign: 'top',
                       }}>

        <TextField floatingLabelText="Name"
                   style={{ width: '10em' }}
                   value={p.selCrit.name}
                   onChange={this.handleNameChange}/>
        &emsp;

        <TextField floatingLabelText="Description"
                   style={{ width: '40em' }}
                   defaultValue={p.selCrit.desc}
                   onChange={this.handleDescChange}/>
        <br/>
        <br/>

        <div style={{width: '100%'}}>
          <span style={{color: 'grey'}}>Display Fields <i>(note that Students Gender/Name/StudentNum are always grouped together)</i>:</span><br/>
          <Select multi={true}
                  options={this.fieldOptions}
                  valueComponent={FieldValue}
                  value={p.selectedFieldOptions}
                  onChange={this.handleFieldsChange}
                  resetValue={[]}/>
        </div>
        <br/>

        <div style={{width: '100%'}}>
          <span style={{color: 'grey'}}>Sort Fields:</span><br/>
          <Select multi={true}
                  options={this.sortOptions} 
                  valueComponent={SortValue}
                  value={p.selectedSortOptions}
                  onChange={this.handleSortChange}
                  resetValue={[]}/>
        </div>

        <br/>
        <br/>
        <br/>
        <br/>
        <br/> {/* ... insure sufficient space in dialog to accommodate UI-Select drop-down */}
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

      </Dialog>;
    }
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        selCrit:              appState.editSelCrit.selCrit,
        selectedFieldOptions: appState.editSelCrit.extra ? appState.editSelCrit.extra.selectedFieldOptions : null,
        selectedSortOptions:  appState.editSelCrit.extra ? appState.editSelCrit.extra.selectedSortOptions : null,
      };
    }
  }); // end of ... component property injection


// define expected props
EditSelCrit.propTypes = {
}

// keep track of our one-and-only instance
let _singleton = null;

export default EditSelCrit;
