'use strict';

import Log        from '../../shared/util/Log';
import {AC}       from '../actions';
import HTTPStatus from 'http-status';

const log = new Log('unexpectedError');

/**
 * The handleUnexpectedError() function provides a common utility to
 * consistently report/log client-side errors in a standard way.
 * 
 *  - The supplied err is appropriately logged.
 *
 *  - A redux action is created/returned that will provide appropriate
 *    communication to the user in a standardized way (with an
 *    optional details link to glean additional 'technical'
 *    information).
 *
 * NOTE: The returned action MUST BE dispatched (through the redux store)
 *       in order for the user to visualize the error condition.
 *
 * @param {Error} err the error that is to be reported/logged.
 * @param {string} qualMsg an optional qualifying message that
 * provides additional context to the supplied err.  This message
 * should be worded in such a way that makes sense when appended to:
 * 'An unexpected error occurred' ... for example consider: 'when
 * retrieving students'.
 *
 * @return {Action} a redux action object that MUST BE dispatched to
 * report the error to the user.
 */
export default function handleUnexpectedError(err, qualMsg='') {

  // log the details of the error (with traceback) for tech review
  const userMsg = `An unexpected error occurred ${qualMsg}.`;
  log.error(()=> userMsg, err);

  // setup the DETAIL callback for our userMsg userAction
  const detailAction = (event) => {

    // format the detailed message to display in our detailAction
    // ... NOTE: err.message will contain any applicable server logId (to report to tech support)
    let detailedMsg =  `${userMsg}
  
    ${err.clientMsg}
    ${err.message}

If this problem persists, please contact your tech support.`;

    // show user the details
    alert(`${detailedMsg}`);
  };

  // create/return the redux action to provide user communication
  return AC.userMsg.display(userMsg, 
                            {
                              txt:      'details',
                              callback: detailAction,
                            });
}
