import actions        from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.editSelCrit.selCrit.fields');

export default reducerHash.withLogging(log, {

  [actions.selCrit.edit.change.fields](fields, action) {
    const selectedFieldOptions = action.selectedFieldOptions;

    // sync selCrit.fields from selectedFieldOptions
    const newFields = selectedFieldOptions===null || selectedFieldOptions.length===0
                    ? null
                    : selectedFieldOptions.map( (fieldOption) => fieldOption.value );
    return [
      newFields,
      ()=>`convert selectedFieldOptions to selCrit.fields: ${FMT(newFields)}`
    ];
  },
}, null); // initialState
