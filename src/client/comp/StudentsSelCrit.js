'use strict';

import React              from 'react';
import ReduxUtil          from '../util/ReduxUtil';

import autoBindAllMethods from '../../shared/util/autoBindAllMethods';

import {AC}               from '../state/actions';

import Dialog             from 'material-ui/lib/dialog';


/**
 * The StudentsSelCrit component edits the selCrit for a Students retrieval.
 */
const StudentsSelCrit = ReduxUtil.wrapCompWithInjectedProps(

  class StudentsSelCrit extends React.Component { // component definition
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }

    render() {
      const { selCrit, closeDialogFn } = this.props;

      return (
        <Dialog modal={false}
                open={true}
                autoScrollBodyContent={true}
                onRequestClose={closeDialogFn}
                contentStyle={{
                    width:         '90%',
                    maxWidth:      'none',
                    verticalAlign: 'top',
                  }}>

          EDIT Students selCrit: {selCrit.name}!

        </Dialog>
      );
    }
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        selCrit:  appState.students.selCrit,
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        closeDialogFn: () => { dispatch( AC.editStudentsSelCrit.close() )}, // ??? we really want to refresh retrieval too (think need thunk batching)
      }
    }
  }); // end of ... component property injection

// define expected props
StudentsSelCrit.propTypes = {
}

export default StudentsSelCrit;
