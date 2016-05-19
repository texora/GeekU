'use strict';

import Log           from '../shared/util/Log';
import baseTheme     from 'material-ui/lib/styles/baseThemes/lightBaseTheme'; // or darkBaseTheme or lightBaseTheme
import ThemeManager  from 'material-ui/lib/styles/theme-manager';
import colors        from 'material-ui/lib/styles/colors';

const log = new Log('GeekU');

/*--------------------------------------------------------------------------------
   Define/promote the Material-UI Theme used in the GeekU App.
   --------------------------------------------------------------------------------*/

// define the baseTheme overides here
const muiThemeOverrides = {

  // NOTE: ColWidth demarcation for table column width and corresponding container size

  // example
  table: {
    // width: 'auto', // ColWidth: NOT HONORED AT THIS global muiTheme LEVEL (by Material-UI)
    // backgroundColor: '#ff0000',  // IS honored
  },

  tableRow: {
    height: 20,
  },

  tableRowColumn: {
    height: 20,
    fontSize: 30, // BAD ... this is HARDCODED in material-ui/lib/table/table-row-column.js ABSOLUTELY NO WAY TO CHANGE IT
  },

  paper: {
    // width: 'fit-content', // ColWidth: NOT HONORED AT THIS global muiTheme LEVEL (by Material-UI)
  },

  spacing: {
    desktopGutter: 16,
    desktopGutterMore: 24,
    desktopGutterLess: 18,
    desktopGutterMini: 4,
    desktopKeylineIncrement: 32,
    desktopDropDownMenuItemHeight: 16,
    desktopDropDownMenuFontSize: 7,
    desktopLeftNavMenuItemHeight: 24,
    desktopSubheaderHeight: 24,
    desktopToolbarHeight: 8,

    iconSize: 15,

    // from: material-ui/lib/styles/baseThemes/lightBaseTheme.js ...
    // iconSize: 24,
    // 
    // desktopGutter: 24,
    // desktopGutterMore: 32,
    // desktopGutterLess: 16,
    // desktopGutterMini: 8,
    // desktopKeylineIncrement: 64,
    // desktopDropDownMenuItemHeight: 32,
    // desktopDropDownMenuFontSize: 15,
    // desktopLeftNavMenuItemHeight: 48,
    // desktopSubheaderHeight: 48,
    // desktopToolbarHeight: 56
  },

  // from: material-ui/lib/styles/baseThemes/lightBaseTheme.js ...
  // fontFamily: 'Roboto, sans-serif',

  palette: {
    primary1Color:       colors.orangeA700,  // x teal500
    primary2Color:       colors.amber700,       // x teal700
    // primary3Color:       colors.grey400,
    accent1Color:        colors.deepOrangeA200, // x deepOrangeA200
    // accent2Color:        colors.grey100,
    // accent3Color:        colors.grey500,
    // textColor:           colors.darkBlack,
    // alternateTextColor:  colors.white,
    // canvasColor:         colors.white,
    // borderColor:         colors.grey300,
    pickerHeaderColor:   colors.orangeA700,  // x teal500
    // shadowColor:         colors.fullBlack,

    // from: material-ui/lib/styles/baseThemes/lightBaseTheme.js ...
    // ... made following mods (above)
    //      - change cyan to amber -or- teal
    //      - change pink to deepOrange
    // primary1Color:       colors.cyan500,
    // primary2Color:       colors.cyan700,
    // primary3Color:       colors.grey400,
    // accent1Color:        colors.pinkA200,
    // accent2Color:        colors.grey100,
    // accent3Color:        colors.grey500,
    // textColor:           colors.darkBlack,
    // alternateTextColor:  colors.white,
    // canvasColor:         colors.white,
    // borderColor:         colors.grey300,
    // pickerHeaderColor:   colors.cyan500,
    // shadowColor:         colors.fullBlack,
  },
};

// KEY: REALLY KRAPPY Material-UI HACK 
// ... for some reason ThemeManager.getMuiTheme() will NOT merge overrides for spacing/palette
// ... force feed it at the baseTheme level (i.e. the first param)
baseTheme.spacing = Object.assign(baseTheme.spacing, muiThemeOverrides.spacing);
baseTheme.palette = Object.assign(baseTheme.palette, muiThemeOverrides.palette);

const GeekUMuiTheme = ThemeManager.getMuiTheme(baseTheme, muiThemeOverrides);

log.debug(()=>`GeekUMuiTheme:`, GeekUMuiTheme);

export default GeekUMuiTheme;
