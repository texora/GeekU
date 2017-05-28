import actions        from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.selCrit.desc');

export default reducerHash.withLogging(log, {
  [actions.selCrit.edit.change.desc]: (desc, action) => [action.desc, ()=>`set desc from action.desc: ${action.desc}`],
}, ''); // initialState
