import actions        from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.extra.meta');

export default reducerHash.withLogging(log, {
  [actions.selCrit.edit]: (meta, action) => [action.meta, ()=>'set meta from action'],
}, {}); // initialState
