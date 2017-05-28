import actions        from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.extra.isNew');

export default reducerHash.withLogging(log, {
  [actions.selCrit.edit]: (isNew, action) => [action.isNew, ()=>'set isNew from action'],
}, false); // initialState
