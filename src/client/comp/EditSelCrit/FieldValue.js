'use strict';

import React              from 'react';
import ReduxUtil          from '../../util/ReduxUtil';
import autoBindAllMethods from '../../../shared/util/autoBindAllMethods';
import {AC}               from '../../state/actions';

import ArrowBackIcon           from 'material-ui/lib/svg-icons/navigation/arrow-back';
import ArrowForwardIcon        from 'material-ui/lib/svg-icons/navigation/arrow-forward';


/**
 * FieldValue custom control for field selection in react-select <Select>
 */
const FieldValue = ReduxUtil.wrapCompWithInjectedProps(

  class FieldValue extends React.Component {
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }


    /**
     * handleReposition()
     */
    handleReposition(fieldOption, offset) {
      const p = this.props;

      // adjust array copy (immutable) by swapping the specified entry with it's adjacent entry
      const indxA = p.selectedFieldOptions.findIndex( (fieldOp) => fieldOp.value === fieldOption.value );
      const indxB = indxA + offset;
      if (indxB < 0 || indxB > p.selectedFieldOptions.length-1)
        return; // can't move first/last elm
      const selectedFieldOptions  = [...p.selectedFieldOptions]; // new working copy (immutable)
      selectedFieldOptions[indxA] = p.selectedFieldOptions[indxB];
      selectedFieldOptions[indxB] = p.selectedFieldOptions[indxA];

      p.dispatch( AC.selCrit.edit.fieldsChange(selectedFieldOptions) );
    }


    /**
     * handleRemove()
     */
    handleRemove(fieldOption) {
      const p = this.props;

      // adjust array copy (immutable)  by removing the specified entry
      const selectedFieldOptions = p.selectedFieldOptions.filter( (fieldOp) => fieldOp.value !== fieldOption.value );

      p.dispatch( AC.selCrit.edit.fieldsChange(selectedFieldOptions) );
    }
    

    /**
     * render()
     */
  	render() {
      const p = this.props;

      const fieldOption = p.value; // value (the options entry with value/label) is the only property of interest

      const iconContainerStyle = {
        padding: '1'
      };
      const iconStyle = {
        width:  12,
        height: 12,
      };

  		return <div className="Select-value">
  			<span className="Select-value-icon" title="Remove"
              onMouseDown={(e)=> {e.stopPropagation(); this.handleRemove(fieldOption);}}>x</span>

  			<span className="Select-value-icon" style={iconContainerStyle} title="Move Left"
              onMouseDown={(e)=> {e.stopPropagation(); this.handleReposition(fieldOption, -1);}}><ArrowBackIcon style={iconStyle}/></span>
        
  			<span className="Select-value-label">{fieldOption.label}</span>
        
   			<span className="Select-value-icon" style={iconContainerStyle} title="Move Right"
              onMouseDown={(e)=> {e.stopPropagation(); this.handleReposition(fieldOption, +1);}}><ArrowForwardIcon style={iconStyle}/></span>
      </div>;
    }
    
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        selectedFieldOptions: appState.editSelCrit.extra.selectedFieldOptions,
      }
    }
  }); // end of ... component property injection

// define expected props
FieldValue.propTypes = {
};

export default FieldValue;
