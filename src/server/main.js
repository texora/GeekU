'use strict';

import './ServerSidePolyfill';
import './Log4GeekU'; // configure logs for GeekUApp (NOTE: include VERY early in our start-up process)
import * as GeekUApp from './GeekUApp';

// launch our GeekUApp
GeekUApp.createRunningApp('mongodb://localhost:27017/GeekU', 8080);
