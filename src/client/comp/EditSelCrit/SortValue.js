'use strict';

import React              from 'react';
import ReduxUtil          from '../../util/ReduxUtil';
import autoBindAllMethods from '../../../shared/util/autoBindAllMethods';
import {AC}               from '../../actions';

import ArrowBackIcon           from 'material-ui/lib/svg-icons/navigation/arrow-back';
import ArrowForwardIcon        from 'material-ui/lib/svg-icons/navigation/arrow-forward';
import FilterListIcon          from 'material-ui/lib/svg-icons/content/filter-list';


/**
 * SortValue custom control for sort selection in react-select <Select>
 */
const SortValue = ReduxUtil.wrapCompWithInjectedProps(

  class SortValue extends React.Component {
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
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
     * handleReposition()
     */
    handleReposition(sortOption, offset) {
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
  	render () {
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

  		return <div className="Select-value">
  			<span className="Select-value-icon" title="Remove"
              onMouseDown={(e)=> {e.stopPropagation(); this.handleRemove(sortOption);}}>x</span>
  			<span className="Select-value-icon" style={iconContainerStyle} title="Move Left"
              onMouseDown={(e)=> {e.stopPropagation(); this.handleReposition(sortOption, -1);}}><ArrowBackIcon style={iconStyle}/></span>
        
  			<span className="Select-value-label">{sortOption.label}</span>
  			<span className="Select-value-icon" style={iconContainerStyle} title="Toggle Ascending/Descending"
              onMouseDown={(e)=> {e.stopPropagation(); this.handleAscDecToggle(sortOption);}}><FilterListIcon style={{...iconStyle, ...iconAscDecStyle}}/></span>
        
   			<span className="Select-value-icon" style={iconContainerStyle} title="Move Right"
              onMouseDown={(e)=> {e.stopPropagation(); this.handleReposition(sortOption, +1);}}><ArrowForwardIcon style={iconStyle}/></span>
      </div>;
    }
    
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        selectedSortOptions: appState.editSelCrit.extra.selectedSortOptions,
      }
    }
  }); // end of ... component property injection

// define expected props
SortValue.propTypes = {
};

export default SortValue;
