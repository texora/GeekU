'use strict';

import React              from 'react';
import * as ReactRedux    from 'react-redux';
import autobind           from 'autobind-decorator';
import {AC}               from '../../actions';

import ArrowBackIcon           from 'material-ui/lib/svg-icons/navigation/arrow-back';
import ArrowForwardIcon        from 'material-ui/lib/svg-icons/navigation/arrow-forward';
import FilterListIcon          from 'material-ui/lib/svg-icons/content/filter-list';

import OptionDragHandle        from './OptionDragHandle';
import OptionDropHandle        from './OptionDropHandle';

/**
 * SortValue custom control for sort selection in react-select <Select>
 */

// NOTE: redux connection MUST be first to have props supplied to DnD higher-level-comps
@ReactRedux.connect( (appState, ownProps) => {
  return {
    selectedSortOptions: appState.editSelCrit.extra.selectedSortOptions,
  }
})

@autobind

export default class SortValue extends React.Component {

  constructor(props, context) {
    super(props, context);
  }


  /**
   * handleAscDecToggle()
   */
  handleAscDecToggle(sortOption) {
    const p = this.props;

    // adjust array copy (immutable) by toggling ascDec of selected option
    const selectedSortOptions = p.selectedSortOptions.map( (sortOp) => {
      return sortOp.value === sortOption.value
               ? { ...sortOp, ascDec: sortOp.ascDec * -1 }
               : sortOp;
    });

    p.dispatch( AC.selCrit.edit.sortChange(selectedSortOptions) );
  }
  

  /**
   * handleSwapPosition()
   */
  handleSwapPosition(sortOption, offset) {
    const p = this.props;

    // adjust array copy (immutable) by swapping the specified entry with it's adjacent entry
    const indxA = p.selectedSortOptions.findIndex( (sortOp) => sortOp.value === sortOption.value );
    const indxB = indxA + offset;
    if (indxB < 0 || indxB > p.selectedSortOptions.length-1)
      return; // can't move first/last elm
    const selectedSortOptions = [...p.selectedSortOptions]; // new working copy (immutable)
    selectedSortOptions[indxA] = p.selectedSortOptions[indxB];
    selectedSortOptions[indxB] = p.selectedSortOptions[indxA];

    p.dispatch( AC.selCrit.edit.sortChange(selectedSortOptions) );
  }

  
  /**
   * handleReposition()
   */
  handleReposition(moveIndex,    // move selected options [moveIndex]
                   afterValue) { // to afterValue (null for start)
    const p = this.props;

    const moveOpt = p.selectedSortOptions[moveIndex];
    const newOpts = [];
    if (!afterValue) {
      newOpts.push(moveOpt);
    }
    for (const opt of p.selectedSortOptions) {
      if (opt.value !== moveOpt.value)
        newOpts.push(opt);
      if (opt.value === afterValue)
        newOpts.push(moveOpt);
    }

    p.dispatch( AC.selCrit.edit.sortChange(newOpts) );
  }


  /**
   * handleRemove()
   */
  handleRemove(sortOption) {
    const p = this.props;

    // adjust array copy (immutable)  by removing the specified entry
    const selectedSortOptions = p.selectedSortOptions.filter( (sortOp) => sortOp.value !== sortOption.value );

    p.dispatch( AC.selCrit.edit.sortChange(selectedSortOptions) );
  }
  

  /**
   * render()
   */
  render() {
    const p = this.props;

    const sortOption = p.value; // value (the options entry with value/label) is the only property of interest

    const iconContainerStyle = {
      padding: '1'
    };
    const iconStyle = {
      width:  12,
      height: 12,
    };

    const iconAscDecStyle = { // default icon (<FilterListIcon>) points down (v) meaning decending
    };
    if (sortOption.ascDec > 0) { // make ascending point up
      iconAscDecStyle.transform = 'rotate(180deg)';
    }

    const dndHighlightStyle = {
        border: p.isDragOver ? '2px solid red' : ''
     };

    const optionIndex = p.selectedSortOptions.findIndex( option => option.value===sortOption.value);

    return (
      <span>
        {optionIndex===0 && 
          <OptionDropHandle dndItemType="editSelCrit_orderByField"
                            dropAfterIndex={-1}
                            handleRepositionFn={this.handleReposition}/>
        }

        <div className="Select-value" style={dndHighlightStyle}>
          <span className="Select-value-icon" title="Remove"
                onMouseDown={(e)=> {e.stopPropagation(); this.handleRemove(sortOption);}}>x</span>

          {/* swap position arrow replaced with DnD
          <span className="Select-value-icon" style={iconContainerStyle} title="Move Left"
                onMouseDown={(e)=> {e.stopPropagation(); this.handleSwapPosition(sortOption, -1);}}><ArrowBackIcon style={iconStyle}/></span>
          */}

          <span className="Select-value-icon" style={iconContainerStyle} title="Toggle Ascending/Descending"
                onMouseDown={(e)=> {e.stopPropagation(); this.handleAscDecToggle(sortOption);}}><FilterListIcon style={{...iconStyle, ...iconAscDecStyle}}/></span>
      
          {/* now accomplished by OptionDragHandle (below)
          <span className="Select-value-label">{sortOption.label}</span>
          */}

          <OptionDragHandle dndItemType="editSelCrit_orderByField"
                            option={sortOption}
                            optionIndex={optionIndex}/>
          
          {/* swap position arrow replaced with DnD
          <span className="Select-value-icon" style={iconContainerStyle} title="Move Right"
          onMouseDown={(e)=> {e.stopPropagation(); this.handleSwapPosition(sortOption, +1);}}><ArrowForwardIcon style={iconStyle}/></span>
          */}

        </div>

        <OptionDropHandle dndItemType="editSelCrit_orderByField"
                          dropAfterIndex={optionIndex}
                          afterOption={sortOption}
                          handleRepositionFn={this.handleReposition}/>
      </span>
    );
  }
  
}

// define expected props
SortValue.propTypes = {
};

export default SortValue;
