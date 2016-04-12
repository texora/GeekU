'use strict';

import '../shared/util/polyfill';
import './Log4GeekU'; // NOTE: must be included VERY early in our start-up process
import * as GeekUApp from './GeekUApp';

GeekUApp.createRunningApp('mongodb://localhost:27017/GeekU', 8080);
