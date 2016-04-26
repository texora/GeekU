'use strict';

import '../shared/util/polyfill'; // our standarad polyfill (for both client/server)
import * as cls from 'continuation-local-storage';
import patchIt  from 'cls-domains-promise';

// create our app's continuation-local-storage namespace
// ... similar to Java's thread-local, but is based on chains of 
//     Node-style callbacks instead of threads
const namespace = cls.createNamespace('GeekU');

// patch our promise callbacks to work with continuation-local-storage
// ... this merely binds the namespace to all promise callbacks
// ... without this our promise callbacks loose the cls namespace
patchIt(namespace, Promise.prototype);
