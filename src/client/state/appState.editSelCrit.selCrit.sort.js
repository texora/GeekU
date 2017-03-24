import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.selCrit.sort');

export default reducerHash.withLogging(log, {
  [AT.selCrit.edit.change.sort](sort, action) {
    const selectedSortOptions = action.selectedSortOptions;

    // sync selCrit.sort from selectedSortOptions
    const newSort = selectedSortOptions===null || selectedSortOptions.length===0
                     ? null
                     : selectedSortOptions.map( sortOption => `${sortOption.ascDec === -1 ? '-' : ''}${sortOption.value}` );
    return [newSort, ()=>`convert selectedSortOptions to selCrit.sort: ${FMT(newSort)}` ];
  },
}, null); // initialState
