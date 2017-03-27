import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.extra.startingCurHash');

export default reducerHash.withLogging(log, {
  [AT.selCrit.edit]: (startingCurHash, action) => [action.selCrit.curHash,
                                                   ()=>'set startingCurHash from action.selCrit.curHash'],
}, null); // initialState
