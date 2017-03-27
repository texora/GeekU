import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.selCrit.distinguishMajorSortField');

export default reducerHash.withLogging(log, {
  [AT.selCrit.edit.change.distinguishMajorSortField]: (distinguishMajorSortField, action) => [
    action.value,
    ()=>`set name from action.value: ${action.value}`
  ],
}, null); // initialState
