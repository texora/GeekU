import * as Redux       from 'redux';
import * as AstxRedux   from 'astx-redux-util';
import actions          from '../actions';
import Log              from '../../shared/util/Log';

import isNew                from './appState.editSelCrit.extra.isNew';
import meta                 from './appState.editSelCrit.extra.meta';
import fieldOptions         from './appState.editSelCrit.extra.fieldOptions';
import selectedFieldOptions from './appState.editSelCrit.extra.selectedFieldOptions';
import sortOptions          from './appState.editSelCrit.extra.sortOptions';
import selectedSortOptions  from './appState.editSelCrit.extra.selectedSortOptions';
import startingCurHash      from './appState.editSelCrit.extra.startingCurHash';
import syncDirective        from './appState.editSelCrit.extra.syncDirective';

const log = new Log('appState.editSelCrit.extra');

export default AstxRedux.joinReducers(
  // FIRST: determine content shape (i.e. {} or null)
  AstxRedux.reducerHash.withLogging(log, {
    [actions.selCrit.edit]:       (extra, action) => [{},   ()=>'set extra to new structure'],
    [actions.selCrit.edit.close]: (extra, action) => [null, ()=>'set extra to null'],
  }),
  AstxRedux.conditionalReducer(
    // SECOND: maintain individual extra fields
    //         ONLY when extra has content (i.e. is being edited)
    (extra, action, originalReducerState) => extra !== null,
    Redux.combineReducers({
      isNew,
      syncDirective,
      meta,
      fieldOptions,
      selectedFieldOptions,
      sortOptions,
      selectedSortOptions,
      startingCurHash,
    })
  ), null); // initialState
