'use strict';
/*
 * 通用的异步请求的action和reducer
 *
 */

import fetch from './fetch';
import {result} from 'lodash';

const commonRequestPrefix = 'COMMON_FETCH',
  commonReceivePrefix = 'COMMON_FETCH_SUCCESS';

function requestGenerator(id,name) {
  return function(json){
    return {
      type: `${commonRequestPrefix}_${id.toUpperCase()}_${name.toUpperCase()}`,
      json
    };
  };
}

function receiveGenerator(id, name, selector) {
  return function(json){
    return {
      type: `${commonReceivePrefix}_${id.toUpperCase()}_${name.toUpperCase()}`,
      name,
      selector,
      json
    };
  };
}

export const generator = (id) => (name, url, method='GET', selector='data') => {
  return {
    request: function(data,type) {
      return fetch({
        method,
        url,
        data,
        requestAction: requestGenerator(id, name),
        receiveAction: receiveGenerator(id, name, selector)
      }, type);
    }
  };
};


export const reducer = (id) => (defaultState={}) => (state=defaultState, action) => {

  const { type }  = action;
  if (!type.startsWith) return state;

  if (type.startsWith(`${commonRequestPrefix}_${id.toUpperCase()}`)) { // request

    return Object.assign({},  state, {
      isFetching: true
    });

  } else if(type.startsWith(`${commonReceivePrefix}_${id.toUpperCase()}`)) { // receive
    return Object.assign({},  state, {
      isFetching: false,
      [action.name]: result(action.json, action.selector, action.json)
    });

  }
  return state;
};
