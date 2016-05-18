'use strict';

import './ClientSidePolyfill';
import './Log4GeekU'; // configure logs for GeekUApp (NOTE: include VERY early in our start-up process)
import React     from 'react';
import ReactDOM  from 'react-dom';
import GeekUApp  from './GeekUApp';

// render our GeekUApp react component
ReactDOM.render(<GeekUApp/>, document.getElementById('app'));
