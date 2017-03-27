import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.selCrit.filter');

export default reducerHash.withLogging(log, {

  [AT.selCrit.edit.change.filter](filter, action) {

    // sync selCrit.filter from action.newFilter
    const newFilter = action.newFilter===null || action.newFilter.length===0
                       ? null
                       : action.newFilter.map( newFilterObj => {
                         return {
                           field: newFilterObj.field,
                           op:    newFilterObj.op,
                           value: newFilterObj.value
                         };
                       });
    return [newFilter, ()=>`convert action.newFilter to selCrit.filter: ${FMT(newFilter)}`];
  },

}, ''); // initialState
