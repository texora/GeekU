'use strict';

// TODO: baseUrl.js module IS A QUICK-AND-DIRTY HACK TO GET UNIT TESTS WORKING ... need to figure out how we want to configure our api

let _baseUrl = '';

export function setBaseUrl(baseUrl) {
  _baseUrl = baseUrl;
}

export function getBaseUrl() {
  return _baseUrl;
}
