import * as Redux       from 'redux';
import * as AstxRedux   from 'astx-redux-util';
import {AT}             from '../actions';
import SelCrit          from '../../shared/domain/SelCrit';
import Log              from '../../shared/util/Log';

import placebo  from './placeboReducer';
import name     from './appState.editSelCrit.selCrit.name';
import desc     from './appState.editSelCrit.selCrit.desc';
import fields   from './appState.editSelCrit.selCrit.fields';
import sort     from './appState.editSelCrit.selCrit.sort';
import filter   from './appState.editSelCrit.selCrit.filter';
import distinguishMajorSortField from './appState.editSelCrit.selCrit.distinguishMajorSortField';

const log         = new Log('appState.editSelCrit.selCrit');
const log4curHash = new Log('appState.editSelCrit.selCrit.curHash');

export default AstxRedux.joinReducers(
  // FIRST: determine content shape (i.e. {} or null)
  AstxRedux.reducerHash.withLogging(log, {
    [AT.selCrit.edit]:       (selCrit, action) => [action.selCrit, ()=>`set selCrit from action.selCrit: ${FMT(action.selCrit)}`],
    [AT.selCrit.edit.close]: (selCrit, action) => [null,           ()=>'set selCrit to null'],
  }),
  AstxRedux.conditionalReducer(
    // NEXT: maintain individual selCrit fields
    //       ONLY when selCrit has content (i.e. is being edited)
    (selCrit, action, originalReducerState) => selCrit !== null,
    AstxRedux.joinReducers(
      Redux.combineReducers({
        _id:      placebo,
        key:      placebo,
        userId:   placebo,
        itemType: placebo,
        lastDbModDate: placebo,

        name,
        desc,

        fields,
        sort,
        distinguishMajorSortField,
        filter,

        dbHash:  placebo,
        curHash: placebo,
      }),
      AstxRedux.conditionalReducer(
        // LAST: maintain curHash
        //       ONLY when selCrit has content (see condition above) -AND- has changed
        (selCrit, action, originalReducerState) => originalReducerState !== selCrit,
        (selCrit, action) => {
          const priorHash = selCrit.curHash;

          selCrit.curHash = SelCrit.hash(selCrit); // OK to mutate (because of changed instance)

          log4curHash.reducerProbe(action,
                                   priorHash !== selCrit.curHash,
                                   ()=>`resetting selCrit.curHash (because selCrit changed) FROM: '${priorHash}' TO: '${selCrit.curHash}'`);
          return selCrit;
        })
    )
  ), null); // initialState
