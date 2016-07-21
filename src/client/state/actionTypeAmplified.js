import {BATCH} from 'redux-batched-actions';

/**
 * Return a human readable action type that drills into various
 * details as needed.
 * @param action {Redux-Action} the action to detail the type for.
 * @return the amplified action type (for human consumption)
 * @public
 */
export default function actionTypeAmplified(action) {

  let msg = 'Type';

  // handle arrays - GeekU supports action batching
  if (Array.isArray(action)) {
    msg += '(array): [';
    for (const subAction of action) {
      msg += actionTypeAmplified(subAction); // ... recurse
    }
    msg += ']';
  }

  // handle thunks (functions) - GeekU maintains types even on functions
  else if (typeof action === 'function') {
    msg += `(thunk): '${action.type}' `;
  }

  // handle redux-batched-actions
  else if (action.type == BATCH) { // ... use == because our types are String objects ... NOT string built-ins (supporting federated namespaces [with dots (.)])
    msg += `(${BATCH}): [`;
    for (const subAction of action.payload) {
      msg += actionTypeAmplified(subAction); // ... recurse
    }
    msg += ']';
  }

  // handle plain-jane actions
  else {
    msg += `(object): '${action.type}' `;
  }

  // that's all folks :-)
  return msg;
}

