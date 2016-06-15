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

    render() {
      const { mainPage, haveStudentsBeenFetched, changeMainPageFn } = this.props;

      // ... why is MenuIcon the opposite color of the baseTheme?
      //     - I suspect because it is supposed to appear on the baseTheme background
      //     - I altered to white when displayed in my toolbar (which is darker on a light background)
      return <IconMenu iconButtonElement={ <IconButton><MenuIcon color="white"/></IconButton> }
                       targetOrigin={{vertical: 'top', horizontal: 'left', }}
                       anchorOrigin={{vertical: 'top', horizontal: 'left'}}>
        <MenuItem primaryText="Students" checked={mainPage==='students'} insetChildren={true} onTouchTap={()=>changeMainPageFn('students', haveStudentsBeenFetched)}/>
        <MenuItem primaryText="Courses"  checked={mainPage==='courses'}  insetChildren={true} onTouchTap={()=>changeMainPageFn('courses')}/>
      </IconMenu>;
    }
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        mainPage: appState.mainPage,
        haveStudentsBeenFetched: appState.students.selCrit, // TODO: hoaky work-around till we support batching of thunks
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        changeMainPageFn: (page, haveItemsBeenFetched) => { dispatch( changeMainPageFn(page, haveItemsBeenFetched) ) },
      }
    }
  }); // end of ... component property injection

// define expected props
LeftNav.propTypes = {
  changeMainPageFn: React.PropTypes.func, // .isRequired - injected via self's wrapper
}

export default LeftNav;

// TODO: hoaky work-around till we support batching of thunks
function changeMainPageFn(page, haveItemsBeenFetched) {
  if (page === 'students') {
    return haveItemsBeenFetched ? AC.changeMainPage(page) : AC.retrieveStudents({l8tr: 'ToDo'})
  }
  else {
    return AC.changeMainPage(page); // ??? we don't have AC.retrieveCourses() yet
  }
}
