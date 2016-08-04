'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serilizeQuery = serilizeQuery;

var _lodash = require('lodash');

// 目前不支持多参数
function serilizeQuery(query) {
  return (0, _lodash.toPairs)(query).reduce(function (iter, item) {

    let query;

    if ((0, _lodash.isArray)(item[1])) {
      query = item[1].reduce((iter, param) => `${ iter + item[0] }[]=${ param }&`, '');
    } else {
      query = item[0] + '=' + item[1] + '&';
    }

    return iter + query;
  }, '?').slice(0, -1);
}