'use strict';

import React              from 'react';
import * as ReactRedux    from 'react-redux';

import {AC}               from '../../actions';
import selectors          from '../../state';
import SelCrit            from '../../../shared/domain/SelCrit';
import itemTypes          from '../../../shared/domain/itemTypes';

import Dialog         from 'material-ui/lib/dialog';
import TextField      from 'material-ui/lib/text-field';
import FlatButton     from 'material-ui/lib/flat-button';
import Toggle         from 'material-ui/lib/toggle';
import Select         from 'react-select'
import FieldValue     from './FieldValue'
import SortValue      from './SortValue'
import SelCritDetail  from './SelCritDetail'


/**
 * The EditSelCrit component edits a supplied selCrit object, through
 * an interactive modal dialog.  Because the selCrit is a generic
 * object, any SelCrit is supported (itemType of 'student','course', etc).
 *
 * NOTE: Yes I know this can be a stateless functional component, 
 *       however I much prefer the redux-connect property injection
 *       via decorators (which requires a class).
 */

@ReactRedux.connect(
  (appState, ownProps) => { // mapStateToProps
    const extra = selectors.getEditSelCrit(appState).extra || {};
    return {
      selCrit:              selectors.getEditSelCrit(appState).selCrit,
      isNew:                extra.isNew,
      meta:                 extra.meta,
      fieldOptions:         extra.fieldOptions,
      selectedFieldOptions: extra.selectedFieldOptions,
      sortOptions:          extra.sortOptions,
      selectedSortOptions:  extra.selectedSortOptions,
      startingCurHash:      extra.startingCurHash,
    };
  },
  (dispatch, ownProps) => { // mapDispatchToProps
    return {
      handleEditUse() {
        dispatch( AC.selCrit.edit.use() );
      },
      handleEditSave() {
        dispatch( AC.selCrit.edit.save() );
      },
      handleEditClose() {
        dispatch( AC.selCrit.edit.close() );
      },
      handleNameChange(event) {
        dispatch( AC.selCrit.edit.change.name(event.target.value) );
      },
      handleDescChange(event) {
        dispatch( AC.selCrit.edit.change.desc(event.target.value) );
      },
      handleFieldsChange(selectedFieldOptions) { // selectedFieldOptions: Option[ {value, label}, ...]
        dispatch( AC.selCrit.edit.change.fields(selectedFieldOptions) );
      },
      handleSortChange(selectedSortOptions) { // selectedSortOptions: Option[ {value, label, ascDec}, ...]
        dispatch( AC.selCrit.edit.change.sort(selectedSortOptions) );
      },
      handleDistinguishMajorSortFieldChange(event, value) {
        dispatch( AC.selCrit.edit.change.distinguishMajorSortField(value) );
      },
    };
  },

)

export default class EditSelCrit extends React.Component {

  static propTypes = { // expected component props
  }

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
                   onRequestClose={ (buttonClicked) => p.handleEditUse()}
                   actions={[
                     <FlatButton label="Use"
                                 primary={true}
                                 title="use this filter (without saving)"
                                 onTouchTap={ (e) => p.handleEditUse() }/>,
                     <FlatButton label="Save"
                                 primary={true}
                                 title={SelCrit.isCurrentContentSaved(p.selCrit) ? 'there are NO changes to save' : 'save and use changes'}
                                 disabled={SelCrit.isCurrentContentSaved(p.selCrit)}
                                 onTouchTap={ (e) => p.handleEditSave() }/>,
                     <FlatButton label="Cancel"
                                 primary={true}
                                 title={p.selCrit.curHash===p.startingCurHash ? 'there are NO changes to cancel' : 'cancel changes'}
                                 disabled={!p.isNew && p.selCrit.curHash===p.startingCurHash}
                                 onTouchTap={ (e) => p.handleEditClose() }/>,
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
                 onChange={p.handleNameChange}/>
      &emsp;

      <TextField floatingLabelText="Description"
                 style={{ width: '40em' }}
                 errorText={p.selCrit.desc.trim() ? null : 'Description is required'}
                 value={p.selCrit.desc}
                 onChange={p.handleDescChange}/>
      <br/>
      <br/>

      <div style={{width: '100%'}}>
        <span style={{color: 'grey'}}>Display Fields <i>{p.meta.displayFieldsNote }</i>:</span><br/>
        <Select multi={true}
                options={p.fieldOptions}
                matchProp="label"
                placeholder="... using default fields"
                valueComponent={FieldValue}
                value={p.selectedFieldOptions}
                onChange={p.handleFieldsChange}
                resetValue={[]}/>
      </div>
      <br/>

      <div style={{width: '100%'}}>
        <span style={{color: 'grey'}}>Order By:</span><br/>
        <Select multi={true}
                options={p.sortOptions} 
                matchProp="label"
                placeholder="... no sort in effect"
                valueComponent={SortValue}
                value={p.selectedSortOptions}
                onChange={p.handleSortChange}
                resetValue={[]}/>
        <Toggle label="Distinguish Major Sort Field"
                labelPosition="right"
                style={{paddingLeft: 20}}
                toggled={p.selCrit.distinguishMajorSortField}
                onToggle={p.handleDistinguishMajorSortFieldChange}/>
      </div>
      <br/>

      <SelCritDetail meta={p.meta}/>

    </Dialog>;
  }
}
