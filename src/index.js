/*
 * 通用的异步请求的action和reducer
 *
 */

import fetch from './fetch';
import { result, isFunction } from 'lodash';

const commonRequestPrefix = 'COMMON_FETCH';
const commonReceiveMorePrefix = 'COMMON_FETCH_SUCCESS_MORE';
const commonReceivePrefix = 'COMMON_FETCH_SUCCESS';

function requestGenerator(id, name) {
  return (json) => ({
    type: `${commonRequestPrefix}_${id.toUpperCase()}_${name.toUpperCase()}`,
    json,
  });
}

function receiveMoreGenerator(id, name, selector, listSelector) {
  return (json) => ({
    type: `${commonReceiveMorePrefix}_${id.toUpperCase()}_${name.toUpperCase()}`,
    listSelector,
    selector,
    json,
    name,
  });
}

function receiveGenerator(id, name, selector) {
  return (json) => ({
    type: `${commonReceivePrefix}_${id.toUpperCase()}_${name.toUpperCase()}`,
    name,
    selector,
    json,
  });
}

export const generator = (id) => (name, url, method = 'GET', selector = 'data') => ({
  request: (data, type) => fetch({
    method,
    url,
    data,
    requestAction: requestGenerator(id, name),
    receiveAction: receiveGenerator(id, name, selector),
    type,
  }),
  requestMore: (data, listSelector) => fetch({
    method,
    url,
    data,
    requestAction: requestGenerator(id, name),
    receiveAction: receiveMoreGenerator(id, name, selector, listSelector),
  }),
});


export const reducer = (id) => (defaultState = {}, custormReducer) =>
  (state = defaultState, action) => {
    const { type } = action;
    if (!type.startsWith) return state;

    if (type.startsWith(`${commonRequestPrefix}_${id.toUpperCase()}`)) { // request
      return {
        ...state,
        isFetching: true,
      };
    } else if (type.startsWith(`${commonReceivePrefix}_${id.toUpperCase()}`)) { // receive
      return {
        ...state,
        isFetching: false,
        [action.name]: result(action.json, action.selector, action.json),
      };
    } else if (type.startsWith(`${commonReceiveMorePrefix}_${id.toUpperCase()}`)) {
      const newJson = result(action.json, action.selector, action.json);
      return {
        ...state,
        isFetching: false,
        [action.name]: {
          ...state[action.name],
          [action.listSelector]: [
            ...state[action.name][action.listSelector],
            ...newJson[action.listSelector],
          ],
        },
      };
    }
    if (isFunction(custormReducer)) {
      return custormReducer(state, action);
    }
    return state;
  };
