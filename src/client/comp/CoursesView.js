'use strict';

import React              from 'react';
import * as ReactRedux    from 'react-redux';

import autobind           from 'autobind-decorator';

import itemTypes          from '../../shared/model/itemTypes';

import {AC}               from '../actions';

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
    inProgress:      appState.itemsView.course.inProgress ? true : false,
    selCrit:         appState.itemsView.course.selCrit || {desc: 'please select a filter from the Left Nav menu'},

    items:           appState.itemsView.course.items,
    selectedItem:    appState.itemsView.course.selectedItem,
    itemsViewShown:  appState.itemsView.activeView===itemTypes.course,

    detailItem:      appState.itemsView.course.detailItem,
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
    return itemTypes.meta.course;
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
