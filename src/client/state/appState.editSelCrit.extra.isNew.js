import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.extra.isNew');

export default reducerHash.withLogging(log, {
  [AT.selCrit.edit]: (isNew, action) => [action.isNew, ()=>'set isNew from action'],
}, false); // initialState
