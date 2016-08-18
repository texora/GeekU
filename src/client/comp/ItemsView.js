'use strict';

import React    from 'react';
import autobind from 'autobind-decorator';


/**
 * The ItemsView component is a base class that implements common features of all view items display (i.e. students/courses).
 *
 * Because ItemsView is abstract, a concrete class must be defined that identifies the itemType of interest (i.e. student/course).
 *
 * ??? work on this doc
 */

@autobind

export default class ItemsView extends React.Component {

  static propTypes = { // expected component props

    // ??? pick items I may use here
    inProgress:      React.PropTypes.bool.isRequired,
    selCrit:         React.PropTypes.object.isRequired,

    items:           React.PropTypes.array.isRequired,
    selectedItem:    React.PropTypes.object.isRequired,
    itemsViewShown:  React.PropTypes.bool.isRequired,

    detailItem:      React.PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
  }

  // ??? incrementally PULL up common functionality

}
