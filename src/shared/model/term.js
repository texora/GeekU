'use strict';

import Log from '../util/Log';

const log = new Log('term');

/**
 * Promotes valid GeekU Terms: the enrollment time period (i.e. term) 
 * during which instruction is given at GeekU.
 *
 * The following format is used:
 * 
 *    YYYY-Spring/Summer/Fall
 * 
 * Example:
 * 
 *    2015-Spring
 *    2015-Summer
 *    2015-Fall
 *    ...
 *    1966-Spring
 *    1966-Summer
 *    1966-Fall
 * 
 * This utility is used for validation (client/server), and client-side
 * GUI list drivers, etc.
 * 
 * Due to the static nature of these elements, a programmatic
 * maintenance is utilized, rather than one modeled in our DB (refer
 * to the "Internals" section below).
 */


//***
//*** Public API
//***

const term = {

  // promote all terms <string[]>, or ones that contain the optional filter string
  terms(filter) {
    if (filter) {
      return _allTerms.filter(elm => {
        return elm.includes(filter);
      });
    }
    return _allTerms;
  },

  // is supplied term valid? <boolean>
  isValid(term) {
    return this.validate(term) ? false : true;
  },


  // validate supplied term <string> msg highlighting problem, null for valid
  validate(term) {
    const expectingPhrase = 'expecting: "YYYY-Spring/Summer/Fall"'
    const [year, session, unknown] = term.split('-');
    const iYear = parseInt(year);

    let msg = null; // valid

    // validate year
    if (!year)
      msg = `Year NOT supplied in "${term}", ${expectingPhrase}`;
    else if (!iYear)
      msg = `Invalid Year: ${year} in "${term}", ${expectingPhrase}`;
    else if (iYear<_GeekUFoundingYear || iYear>_GeekUCurrentYear)
      msg = `Invalid Year: ${year}, out of range (${_GeekUFoundingYear}-${_GeekUCurrentYear}) in "${term}", ${expectingPhrase}`;

    // validate session
    else if (!session)
      msg = `Session NOT supplied in "${term}", ${expectingPhrase}`;

    else if (!_validTerms[session])
      msg = `Invalid session: ${session} in "${term}" ... ${expectingPhrase}`;

    else if (unknown || unknown === '')
      msg = `Too many elements supplied in "${term}", ${expectingPhrase}`;

    // that's all folks
    log.debug(()=>`term.validate('${term}'): year: '${year}', session: '${session}', unknown: '${unknown}' ... ${msg ? 'INVALID: ' + msg : 'VALID'}`);
    return msg;
  },


  // compare two terms for logical order <int> ... 0: A=B, -1: A<B, +1: A>B
  compare(termA, termB) {
    let [yearA, sessionA] = termA.split('-');
    let [yearB, sessionB] = termB.split('-');
    
    if (yearA !== yearB)
      return yearA.localeCompare(yearB);

    return _validTerms[sessionA] - _validTerms[sessionB]
  },


};
export default term;



//***
//*** Internals
//***

const _GeekUFoundingYear = 1966;
const _GeekUCurrentYear  = new Date().getFullYear() + 1; // can work one year in advance


// valid terms, with their cooresponding sort order
const _validTerms = {
  Spring: 1,
  Summer: 2,
  Fall:   3,
};


// ALL terms <string[]> ... ex: ['1979-Spring', ...]
const _allTerms = []; // ... machine genereated (below)
for (let year=_GeekUCurrentYear; year>=_GeekUFoundingYear; year--) { // ... newest term first
  _allTerms.push(`${year}-Fall`);
  _allTerms.push(`${year}-Summer`);
  _allTerms.push(`${year}-Spring`);
}


