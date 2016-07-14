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
      ()=>`set mainPage from action.mainPage: '${action.mainPage}'`
    ];
  },

});

export default function mainPage(mainPage='', action) {
  return subReducer.resolve(mainPage, action);
}
