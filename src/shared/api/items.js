'use strict';

import geekUFetch           from './geekUFetch';
import {getBaseUrl}         from './baseUrl';
import itemTypes            from '../domain/itemTypes';
import {encodeJsonQueryStr} from '../util/QueryStrUtil';
import Log                  from '../util/Log';
import LogMix               from '../util/LogMix';


/**
 * Retrieve a list of items (ex: Courses/Students) from the supplied
 * selCrit.
 * 
 * NOTE: The data content of each returned item is controlled through 
 *       the specified selCrit.fields array.
 * 
 * @param {SelCrit} selCrit the selCrit defining what will be
 * retrieved.
 * @param {Log} supplementaryLog an optional logging probe to use 
 * in conjunction with the default functional logging probe (supporting
 * multiple log filter cross cuts).
 * 
 * @return {itemsPromise} a promise containing the list of retrieved items.
 */
export function retrieveItems(selCrit, supplementaryLog=null) {

  const log        = LogMix.cache(supplementaryLog, retrieveItemsLog);
  const itemType   = selCrit.itemType;
  const meta       = itemTypes.meta[itemType];
  const itemsLabel = meta.label.plural;
  const url        = `${getBaseUrl()}/api/${meta.apiNode}?${encodeJsonQueryStr('selCrit', selCrit, log)}`;

  log.debug(()=>`initiating ${itemsLabel} retrieval using selCrit: ${selCrit.name}`);

  return geekUFetch(url)
    .then( res => {
      const items = res.payload;
      log.debug(()=>`successful retrieval ... ${items.length} ${itemsLabel} returned`);
      return items;
    });
}
const retrieveItemsLog = new Log('api.items.retrieveItems');


/**
 * Retrieve the details of an item (ex: Course/Student), including
 * enrollment information.
 * 
 * NOTE: The data content of the returned item is fully populated with
 *       all data.
 * 
 * @param {string} itemType the itemType ('student'/'course').
 * @param {string} itemNum the item number to detail (studentNum/courseNum).
 * @param {Log} supplementaryLog an optional logging probe to use 
 * in conjunction with the default functional logging probe (supporting
 * multiple log filter cross cuts).
 * 
 * @return {itemPromise} a promise containing the detailed item.
 */
export function retrieveItemDetail(itemType, itemNum, supplementaryLog=null) {

  const log = LogMix.cache(supplementaryLog, retrieveItemDetailLog);

  log.debug(()=>`retrieving the full item detail of ${itemType} ${itemNum}`);

  return geekUFetch(`${getBaseUrl()}/api/${itemTypes.meta[itemType].apiNode}/${itemNum}`)
    .then( res => {
      // sync app with results
      const item = res.payload;
      log.debug(()=>`successful retrieval of detailed item: ${FMT(item)}`);
      return item;
    });
}
const retrieveItemDetailLog = new Log('api.items.retrieveItemDetail');
