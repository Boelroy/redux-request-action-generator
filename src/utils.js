'use strict';

import { toPairs, isArray } from 'lodash';

// 目前不支持多参数
export function serializeQuery(query) {
  return toPairs(query).reduce((iter, item) => {
    let result;
    if (!item[1]) {
      return iter;
    }
    if (isArray(item[1])) {
      result = item[1].reduce((iter1, param) => `${iter1 + item[0]}[]=${param}&`, '');
    } else if (typeof item[1] === 'undefined') {
      result = `${encodeURIComponent(item[0])}=&`;
    } else if (typeof item[1] === 'object') {
      result = `${encodeURIComponent(item[0])}=${encodeURIComponent(JSON.stringify(item[1]))}&`;
    } else {
      result = `${encodeURIComponent(item[0])}=${encodeURIComponent(item[1])}&`;
    }

    return iter + result;
  }, '?').slice(0, -1);
}
