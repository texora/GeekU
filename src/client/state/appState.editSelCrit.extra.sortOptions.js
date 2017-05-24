import actions        from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.extra.sortOptions');

export default reducerHash.withLogging(log, {
  [actions.selCrit.edit]: (sortOptions, action) => [action.sortOptions, ()=>'set sortOptions from action'],
}, []); // initialState
