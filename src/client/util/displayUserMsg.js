'use strict'

import appStore  from '../appStore';
import {AC}      from '../state/actions';

/**
 * Display a message to the user.
 */
export default function displayUserMsg(msg) {
  appStore.dispatch( AC.displayUserMsg(msg) );
}
