import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import itemTypes      from '../../shared/domain/itemTypes';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.extra.selectedFieldOptions');

export default reducerHash.withLogging(log, {

  [AT.selCrit.edit](selectedFieldOptions, action) {

    // convert selCrit.fields to selectedFieldOptions
    const meta   = itemTypes.meta[action.selCrit.itemType];
    const fields = action.selCrit.fields || [];

    const newSelectedFieldOptions = fields.map( (field) => {
      return {
        value:  field,
        label:  meta.validFields[field]
      };
    });
    
    return [
      newSelectedFieldOptions,
      ()=>`convert selCrit.field to selectedFieldOptions: ${FMT(newSelectedFieldOptions)}`
    ];
  },

  [AT.selCrit.edit.change.fields](selectedFieldOptions, action) {
    return [
      action.selectedFieldOptions,
      ()=>`set selectedFieldOptions from action.selectedFieldOptions: ${FMT(action.selectedFieldOptions)}`
    ];
  },

}, []); // initialState
