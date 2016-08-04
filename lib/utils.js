'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serilizeQuery = serilizeQuery;

var _lodash = require('lodash');

// 目前不支持多参数
function serilizeQuery(query) {
  return (0, _lodash.toPairs)(query).reduce(function (iter, item) {
    return iter + item[0] + '=' + item[1] + '&';
  }, '?').slice(0, -1);
}