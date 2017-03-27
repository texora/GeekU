'use strict';

import '../../shared/util/polyfill';       // our standarad polyfill (for both client/server)
import './astx-redux-util_loggerPolyfill'; // polyfill the astx-redux-util library .withLogging() extensions

import injectTapEventPlugin from 'react-tap-event-plugin';

// Material-UI components use react-tap-event-plugin (onTouchTap event) 
// to listen for touch events because onClick is not fast enough.
// This dependency is temporary and can go away with react 1.0 release
// ... https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();
