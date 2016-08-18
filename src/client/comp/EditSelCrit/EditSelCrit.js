'use strict';

import React              from 'react';
import * as ReactRedux    from 'react-redux';

import autobind           from 'autobind-decorator';
import assert             from 'assert';
import {AC}               from '../../actions';
import SelCrit            from '../../../shared/util/SelCrit';
import itemTypes          from '../../../shared/model/itemTypes';

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
 * object, any selCrit.itemType is supported ('student','course', etc).
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
 *        - driving the dispay content in a view.
 *
 *   These instances must be synced to reflect the latest changes.
 *   Each selCrit object has a unique key (selCrit.key), that
 *   identifies that specific instance.  This key is maintained
 *   irrespective to whether the selCrit is persisted or not.  You may
 *   have a selCrit that is temporary (not saved at all), or you
 *   may decide to temporarly modify a persistant selCrit.
 * 
 *   - ACTION: AT.selCrit.edit.changed .... WITH: action.selCrit
 *   - ACTION: AT.selCrit.save.complete ... WITH: action.selCrit
 * 
 *     To facilate this external synchronization, one of these
 *     (mutually exclusive) actions will be emitted, when the selCrit
 *     has changed, and should be PUBLICALLY monitored by various
 *     reducers.
 *
 *     The 'edit.changed' action indicates an in-memory change (with
 *     no save), while the 'save.complete' action indicates a change
 *     has been saved (persisted).
 *
 *     These actions are intelligently emitted ONLY when a selCrit
 *     change actually occurs.  

 *     They are mutually exclusive, because the sync reducer
 *     monitoring logic should be identical.
 *
 *     These are public triggers to sync the supplied selCrit where
 *     appropriate (matching selCrit.key).  As an example, the LeftNav
 *     contains a variety of selCrit objects (for view selection), and
 *     should be synced.
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
 *     by monnitoring various action types, because this would require
 *     a reducer to issue actions (an anti-pattern side-effect).
 */

@ReactRedux.connect( (appState, ownProps) => {
  return {
    selCrit:              appState.editSelCrit.selCrit,
    selectedFieldOptions: appState.editSelCrit.extra ? appState.editSelCrit.extra.selectedFieldOptions : null,
    selectedSortOptions:  appState.editSelCrit.extra ? appState.editSelCrit.extra.selectedSortOptions : null,
  };
})

@autobind

export default class EditSelCrit extends React.Component {

  static propTypes = { // expected component props
  }

  constructor(props, context) {
    super(props, context);

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
   * @param {SelCrit|itemType-string} selCrit the selCrit to edit, 
   * or a itemType string to create a new selCrit.
   * 
   * @param {function} extraActionsOnCompletionCb an optional client
   * callback, executed on edit completion, supporting additional
   * logic over-and-above the normal synchronization (ex: refresh a
   * view based on this selCrit).
   *   API: extraActionsOnCompletionCb(selCrit): Action -or- Action[] -or- null
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
   *
   * NOTE: Please refer to static edit() method (above) for full definition and param doc.
   */
  edit(selCrit, extraActionsOnCompletionCb) {
    const p = this.props;

    assert(selCrit, `EditSelCrit.edit() invocation missing selCrit parameter`);

    // create a new selCrit when a itemType string is supplied
    if (typeof selCrit === 'string') { // selCrit is a string ... 'student'/'course'

      // re-define selCrit as a new one (of supplied itemType)
      selCrit = SelCrit.new(selCrit);

      // a new selCrit can be canceled at any time and it will be thrown away
      this.forceCancelButton = true;
    }
    else {
      this.forceCancelButton = false;
    }

    // determine the DB meta definition we are working for
    this.meta = itemTypes.meta[selCrit.itemType];
    assert(this.meta, `EditSelCrit.edit() an invalid itemType ('${selCrit.itemType}') was specified (no meta definition)`);

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
      if (SelCrit.validate(p.selCrit)) {
        UserMsg.display('Please resolve the highlighted validation errors.');
        return;
      }
    }

    //***
    //*** emit the appropriate action(s), once our selCrit has been fully resolved
    //***

    // FIRST, apply save (when requested) so as to have an up-to-date selCrit (with new dbHash, etc.)
    let resolveSelCritPromise = null;
    if (completionType === 'Save') { // ... the Save button was clicked
      resolveSelCritPromise = p.dispatch( AC.selCrit.save(p.selCrit) );
    }
    else { // ... use modified selCrit (un-saved)
      resolveSelCritPromise = Promise.resolve(p.selCrit);
    }

    // emit appropriate actions, once the selCrit has been fully resolved ...
    resolveSelCritPromise.then( selCrit => {

      // we always issue a close (to take down our dialog)
      const actions = [AC.selCrit.edit.close()];

      if (completionType !== 'Cancel') { // no other actions required when Cancel clicked

        // issue selCrit sync actions, when selCrit has actually changed
        if (selCrit.curHash !== this.starting_curHash || // when selCrit has changed from our starting point -OR-
            completionType === 'Save') {                 // save updates selCrit (at minimum: dbHash, etc.)
        
          // publish our standard selCrit sync action
          // NOTE: when Save has been involved, the sync will occur via AT.selCrit.save.complete (above)
          if (completionType !== 'Save') {
            actions.push( AC.selCrit.edit.changed(selCrit) );
          }
          
          // apply invoker-based 'extra' synchronization (ex: refresh a retrieval based on this selCrit)
          if (this.extraActionsOnCompletionCb) {
            const extraActions = this.extraActionsOnCompletionCb(selCrit); 

            if (extraActions) {
              if (Array.isArray(extraActions))
                actions.push(...extraActions);
              else
                actions.push(extraActions);
            }
          }
        }
      }

      // publish the appropriate actions
      p.dispatch( actions );
    });

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
                   title={`${itemTypes.meta[p.selCrit.itemType].label.plural} Filter`}
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
                                 title={SelCrit.isCurrentContentSaved(p.selCrit) ? 'there are NO changes to save' : 'save and use changes'}
                                 disabled={SelCrit.isCurrentContentSaved(p.selCrit)}
                                 onTouchTap={ (e) => this.handleEditComplete('Save') }/>,
                     <FlatButton label="Cancel"
                                 primary={true}
                                 title={p.selCrit.curHash===this.starting_curHash ? 'there are NO changes to cancel' : 'cancel changes'}
                                 disabled={!this.forceCancelButton && p.selCrit.curHash===this.starting_curHash}
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
}

// keep track of our one-and-only instance
let _singleton = null;
