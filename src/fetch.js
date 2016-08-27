import fetch from 'isomorphic-fetch';
import { serializeQuery } from './utils';

export default function commonFetch(options) {
  const { requestAction, receiveAction, errorAction, method = 'GET', type = 'json' } = options;
  let { url, data } = options;
  let headers = {};
  // 处理参数
  switch (method) {
    case 'GET':
      url = url + serializeQuery(data);
      break;
    case 'POST':
      data = serializeQuery(data).slice(1);
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      break;
    default:

  }
  const ops = {
    method,
    credentials: 'same-origin',
    headers,
  };
  if (method !== 'GET') {
    ops.body = data;
  }
  return dispatch => {
    dispatch(requestAction());
    return fetch(url, ops)
    .then(response => {
      if (response.status >= 400) {
        // Error Handle
        throw new Error('网络问题');
      }
      return response[type]();
    })
    .then(
      json => {
        const result = type === 'json' ? json : JSON.parse(json);
        if (result.errno !== undefined && result.errno) {
          dispatch(errorAction(result.errmsg, result.errno));
          return Promise.reject(result);
        }
        return dispatch(receiveAction(result));
      },

      error => {
        dispatch(errorAction(error.toString(), -1));
        throw error;
      }
    );
  };
}
