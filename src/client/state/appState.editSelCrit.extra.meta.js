import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.extra.meta');

export default reducerHash.withLogging(log, {
  [AT.selCrit.edit]: (meta, action) => [action.meta, ()=>'set meta from action'],
}, {}); // initialState
