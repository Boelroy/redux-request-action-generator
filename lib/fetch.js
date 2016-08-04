'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = commonFetch;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function commonFetch(options) {
  const requestAction = options.requestAction;
  const receiveAction = options.receiveAction;
  const errorAction = options.errorAction;
  var _options$method = options.method;
  const method = _options$method === undefined ? 'GET' : _options$method;
  var _options$type = options.type;
  const type = _options$type === undefined ? 'json' : _options$type;
  let url = options.url;
  let data = options.data;
  let header = {};
  console.log(data);
  // 处理参数
  switch (method) {
    case 'GET':
      url = url + (0, _utils.serilizeQuery)(data);
      break;
    case 'POST':
      data = new FormData(data);
      break;
  }
  console.log(data);
  return dispatch => {
    dispatch(requestAction());
    return (0, _isomorphicFetch2.default)(url, {
      method,
      body: data,
      credentials: 'same-origin'
    }).then(response => {
      if (response.state >= 400) {
        // Error Handle
        throw new Error('Bad response frin server');
      }
      return response[type]();
    }).then(json => {
      json = type === 'json' ? json : JSON.parse(json);
      return dispatch(receiveAction(json));
    }, error => dispatch(errorAction(error)));
  };
}