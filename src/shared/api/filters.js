'use strict';

import geekUFetch   from './geekUFetch';
import {getBaseUrl} from './baseUrl';
import Log          from '../util/Log';
import LogMix       from '../util/LogMix';


/**
 * Retrieve a set of filters (selCrit objects).
 *
 * @param {string} userId the user owning the selCrit objects to
 * retrieve (defaults to 'common').
 * @param {Log} supplementaryLog an optional logging probe to use 
 * in conjunction with the default functional logging probe (supporting
 * multiple log filter cross cuts).
 * 
 * @return {selCritListPromise} a promise containing the list of
 * retrieved selCrit objects.
 */
export function retrieveFilters(userId='common', supplementaryLog=null) {

  const log = LogMix.cache(supplementaryLog, retrieveFiltersLog);

  log.debug(()=>'retrieving filters (a list of selCrit objects)');

  const url = `${getBaseUrl()}/api/selCrit?userId=${userId}`;
  return geekUFetch(url)
    .then( res => {
      const filters = res.payload;
      log.debug(()=>`successful retrieval ... ${filters.length} filters returned`);
      return filters;
    });
}
const retrieveFiltersLog = new Log('api.filters.retrieveFilters');


/**
 * Save the supplied filter (selCrit object), either for the first
 * time (i.e. new) or an update.
 *
 * @param {SelCrit} selCrit the selCrit to save.
 * @param {Log} supplementaryLog an optional logging probe to use 
 * in conjunction with the default functional logging probe (supporting
 * multiple log filter cross cuts).
 * 
 * @return {savedSelCritPromise} a promise containing the newly saved
 * selCrit object (with updated dbHash).
 */
export function saveFilter(selCrit, supplementaryLog=null) {

  const log = LogMix.cache(supplementaryLog, saveFilterLog);

  // perform async save of selCrit
  log.debug(()=>`initiating async save of selCrit key: ${selCrit.key}`);

  return geekUFetch(`${getBaseUrl()}/api/selCrit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selCrit)
  })
  .then( res => {
    const savedSelCrit = res.payload;
    log.debug(()=>`successful save of selCrit key: ${savedSelCrit.key}`);
    return savedSelCrit;
  });
}
const saveFilterLog = new Log('api.filters.saveFilter');


/**
 * Delete the supplied filter (selCrit object).
 *
 * @param {SelCrit} selCrit the selCrit to delete.
 * @param {Log} supplementaryLog an optional logging probe to use 
 * in conjunction with the default functional logging probe (supporting
 * multiple log filter cross cuts).
 * 
 * @return {emptyPromise} a promise containing no payload indicating
 * the delete was successful.
 */
export function deleteFilter(selCrit, supplementaryLog=null) {

  const log = LogMix.cache(supplementaryLog, deleteFilterLog);

  // perform async delete of selCrit
  log.debug(()=>`initiating async delete of selCrit: ${selCrit.name}`);

  const url = `${getBaseUrl()}/api/selCrit/${selCrit.key}`;
  return geekUFetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selCrit)
  })
  .then( res => {
    log.debug(()=>`successful delete of selCrit: ${selCrit.name}`);
    return;
  });

}
const deleteFilterLog = new Log('api.filters.deleteFilter');
