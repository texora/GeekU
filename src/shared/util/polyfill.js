'use strict';

// inject ALL ES6 polyfills
// ... required by 
//     - all browsers that may be missing various ES6 features
//     - PhantomJS which currently is missing Symbol def (used in our client-side test modules) 
//     - ??? our server modules
// ... adds about 15KB to our bundle [minified/gzipped]
// ... see: https://github.com/zloirock/core-js
import 'core-js/es6';
