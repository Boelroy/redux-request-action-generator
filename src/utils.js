'use strict';

import { toPairs } from 'lodash';

// 目前不支持多参数
export function serilizeQuery(query) {
  return toPairs(query).reduce(function(iter, item) {
    return iter+ item[0] + '='+ item[1]+'&';
  }, '?').slice(0, -1);
}
