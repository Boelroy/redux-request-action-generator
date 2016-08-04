'use strict';

import { toPairs, isArray } from 'lodash';

// 目前不支持多参数
export function serilizeQuery(query) {
  return toPairs(query).reduce(function(iter, item) {

    let query;

    if (isArray(item[1])) {
      query = item[1].reduce((iter, param) => `${iter+item[0]}[]=${param}&`, '');
    } else {
      query = item[0] + '='+ item[1]+'&';
    }

    return iter+ query;
  }, '?').slice(0, -1);
}
