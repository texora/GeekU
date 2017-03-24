import * as AstxRedux  from 'astx-redux-util';
import {AT}            from '../actions';
import Log             from '../../shared/util/Log';

const log = new Log('appState.filters');


export default AstxRedux.joinReducers(
  // FIRST: maintain our filters
  AstxRedux.reducerHash.withLogging(log, {

    [AT.filters.retrieve.complete](filters, action) {
      return [
        action.filters,
        ()=>`set filters from action.filters: '${action.filters}'`
      ];
    },

    [AT.selCrit.changed](filters, action) {
      const changedSelCrit = action.selCrit;
      let   isNewEntry = true;
      const newFilters = filters.map( (selCrit) => {
        if (selCrit.key===changedSelCrit.key) {
          isNewEntry = false;
          return changedSelCrit;
        }
        else {
          return selCrit;
        }
      });
      if (isNewEntry) {
        newFilters.push(changedSelCrit);
      }
      return [
        newFilters,
        ()=>`sync filters with changed action.selCrit: '${FMT(action.selCrit)}'`
      ];
    },

    [AT.selCrit.delete.complete](filters, action) {
      const prunedFilters = filters.prune( selCrit => selCrit.key===action.selCrit.key );
      return [
        prunedFilters,
        ()=>`pruned filters with action.selCrit.key: '${action.selCrit.key}'`
      ];
    },
  }),

  AstxRedux.conditionalReducer(
    // SECOND: maintain filters sort order, WHENEVER filters change
    (filters, action, originalReducerState) => originalReducerState !== filters,
    (filters, action) => {
      filters.sort( (sc1, sc2) => { // OK to mutate (because of changed instance)
        return sc1.itemType.localeCompare(sc2.itemType) ||
               sc1.name    .localeCompare(sc2.name)     ||
               sc1.desc    .localeCompare(sc2.desc);
      });

      log.reducerProbe(action,
                       true,   // stateChanged
                       ()=>'maintain filters sort order (because filters changed)');

      return filters;
    }

  ), []); // initialState


//***
//*** Selectors ...
//***

export const getFilters = (filters) => filters;
