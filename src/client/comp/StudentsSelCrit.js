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
      const { selCrit, fieldsChangeFn, sortChangeFn, closeDialogFn } = this.props;

      // convert selCrit.sort structure to an array of field name strings
      const sortFields = selCrit.sort ? Object.keys(selCrit.sort) : null;

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
                  options={fieldOptions} 
                  multi={true}
                  resetValue={[]}
                  valueComponent={FieldValue}
                  onChange={fieldsChangeFn}/>
        </div>
        <br/>

        <div style={{width: '100%'}}>
          <span style={{color: 'grey'}}>Sort Fields:</span><br/>
          <Select value={sortFields}
                  options={sortOptions} 
                  multi={true}
                  resetValue={[]}
                  valueComponent={SortValue}
                  onChange={sortChangeFn}/>
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
      };
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {

        dispatch: dispatch,

        fieldsChangeFn: (selectedOptions) => { // selectedOptions is an Option[], each with .value and .label
          const selectedFields = selectedOptions.length===0 // string[]
                  ? null
                  : selectedOptions.map( option => option.value );
          dispatch( AC.editStudentsSelCrit.fieldsChange(selectedFields) );
        },

        closeDialogFn: () => { dispatch( AC.editStudentsSelCrit.close() ) }, // ??? we really want to refresh retrieval too (think need thunk batching)
      };
    },
    mergeProps(stateProps, dispatchProps, ownProps) { // mergeProps allows us to access appState/dispatch concurrently
      const { dispatch } = dispatchProps;
      const { selCrit }  = stateProps;
      return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,

        sortChangeFn: (selectedOptions) => {  // selectedOptions is an Option[], each with .value and .label

          const curSort = selCrit.sort || {};
          const newSort = selectedOptions.length===0 // string[]
                            ? null
                            : selectedOptions.reduce( (sortObj, option) => {
                                const fieldName = option.value;
                                sortObj[fieldName] = curSort[fieldName] || 1; // default new fields to 1 (ascending)
                                return sortObj;
                              }, {});

          dispatch( AC.editStudentsSelCrit.sortChange(newSort) );
        },
        
      };
    }
  }); // end of ... component property injection

// define expected props
StudentsSelCrit.propTypes = {
}

export default StudentsSelCrit;




/**
 * Field options promoted to the user (derived from studentsMeta.validFields).
 * ... value/label used in react-select <Select>
 */
const fieldOptions = [];
for (const fieldName in studentsMeta.validFields) {
  const fieldLabel = studentsMeta.validFields[fieldName];
  if (fieldLabel) {
    fieldOptions.push( { value: fieldName, label: fieldLabel} );
  }
}



/**
 * FieldValue custom control for field selection in react-select <Select>
 */
const FieldValue = ReduxUtil.wrapCompWithInjectedProps(

  class FieldValue extends React.Component {
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
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

  		return <div className="Select-value" style={{borderWidth: 1, borderColor: 'grey', color: 'black'}}>
  			       <span className="Select-value-icon" style={iconContainerStyle} title="Remove"                      onClick={(e)=>this.removeField(e,fieldOption)}><RemoveCircleOutlineIcon style={iconStyle}/></span>
  			     	 <span className="Select-value-icon" style={iconContainerStyle} title="Move Left"                   onClick={(e)=>this.repositionField(e,fieldOption, -1)}><ArrowBackIcon style={iconStyle}/></span>
               
  			     	 <span className="Select-value-label">{fieldOption.label}</span>
               
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
        fieldsChangeFn: (fields) => { 
          dispatch( AC.editStudentsSelCrit.fieldsChange(fields.length===0 ? null : fields) );
        },
      }
    }
  }); // end of ... component property injection

// define expected props
FieldValue.propTypes = {
};






/**
 * Sort options promoted to the user (derived from studentsMeta.validFields).
 * ... value/label used in react-select <Select>
 */
const sortOptions = fieldOptions; // same as fieldOptions (defined above)


