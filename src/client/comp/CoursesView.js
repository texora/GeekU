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
// import Course             from './Course'; // ?? when defined


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
   * Handle the "detail item dialog" request.
   *
   * @param {string} courseNum the courseNum to detail.
   * @param {boolean} editMode an indicator as to whether the item
   * dialog should start out in edit-mode (true) or view-mode (false).
   *
   * DERIVATION-HOOK
   */
  handleDetailItemDialog(courseNum, editMode) {
    const p = this.props;
    alert('??? TODO: Course Detail Dialog');
    // p.dispatch( AC.detailCourse(courseNum, editMode) );
  }


  /**
   * Render the Dialog element that manages the item-type detail.
   *
   * @return {Element}
   *
   * DERIVATION-HOOK
   */
  renderDetailDialog() {
    return null; // ??? temp for now
    // return <Course/>;
  }

}
