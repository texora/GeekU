'use strict';

import React              from 'react';
import * as ReactRedux    from 'react-redux';

import {autobind}         from 'core-decorators';

import itemTypes          from '../../shared/domain/itemTypes';
const  myItemType         = itemTypes.course;

import selectors          from '../state';

import FontIcon           from 'material-ui/lib/font-icon';
import TableRowColumn     from 'material-ui/lib/table/table-row-column';

import colors             from 'material-ui/lib/styles/colors';

import ItemsView          from './ItemsView';
import CourseDialog       from './CourseDialog';


/**
 * The CoursesView component implements the view displaying a course list.
 */

@ReactRedux.connect( (appState, ownProps) => {
  return {
    // NOTE: some of thes properties may only be used by our base class (ItemsView)
    itemsViewShown:  selectors.getActiveView            (appState) === myItemType,

    selectedItem:    selectors.getItemsViewSelectedItem (appState, myItemType),
    detailItem:      selectors.getItemsViewDetailItem   (appState, myItemType),

    inProgress:      selectors.isItemsViewInProgress    (appState, myItemType),
    selCrit:         selectors.getItemsViewSelCrit      (appState, myItemType),
    items:           selectors.getItemsViewItems        (appState, myItemType),
  }
})

@autobind

export default class CoursesView extends ItemsView {

  static propTypes = { // expected component props
  }


  constructor(props, context) {
    super(props, context);
  }


  /**
   * Return the meta object describing the concrete item being displayed.
   *
   * DERIVATION-HOOK
   */
  meta() {
    return itemTypes.meta[myItemType];
  }


  /**
   * Render the Dialog element that manages the item-type detail.
   *
   * @return {Element}
   *
   * DERIVATION-HOOK
   */
  renderDetailDialog() {
    return <CourseDialog/>;
  }

}
