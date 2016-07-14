'use strict';

import React              from 'react';
import ReduxUtil          from '../util/ReduxUtil';
import IconButton         from 'material-ui/lib/icon-button';
import IconMenu           from 'material-ui/lib/menus/icon-menu';
import MenuItem           from 'material-ui/lib/menus/menu-item';
import MenuIcon           from 'material-ui/lib/svg-icons/navigation/menu';
import autoBindAllMethods from '../../shared/util/autoBindAllMethods';
import {AC}               from '../state/actions';

/**
 * GeekU LeftNav component.
 */
const LeftNav = ReduxUtil.wrapCompWithInjectedProps(

  class LeftNav extends React.Component { // component definition
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }

    handleStudentsSelection() {
      const p = this.props;

      const actions = [ AC.changeMainPage('Students') ];

      // when the view contains NO data, also perform an initial default retrieval
      if (!p.studentsSelCrit) {
        actions.push(AC.retrieveStudents(null));  // TODO: null selCrit is temporary for now
      }

      p.dispatch( actions );
    }
    
    handleCoursesSelection() {
      const p = this.props;

      const actions = [ AC.changeMainPage('Courses') ];

      // when the view contains NO data, also perform an initial default retrieval
      // TODO: add this with courses are supported
      // ? if (!p.coursesSelCrit)
      // ?   actions.push(AC.retrieveCourses(bla));
      // ? }

      p.dispatch( actions );
    }

    render() {
      const p = this.props;

      // ... why is MenuIcon the opposite color of the baseTheme?
      //     - I suspect because it is supposed to appear on the baseTheme background
      //     - I altered to white when displayed in my toolbar (which is darker on a light background)
      return <IconMenu iconButtonElement={ <IconButton><MenuIcon color="white"/></IconButton> }
                       targetOrigin={{vertical: 'top', horizontal: 'left', }}
                       anchorOrigin={{vertical: 'top', horizontal: 'left'}}>
        <MenuItem primaryText="Students" checked={p.mainPage==='Students'} insetChildren={true} onTouchTap={this.handleStudentsSelection}/>
        <MenuItem primaryText="Courses"  checked={p.mainPage==='Courses'}  insetChildren={true} onTouchTap={this.handleCoursesSelection}/>
      </IconMenu>;
    }
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        mainPage:        appState.mainPage,
        studentsSelCrit: appState.students.selCrit,
     // coursesSelCrit:  appState.courses.selCrit,  // TODO: add this with courses are supported

      }
    }
  }); // end of ... component property injection

// define expected props
LeftNav.propTypes = {
}

export default LeftNav;
