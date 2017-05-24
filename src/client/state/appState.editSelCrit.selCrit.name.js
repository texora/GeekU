import actions        from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.selCrit.name');

export default reducerHash.withLogging(log, {
  [actions.selCrit.edit.change.name]: (name, action) => [action.name, ()=>`set name from action.name: ${action.name}`],
}, ''); // initialState
