'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.selectedView reducer
// ***

const reductionHandler = new ReductionHandler('appState.selectedView', {

  [AT.selectStudentsView.activate](selectedView, action) {
    return [
      'Students',
      ()=>"set selectedView to 'Students'"
    ];
  },

  [AT.selectCoursesView.activate](selectedView, action) {
    return [
      'Courses',
      ()=>"set selectedView to 'Courses'"
    ];
  },

});

export default function selectedView(selectedView='', action) {
  return reductionHandler.reduce(selectedView, action);
}
