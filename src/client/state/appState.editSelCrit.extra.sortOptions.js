import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.extra.sortOptions');

export default reducerHash.withLogging(log, {
  [AT.selCrit.edit]: (sortOptions, action) => [action.sortOptions, ()=>'set sortOptions from action'],
}, []); // initialState