/**
 * SortValue custom control for sort selection in react-select <Select>
 */
const SortValue = ReduxUtil.wrapCompWithInjectedProps(

  class SortValue extends React.Component {
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }
    
    toggleSortAscDec(event, sortOption) {
      // adjust a sort copy by toggling the ascending/decending indicator
      const sort    = this.props.selCrit.sort;
      const newSort = {...sort};
      const field   = sortOption.value;
      newSort[field] = sort[field] * -1;  // toggle 1 / -1

      // propogate this change into our appState
      this.props.sortChangeFn(newSort);
    }
    
    repositionSort(event, sortOption, offset) {
      // adjust a sort copy by swapping the specified entry with it's adjacent entry
      const sort       = this.props.selCrit.sort;
      const sortFields = Object.keys(sort);
      const indxA      = sortFields.indexOf(sortOption.value);
      const indxB      = indxA + offset;
      if (indxB < 0 || indxB > sortFields.length-1)
        return; // can't move first/last elm
      const holder      = sortFields[indxA];
      sortFields[indxA] = sortFields[indxB];
      sortFields[indxB] = holder;
      const newSort     = sortFields.reduce( (sortObj, sortField) => {
        sortObj[sortField] = sort[sortField];
        return sortObj;
      }, {});

      // propogate this change into our appState
      this.props.sortChangeFn(newSort);
    }

    removeSort(event, sortOption) {
      // adjust a sort copy by removing the specified entry
      const sort     = this.props.selCrit.sort;
      const delField = sortOption.value;
      let   newSort  = {};
      for (const fieldName in sort) {
        if (fieldName !== delField)
          newSort[fieldName] = sort[fieldName];
      }
      if (Object.keys(newSort).length===0) {
        newSort = null;
      }

      // propogate this change into our appState
      this.props.sortChangeFn(newSort);
    }
    
  	render () {
      const sortOption = this.props.value; // value (the options entry with value/label) is the only property of interest
      const sort       = this.props.selCrit.sort;
      const field      = sortOption.value;
      const ascDec     = sort ? sort[field] : 1; // ... sort null check - unsure why we are being rendered when no sort object exists (but we are)

      const iconContainerStyle = {
        padding: '1'
      };
      const iconStyle = {
        width:  12,
        height: 12,
      };

      const iconAscDecStyle = { // default icon (<FilterListIcon>) points down (v) meaning decending
      };
      if (ascDec > 0) { // make ascending point up
        iconAscDecStyle.transform = 'rotate(180deg)';
      }

  		return <div className="Select-value" style={{borderWidth: 1, borderColor: 'grey', color: 'black'}}>
  			       <span className="Select-value-icon" style={iconContainerStyle} title="Remove"
                     onClick={(e)=>this.removeSort(e,sortOption)}><RemoveCircleOutlineIcon style={iconStyle}/></span>
  			       <span className="Select-value-icon" style={iconContainerStyle} title="Move Left"
                     onClick={(e)=>this.repositionSort(e,sortOption, -1)}><ArrowBackIcon style={iconStyle}/></span>
               
  			       <span className="Select-value-label">{sortOption.label}</span>
  			       <span className="Select-value-icon" style={iconContainerStyle} title="Toggle Ascending/Descending"
                     onClick={(e)=>this.toggleSortAscDec(e, sortOption)}><FilterListIcon style={{...iconStyle, ...iconAscDecStyle}}/></span>
               
   			       <span className="Select-value-icon" style={iconContainerStyle} title="Move Right"
                     onClick={(e)=>this.repositionSort(e,sortOption, +1)}><ArrowForwardIcon style={iconStyle}/></span>
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
        sortChangeFn: (sort) => { 
          dispatch( AC.editStudentsSelCrit.sortChange(sort) ); // ?? new AC
        },
      }
    }
  }); // end of ... component property injection

// define expected props
SortValue.propTypes = {
};
