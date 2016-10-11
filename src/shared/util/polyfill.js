'use strict';

// inject ALL ES6 polyfills
// ... required by 
//     - all browsers that may be missing various ES6 features
//     - PhantomJS which currently is missing Symbol def (used in our client-side test modules) 
// ... adds about 15KB to our bundle [minified/gzipped]
// ... see: https://github.com/zloirock/core-js
import 'core-js/es6';

// MY Error polyfill extension
import './ErrorExtensionPolyfill';

// fetch polyfill ... serves BOTH browser and node
import 'isomorphic-fetch';

import formatItem from './formatItem';

const root = typeof(window) === 'undefined' ? global : window;


//***
//*** FMT(item): Format the supplied item, suitable for human comsumption.  A
//***            variety of different data types are supported.
//***            Convenient global alias of formatItem(item), because it is so heavly used.
//***

if (!root.FMT) {
  root.FMT = formatItem;
}


//***
//*** Array.prototype.prune(callback): return a new array, pruning elements where callback returns true.
//***

if (!Array.prototype.prune) {
  Array.prototype.prune = function(callback) {
    return this.reduce( (retArr, item) => {
      if (!callback(item)) {
        retArr.push(item);
      }
      return retArr;
    }, []);
  };
}



//***
//*** Array.prototype.includes(): Determines whether an array includes a certain element, returning true or false as appropriate.
//***                             Part of ECMAScript 2016 (ECMA-262).
//***                             FROM: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes

if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.includes called on null or undefined');
    }

    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1], 10) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
          (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
            return true;
      }
      k++;
    }
    return false;
  };
}
