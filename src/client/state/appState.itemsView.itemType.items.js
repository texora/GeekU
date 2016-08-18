'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';
import itemTypes        from '../../shared/model/itemTypes';


// ***
// *** appState.itemsView.itemType.items reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function items(_itemType) {

  const reductionHandler = new ReductionHandler(`appState.itemsView.${_itemType}.items`, {

    [AT.itemsView.retrieveComplete](items, action) {
      return [
        action.items,
        ()=>`set items from action: ${action.items.length} itemTypes.meta[action.itemType].label.plural`
      ];
    },

    [AT.detailStudent.retrieve.complete](items, action) {
      // TODO: conditional check is a hack ... suspect will be cleaned up if/when we refactor the detail stuff
      if (action.itemType === itemTypes.student) {
        return [
          items.map( (student) => {
            return action.student.studentNum===student.studentNum ? action.student : student
          }),
          ()=>`patching detail student into items[] from action.student: ${action.student.studentNum}`
        ];
      }
      // TODO: not right ... needs to be under AT.detailCourse (SEE TODO above)
      else if (action.itemType === itemTypes.course) {
        return [
          items.map( (course) => {
            return action.course.courseNum===course.courseNum ? action.course : course
          }),
          ()=>`patching detail course into items[] from action.course: ${action.course.courseNum}`
        ];
      }
    },

    [AT.selCrit.delete.complete](items, action) {
      // sync when our view has been impacted by selCrit deletion
      if (action.impactView===_itemType) {
        return [
          [],
          ()=>'clear items ([]) becase our view is based on deleted selCrit'
        ];
      }
      // no-sync when our view is not impacted by selCrit deletion
      // ?? test ... with enhacement to ReductionHandler, we can OMIT THIS
      else {
        return [
          items,
          ()=>'no change to items because our view is NOT based on deleted selCrit'
        ];
      }
    },
    
  });
  
  return function items(items=[], action) {
    return reductionHandler.reduce(items, action);
  }

}
