'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.mainPage reducer
// ***

const subReducer = new ReduxSubReducer('appState.mainPage', {

  [AT.changeMainPage](mainPage, action) {
    return [
      action.mainPage,
      ()=>`set mainPage to: '${action.mainPage}'`
    ];
  },

  // TODO: temporary work-around ... REMOVE once we have the ability to batch thunks (changing logic in LeftNav.js)
  [AT.retrieveStudents.start](mainPage, action) {
    return [
      'students',
      ()=>"set mainPage to: 'students'"
    ];
  },

});

export default function mainPage(mainPage='', action) {
  return subReducer.resolve(mainPage, action);
}
