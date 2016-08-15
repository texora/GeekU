'use strict';

/**
 * Format the supplied item, suitable for human comsumption.  A
 * variety of different data types are supported.
 *
 * NOTE: This utility is so prolific that it is also promoted as a
 *       global FMT(item) pollyfill.  This is a convenience, allowing
 *       usage without import.
 *
 * @param {any} item the item to format.
 *
 * @return {string} the formatted item.
 */
export default function formatItem(item) {

  if (item===undefined)
    return 'undefined';

  if (item===null)
    return 'null';

  const itemType = typeof item;

  if (itemType==='function')
    return 'function';

  if (itemType==='string')
    return `'${item}'`;

  if (item.toISOString) // Date (duct type)
    return item.toISOString(); // ex: 2011-10-05T14:48:00.000Z

  // handle general objects using JSON pretty-print
  // NOTE: we allow Arrays to be processed here too
  if (itemType==='object')
    return JSON.stringify(item, null, 2);

  // all other cases, assume it can handle itself (ex: number)
  return item;
}
