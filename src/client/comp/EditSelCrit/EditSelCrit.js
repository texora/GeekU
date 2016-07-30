'use strict';

import React              from 'react';
import ReduxUtil          from '../../util/ReduxUtil';

import autoBindAllMethods from '../../../shared/util/autoBindAllMethods';
import assert             from 'assert';
import {AC}               from '../../state/actions';
import {hashSelCrit}      from '../../../shared/util/selCritUtil';

import studentsMeta       from '../../../shared/model/studentsMeta';
import coursesMeta        from '../../../shared/model/coursesMeta';
const  metaXlate = {      // indexed via selCrit.target
         'Students': studentsMeta,
         'Courses':  coursesMeta,
       };

import Dialog         from 'material-ui/lib/dialog';
import TextField      from 'material-ui/lib/text-field';
import FlatButton     from 'material-ui/lib/flat-button';
import Toggle         from 'material-ui/lib/toggle';
import Select         from 'react-select'
import FieldValue     from './FieldValue'
import SortValue      from './SortValue'
import SelCritDetail  from './SelCritDetail'

import UserMsg from '../UserMsg';


/**
 * The EditSelCrit component edits a supplied selCrit object, through
 * an interactive modal dialog.  Because the selCrit is a generic
 * object, any selCrit.target is supported (for example: Students,
 * Courses, etc.).
 *
 * An edit session is initiated through the edit() static method.  The
 * incentive for this programmatic interface is an edit session can be
 * invoked from a variety of different places - programmatically
 * (i.e. the invoker does NOT need access to the dispatcher).
 *
 *
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
 *         ... see edit() JavaDoc below
 * 
 * 
 * 
 * External Synchronization on Edit Complete:
 * 
 *   selCrit objects may reside in a variety of different places
 *   ... for example:
 *        - in the LefNav menu [to choose], and 
 *        - driving the dispay content in a view).
 *
 *   These instances must be synced to reflect the latest changes.
 *   Each selCrit object has a unique key (selCrit.key), that
 *   identifies that specific instance.  This key is maintained
 *   irrespective to whether the selCrit is persisted or not.  You may
 *   have a selCrit that is temporary (not saved at all), or you
 *   may decide to temporarly modify a persistant selCrit.
 * 
 *   - ACTION: AT.selCrit.edit.changed ... action contains: selCrit
 * 
 *     To facilate this external synchronization, the edit completion
 *     process will emit the AT.selCrit.edit.changed action, and
 *     should be PUBLICALLY monitored by various reducers.
 *
 *     This action is intelligently emitted ONLY if a change has
 *     actually occured (within the edit session).
 * 
 *     This action indicates that the supplied selCrit has been
 *     modified within the app (in memory irrespective to it's DB save
 *     status).  
 *
 *     This is a public trigger to sync the supplied selCrit where
 *     appropriate (matching selCrit.key).  As an example, the LeftNav
 *     contains a variety of selCrit objects that may be selected to
 *     view, and should be updated.
 *
 * 
 *   - PARAM: extraActionsOnCompletionCb ... see edit() JavaDoc below
 * 
 *     The syncing of active views should be handled through the
 *     extraActionsOnCompletionCb parameter, and NOT the
 *     AT.selCrit.edit.changed action.
 *
 *     The reason for this is additional work is required - over and
 *     above the in-memory syncing the selCrit ... namely an
 *     additional action to re-retrieve DB results from the newly
 *     modified selCrit.  This additional work CANNOT be acomplished
 *     by monnitoring the AT.selCrit.edit.changed action, because this
 *     would require a reducer to issue actions (an anti-pattern
 *     side-effect).
 * 
 *   - AT.selCrit.save ... action contains: selCrit
 * 
 *     In addition, the edit session may be completed through a save
 *     operation.  When this occurs, the AT.selCrit.save action is emitted.
 * 
 *     This action is emitted in addition to the other
 *     complete-related actions (discussed here), and is NOT really of
 *     PUBLIC concern.  In other words, the app should sync changes by
 *     monioring the actions discussed above.
 *
 *     With that said, the selCrit should be synced when the save is
 *     complete, by monitoring the AT.selCrit.save.complete action.
 *     This is merely to accomidate the change to selCrit (_id, 
 *     lastDbModDate, and dbHash) - reflecting it's DB persistance status.
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


    /**
     * edit() - internal instance method that initiates the selCrit edit session
     */
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

      // retain the starting curHash, providing the ability to determine when selCrit has changed (regardless of whether it is saved)
      this.starting_curHash = selCrit.curHash;
      // console.log(`xx <EditSelCrit>.edit() initial selCrit: ${FMT(selCrit)}`); // our hash check appears to be working!

      // dispatch the appropriate action
      p.dispatch( AC.selCrit.edit(selCrit, this.meta) );
    }


    /**
     * handleEditComplete()
     */
    handleEditComplete(completionType) { // completionType: 'Use'/'Save'/'Cancel'
      const p = this.props;

      // apply validation - prematurely returning on errors
      // ... validation errors dynamically are shown in dialog
      if (completionType !== 'Cancel') {
        let valid = true;
        if (!p.selCrit.name.trim()) // name is required
          valid = false;
        if (!p.selCrit.desc.trim()) // desc is required
          valid = false;
        for (const filterObj of (p.selCrit.filter || [])) { // filter is missing some components
          if (!filterObj.op ||
              !filterObj.value ||
              filterObj.value.length === 0)
            valid = false;
        }
        if (!valid) {
          UserMsg.display('Please resolve the highlighted validation errors.');
          return;
        }
      }

      //***
      //*** emit the appropriate action(s)
      //***

      // we always issue a close (to take down our dialog)
      const actions = [AC.selCrit.edit.close()];

      // issue change actions (when appropriate) ...
      if (p.selCrit.curHash !== this.starting_curHash &&  // when selCrit has actually changed -AND-
          completionType !== 'Cancel') {                  // the Cancel button was NOT used

        // publish our standard PUBLIC sync action
        actions.push( AC.selCrit.edit.changed(p.selCrit) );

            // apply invoker-based 'extra' synchronization (ex: refresh a retrieval based on this selCrit)
        if (this.extraActionsOnCompletionCb) {
          const extraActions = this.extraActionsOnCompletionCb(p.selCrit); 
          if (extraActions) {
            if (Array.isArray(extraActions))
              actions.push(...extraActions);
            else
              actions.push(extraActions);
          }
        }
      }

      // issue save (when appropriate) ...
      if (p.selCrit.curHash !== p.selCrit.dbHash && // when selCrit needs to be saved -AND-
          completionType === 'Save') {              // the Save button was used

        actions.push( AC.selCrit.save(p.selCrit) );
      }

      // publish the appropriate actions
      p.dispatch( actions );

    }


    /**
     * handleNameChange()
     */
    handleNameChange(event) {
      const p = this.props;
      p.dispatch( AC.selCrit.edit.nameChange(event.target.value) );
    }


    /**
     * handleDescChange()
     */
    handleDescChange(event) {
      const p = this.props;
      p.dispatch( AC.selCrit.edit.descChange(event.target.value) );
    }


    /**
     * handleFieldsChange()
     */
    handleFieldsChange(selectedFieldOptions) { // selectedFieldOptions: Option[ {value, label}, ...]
      const p = this.props;
      p.dispatch( AC.selCrit.edit.fieldsChange(selectedFieldOptions) );
    }


    /**
     * handleSortChange()
     */
    handleSortChange(selectedSortOptions) { // selectedSortOptions: Option[ {value, label, ascDec}, ...]
      const p = this.props;
      p.dispatch( AC.selCrit.edit.sortChange(selectedSortOptions) );
    }


    /**
     * handleDistinguishMajorSortFieldChange()
     */
    handleDistinguishMajorSortFieldChange(event, value) {
      const p = this.props;
      p.dispatch( AC.selCrit.edit.distinguishMajorSortFieldChange(value) );
    }

    /**
     * render()
     */
    render() {
      const p = this.props;

      // no-op, when we are not in an edit session
      if (!p.selCrit)
        return null;

      // NOTE: non-modal dialog: outer click same as 'Use' button
      return <Dialog modal={false}
                     title={`${p.selCrit.target} Filter`}
                     open={true}
                     autoScrollBodyContent={true}
                     onRequestClose={ (buttonClicked) => this.handleEditComplete('Use')}
                     actions={[
                       <FlatButton label="Use"
                                   primary={true}
                                   title="use this filter (without saving)"
                                   onTouchTap={ (e) => this.handleEditComplete('Use') }/>,
                       <FlatButton label="Save"
                                   primary={true}
                                   title={p.selCrit.dbHash===p.selCrit.curHash ? 'there are NO changes to save' : 'save and use changes'}
                                   disabled={p.selCrit.dbHash===p.selCrit.curHash}
                                   onTouchTap={ (e) => this.handleEditComplete('Save') }/>,
                       <FlatButton label="Cancel"
                                   primary={true}
                                   title={p.selCrit.curHash===this.starting_curHash ? 'there are NO changes to cancel' : 'cancel changes'}
                                   disabled={p.selCrit.curHash===this.starting_curHash}
                                   onTouchTap={ (e) => this.handleEditComplete('Cancel') }/>,
                     ]}
                     contentStyle={{
                         width:         '90%',
                         maxWidth:      'none',
                         verticalAlign: 'top',
                       }}>

        <TextField floatingLabelText="Name"
                   style={{ width: '10em' }}
                   errorText={p.selCrit.name.trim() ? null : 'Name is required'}
                   value={p.selCrit.name}
                   onChange={this.handleNameChange}/>
        &emsp;

        <TextField floatingLabelText="Description"
                   style={{ width: '40em' }}
                   errorText={p.selCrit.desc.trim() ? null : 'Description is required'}
                   value={p.selCrit.desc}
                   onChange={this.handleDescChange}/>
        <br/>
        <br/>

        <div style={{width: '100%'}}>
          <span style={{color: 'grey'}}>Display Fields <i>(note that Students Gender/Name/StudentNum are always grouped together)</i>:</span><br/>
          <Select multi={true}
                  options={this.fieldOptions}
                  matchProp="label"
                  placeholder="... using default fields"
                  valueComponent={FieldValue}
                  value={p.selectedFieldOptions}
                  onChange={this.handleFieldsChange}
                  resetValue={[]}/>
        </div>
        <br/>

        <div style={{width: '100%'}}>
          <span style={{color: 'grey'}}>Order By:</span><br/>
          <Select multi={true}
                  options={this.sortOptions} 
                  matchProp="label"
                  placeholder="... no sort in effect"
                  valueComponent={SortValue}
                  value={p.selectedSortOptions}
                  onChange={this.handleSortChange}
                  resetValue={[]}/>
          <Toggle label="Distinguish Major Sort Field"
                  labelPosition="right"
                  style={{paddingLeft: 20}}
                  toggled={p.selCrit.distinguishMajorSortField}
                  onToggle={this.handleDistinguishMajorSortFieldChange}/>
        </div>
        <br/>

        <SelCritDetail meta={this.meta}/>

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
