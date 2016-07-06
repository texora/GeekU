'use strict';

import React              from 'react';
import ReduxUtil          from '../util/ReduxUtil';

import autoBindAllMethods from '../../shared/util/autoBindAllMethods';

import studentsMeta       from '../../shared/model/studentsMeta';

import {AC}               from '../state/actions';

import Dialog      from 'material-ui/lib/dialog';
import TextField   from 'material-ui/lib/text-field';
import Select      from 'react-select'

import ArrowBackIcon           from 'material-ui/lib/svg-icons/navigation/arrow-back';
import ArrowForwardIcon        from 'material-ui/lib/svg-icons/navigation/arrow-forward';
import FilterListIcon          from 'material-ui/lib/svg-icons/content/filter-list';
import RemoveCircleOutlineIcon from 'material-ui/lib/svg-icons/content/remove-circle-outline';


/**
 * The StudentsSelCrit component edits the selCrit for a Students retrieval.
 */
const StudentsSelCrit = ReduxUtil.wrapCompWithInjectedProps(

  class StudentsSelCrit extends React.Component { // component definition
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }

    render() {
      const { selCrit, fieldsChangeFn, closeDialogFn } = this.props;

      return <Dialog modal={false}
                     title='Students Filter'
                     open={true}
                     autoScrollBodyContent={true}
                     onRequestClose={closeDialogFn}
                     contentStyle={{
                         width:         '90%',
                         maxWidth:      'none',
                         verticalAlign: 'top',
                       }}>

        <TextField floatingLabelText="Name"
                   style={{ width: '10em' }}
                   defaultValue={selCrit.name}/>
        &emsp;

        <TextField floatingLabelText="Description"
                   style={{ width: '40em' }}
                   defaultValue={selCrit.desc}/>
        <br/>
        <br/>

        <div style={{width: '100%'}}>
          <span style={{color: 'grey'}}>Display Fields <i>(note that Gender/Name/StudentNum are always grouped together)</i>:</span><br/>
          <Select value={selCrit.fields}
                  options={validFields} 
                  multi={true}
                  resetValue={[]}
                  valueComponent={FieldValue}
                  onChange={fieldsChangeFn}/>
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
        selCrit:  appState.students.selCrit,
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        fieldsChangeFn: (selectedOptions) => { 
          const selectedFields = selectedOptions.length===0 // string[]
                  ? null
                  : selectedOptions.map( option => option.value );
          dispatch( AC.editStudentsSelCrit.fieldsChange(selectedFields) );
        },
        closeDialogFn: () => { dispatch( AC.editStudentsSelCrit.close() ) }, // ??? we really want to refresh retrieval too (think need thunk batching)
      }
    }
  }); // end of ... component property injection

// define expected props
StudentsSelCrit.propTypes = {
}

export default StudentsSelCrit;




/**
 * Valid Fields promoted to the user (via studentsMeta.validFields).
 * ... value/label used in react-select
 */
const validFields = [];
for (const fieldName in studentsMeta.validFields) {
  const fieldLabel = studentsMeta.validFields[fieldName];
  if (fieldLabel) {
    validFields.push( { value: fieldName, label: fieldLabel} );
  }
}



/**
 * The FieldValue component provides a custom control for the selected fields to display.
 */
const FieldValue = ReduxUtil.wrapCompWithInjectedProps(

  class FieldValue extends React.Component {
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }
  
    // ??? move to sort fields
    toggleFieldAscDec(event, fieldOption) {
  		event.preventDefault(); // ??? can't seem to prevent drop-down ... may not really matter
  		event.stopPropagation();
      console.log('?? toggleFieldAscDec() for fieldOption: ', fieldOption)
    }
  
    repositionField(event, fieldOption, offset) {
      // adjust a fields copy by swapping the specified field with it's adjacent entry
      const fields    = this.props.selCrit.fields;
      const indxA     = fields.indexOf(fieldOption.value);
      const indxB     = indxA + offset;
      const newFields = [...fields];
      if (indxB < 0 || indxB > newFields.length-1)
        return; // can't move first/last elm
      newFields[indxA] = fields[indxB];
      newFields[indxB] = fields[indxA];

      // propogate this change into our appState
      this.props.fieldsChangeFn(newFields);
    }

    removeField(event, fieldOption) {
      // adjust a fields copy by removing the specified field
      const fields    = this.props.selCrit.fields;
      const indx      = fields.indexOf(fieldOption.value);
      const newFields = [...fields.slice(0,indx), ...fields.slice(indx+1)];

      // propogate this change into our appState
      this.props.fieldsChangeFn(newFields);
    }
  
  	render () {
      const fieldOption = this.props.value; // value (the options entry with value/label) is the only property of interest
      const iconStyle = {
        width:  12,
        height: 12,
      };
      const iconContainerStyle = {
        padding: '1'
      };


      const ascendingIcon  = <FilterListIcon  style={ {...iconStyle, transform: 'rotate(180deg)'} }/>;
      const descendingIcon = <FilterListIcon  style={ iconStyle }/>


  		return <div className="Select-value" style={{borderWidth: 1, borderColor: 'grey', color: 'black'}}>
  			       <span className="Select-value-icon" style={iconContainerStyle} title="Remove"                      onClick={(e)=>this.removeField(e,fieldOption)}><RemoveCircleOutlineIcon style={iconStyle}/></span>
  			     	 <span className="Select-value-icon" style={iconContainerStyle} title="Move Left"                   onClick={(e)=>this.repositionField(e,fieldOption, -1)}><ArrowBackIcon style={iconStyle}/></span>
               
  			     	 <span className="Select-value-label">{fieldOption.label}</span>
  			     	 <span className="Select-value-icon" style={iconContainerStyle} title="Toggle Ascending/Descending" onClick={(e)=>this.toggleFieldAscDec(e, fieldOption)}>{ascendingIcon}</span>
               
  			     	 <span className="Select-value-icon" style={iconContainerStyle} title="Move Right"                  onClick={(e)=>this.repositionField(e,fieldOption, +1)}><ArrowForwardIcon style={iconStyle}/></span>
  			     </div>;
    }
  
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        selCrit:  appState.students.selCrit,
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        fieldsChangeFn: (selectedFields) => { 
          dispatch( AC.editStudentsSelCrit.fieldsChange(selectedFields.length===0 ? null : selectedFields) );
        },
      }
    }
  }); // end of ... component property injection

// define expected props
FieldValue.propTypes = {
};
