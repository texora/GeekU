'use strict'

import {AT}             from './actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.mainPage reducer
// ***

const reductionHandler = new ReductionHandler('appState.mainPage', {

  [AT.changeMainPage](mainPage, action) {
    return [
      action.mainPage,
      ()=>`set mainPage from action.mainPage: '${action.mainPage}'`
    ];
  },

});

export default function mainPage(mainPage='', action) {
  return reductionHandler.reduce(mainPage, action);
}
