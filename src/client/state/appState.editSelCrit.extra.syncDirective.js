import actions        from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.extra.syncDirective');

export default reducerHash.withLogging(log, {
  [actions.selCrit.edit]: (syncDirective, action) => [action.syncDirective, ()=>'set syncDirective from action'],
}, false); // initialState
