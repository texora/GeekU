import actions        from '../actions';
import {reducerHash}  from 'astx-redux-util';
import itemTypes      from '../../shared/domain/itemTypes';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.extra.selectedSortOptions');

export default reducerHash.withLogging(log, {

  [actions.selCrit.edit](selectedSortOptions, action) {

    // convert selCrit.sort to selectedSortOptions
    const meta                   = itemTypes.meta[action.selCrit.itemType];
    const newSelectedSortOptions = (action.selCrit.sort || []).map( field => {
      const ascDec = field.charAt(0) === '-' ? -1 : +1;
      if (ascDec === -1) {
        field = field.substr(1); // strip first char (a negative sign "-xxx")
      }
      return {
        value:  field,
        label:  meta.validFields[field],
        ascDec
      };
    });

    return [
      newSelectedSortOptions,
      ()=>`convert selCrit.sort to selectedSortOptions: ${FMT(newSelectedSortOptions)}`
    ];
  },

  [actions.selCrit.edit.change.sort](selectedSortOptions, action) {
    return [
      action.selectedSortOptions,
      ()=>`set selectedSortOptions from action.selectedSortOptions: ${FMT(action.selectedSortOptions)}`
    ];
  },
}, []); // initialState
