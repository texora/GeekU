'use strict';

import React              from 'react';
import * as ReactRedux    from 'react-redux';
import autobind           from 'autobind-decorator';
import {AC}               from '../../actions';

import ArrowBackIcon           from 'material-ui/lib/svg-icons/navigation/arrow-back';
import ArrowForwardIcon        from 'material-ui/lib/svg-icons/navigation/arrow-forward';

import OptionDragHandle        from './OptionDragHandle';
import OptionDropHandle        from './OptionDropHandle';


/**
 * FieldValue custom control for field selection in react-select <Select>
 */

// NOTE: redux connection MUST be first to have props supplied to DnD higher-level-comps
@ReactRedux.connect( (appState, ownProps) => {
  return {
    selectedFieldOptions: appState.editSelCrit.extra.selectedFieldOptions,
  }
})

@autobind

export default class FieldValue extends React.Component {

  static propTypes = { // expected component props
  }

  static dndItemType = 'editSelCrit_displayFieldOrder'


  constructor(props, context) {
    super(props, context);
  }


  /**
   * handleSwapPosition()
   */
  handleSwapPosition(fieldOption, offset) {
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
   * handleReposition()
   */
  handleReposition(moveIndex,    // move selected options [moveIndex]
                   afterValue) { // to afterValue (null for start)
    const p = this.props;

    const moveOpt = p.selectedFieldOptions[moveIndex];
    const newOpts = [];
    if (!afterValue) {
      newOpts.push(moveOpt);
    }
    for (const opt of p.selectedFieldOptions) {
      if (opt.value !== moveOpt.value)
        newOpts.push(opt);
      if (opt.value === afterValue)
        newOpts.push(moveOpt);
    }

    p.dispatch( AC.selCrit.edit.fieldsChange(newOpts) );
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

    const dndHighlightStyle = {
      border: p.isDragOver ? '2px solid red' : ''
    };

    const optionIndex = p.selectedFieldOptions.findIndex( option => option.value===fieldOption.value);

		return (
      <span>
        {optionIndex===0 && 
         <OptionDropHandle dndItemType={FieldValue.dndItemType}
                           dropAfterIndex={-1}
                           handleRepositionFn={this.handleReposition}/>
        }
        <div className="Select-value">
			    <span className="Select-value-icon" title="Remove"
                onMouseDown={(e)=> {e.stopPropagation(); this.handleRemove(fieldOption);}}>x</span>
           
          {/* swap position arrow replaced with DnD
			    <span className="Select-value-icon" style={iconContainerStyle} title="Move Left"
                onMouseDown={(e)=> {e.stopPropagation(); this.handleSwapPosition(fieldOption, -1);}}><ArrowBackIcon style={iconStyle}/></span>
          */}
           
          {/* now accomplished by OptionDragHandle (below)
			    <span className="Select-value-label">{fieldOption.label}</span>
          */}
           
          <OptionDragHandle dndItemType={FieldValue.dndItemType}
                            option={fieldOption}
                            optionIndex={optionIndex}/>
           
          {/* swap position arrow replaced with DnD
 			    <span className="Select-value-icon" style={iconContainerStyle} title="Move Right"
                onMouseDown={(e)=> {e.stopPropagation(); this.handleSwapPosition(fieldOption, +1);}}><ArrowForwardIcon style={iconStyle}/></span>
          */}
        </div>

        <OptionDropHandle dndItemType={FieldValue.dndItemType}
                          dropAfterIndex={optionIndex}
                          afterOption={fieldOption}
                          handleRepositionFn={this.handleReposition}/>

      </span>
    );
  }
  
}

export default FieldValue;
