'use strict';
/*
 * 通用的异步请求的action和reducer
 *
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducer = exports.generator = undefined;

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const commonRequestPrefix = 'COMMON_FETCH',
      commonReceivePrefix = 'COMMON_FETCH_SUCCESS';

function requestGenerator(id, name) {
  return function (json) {
    return {
      type: `${ commonRequestPrefix }_${ id.toUpperCase() }_${ name.toUpperCase() }`,
      json
    };
  };
}

function receiveGenerator(id, name, selector) {
  return function (json) {
    return {
      type: `${ commonReceivePrefix }_${ id.toUpperCase() }_${ name.toUpperCase() }`,
      name,
      selector,
      json
    };
  };
}

const generator = exports.generator = id => function (name, url) {
  let method = arguments.length <= 2 || arguments[2] === undefined ? 'GET' : arguments[2];
  let selector = arguments.length <= 3 || arguments[3] === undefined ? 'data' : arguments[3];

  return {
    request: function (data, type) {
      return (0, _fetch2.default)({
        method,
        url,
        data,
        requestAction: requestGenerator(id, name),
        receiveAction: receiveGenerator(id, name, selector)
      }, type);
    }
  };
};

const reducer = exports.reducer = id => function () {
  let defaultState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return function () {
    let state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    let action = arguments[1];
    const type = action.type;

    if (!type.startsWith) return state;

    if (type.startsWith(`${ commonRequestPrefix }_${ id.toUpperCase() }`)) {
      // request

      return Object.assign({}, state, {
        isFetching: true
      });
    } else if (type.startsWith(`${ commonReceivePrefix }_${ id.toUpperCase() }`)) {
      // receive
      return Object.assign({}, state, {
        isFetching: false,
        [action.name]: (0, _lodash.result)(action.json, action.selector, action.json)
      });
    }
    return state;
  };
};