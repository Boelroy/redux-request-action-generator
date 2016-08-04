'use strict';

import fetch from 'isomorphic-fetch';
import { serilizeQuery } from './utils';

export default function commonFetch(options) {
  const { requestAction, receiveAction, errorAction, method='GET', type='json' } = options;
  let { url, data } = options,
    headers = {};


  console.log(url, method);
  // 处理参数
  switch(method) {
    case 'GET':
      url = url + serilizeQuery(data);
      break;
    case 'POST':
      data = serilizeQuery(data).slice(1);
      headers = {
        'Content-Type':'application/x-www-form-urlencoded'
      };
      break;
  }

  return dispatch => {
    dispatch(requestAction());
    return fetch(url, {
      method,
      body: data,
      credentials: 'same-origin',
      headers: headers
    })
    .then(response => {
      if ( response.state >= 400) {
        // Error Handle
        throw new Error('Bad response frin server');
      }
      return response[type]();
    })
    .then(json => {
      json = type === 'json' ? json : JSON.parse(json);
      return dispatch(receiveAction(json));
    }, error=> {
      console.log(error);
      return dispatch(errorAction(error));
    });
  };
}
