(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;

	var _connect = __webpack_require__(1);

	var _connect2 = _interopRequireDefault(_connect);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _connect2.default;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _utils = __webpack_require__(2);

	var subscription = null;
	var listeners = [];

	var createListener = function createListener(context, store, mapState) {
	  var initOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	  var prevState = void 0,
	      tmp = void 0;
	  var listener = function listener(state) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    var nextState = mapState.apply(undefined, [state, initOptions].concat(args));
	    if (!prevState || !(0, _utils.deepEqual)(nextState, prevState)) {
	      tmp = (0, _utils.clone)(nextState);
	      context.onStateChange.call(context, nextState, (0, _utils.clone)(prevState) || {});
	      prevState = tmp;
	    }
	  };

	  listener(store.getState()); // to sync init state
	  listener.isActive = true;
	  return listener;
	};

	var defaultMergeConfig = function defaultMergeConfig(config, overrides) {
	  return _extends({}, config, overrides);
	};

	var setupSubscription = function setupSubscription(store) {
	  if ((0, _utils.isFn)(subscription)) {
	    return subscription;
	  }
	  var callback = function callback() {
	    listeners.filter(function (fn) {
	      return fn.isActive;
	    }).forEach(function (fn) {
	      return fn(store.getState());
	    });
	  };
	  return subscription = store.subscribe(callback);
	};

	var injectChangeListenerStatus = function injectChangeListenerStatus(store, handler, listener, isActive) {
	  return function () {
	    if (listener) {
	      var prev = listener.isActive;
	      listener.isActive = isActive;
	      if (!prev && isActive) {
	        listener.apply(undefined, [store.getState()].concat(Array.prototype.slice.call(arguments)));
	      }
	    }
	    return (0, _utils.callInContext)(handler, this, arguments);
	  };
	};

	var injectOnStateChange = function injectOnStateChange(handler) {
	  return function () {
	    return (0, _utils.callInContext)(handler, this, arguments);
	  };
	};

	var connect = function connect(store, mapState, mapDispatch) {
	  var resolveMapDispatch = function resolveMapDispatch() {
	    return (0, _utils.isFn)(mapDispatch) ? mapDispatch(store.dispatch) : {};
	  };

	  return function (injectLifeCycle, config) {
	    var mergedConfig = defaultMergeConfig(config, resolveMapDispatch());
	    if (!(0, _utils.isFn)(mapState)) {
	      return mergedConfig;
	    }

	    setupSubscription(store);
	    return _extends({}, mergedConfig, injectLifeCycle(mergedConfig, mapState));
	  };
	};

	var connectApp = function connectApp(store, mapState, mapDispatch) {
	  var factory = connect(store, mapState, mapDispatch);

	  var injectAppLifeCycle = function injectAppLifeCycle(config) {
	    var _onLaunch = config.onLaunch,
	        onShow = config.onShow,
	        onHide = config.onHide,
	        onStateChange = config.onStateChange;


	    return {
	      onLaunch: function onLaunch(options) {
	        var listener = createListener(this, store, mapState, options);
	        listener.index = listeners.push(listener) - 1;

	        this.onShow = injectChangeListenerStatus(store, onShow, listener, true);
	        this.onHide = injectChangeListenerStatus(store, onHide, listener, false);
	        return (0, _utils.callInContext)(_onLaunch, this, arguments);
	      },
	      onShow: (0, _utils.isFn)(onShow) ? onShow : _utils.noop,
	      onHide: (0, _utils.isFn)(onHide) ? onHide : _utils.noop,
	      onStateChange: injectOnStateChange(onStateChange)
	    };
	  };

	  return function (config) {
	    return factory(injectAppLifeCycle, config);
	  };
	};

	var connectPage = function connectPage(store, mapState, mapDispatch) {
	  var factory = connect(store, mapState, mapDispatch);

	  var injectPageLifeCycle = function injectPageLifeCycle(config) {
	    var _onLoad = config.onLoad,
	        onUnload = config.onUnload,
	        onShow = config.onShow,
	        onHide = config.onHide,
	        onStateChange = config.onStateChange;


	    return {
	      onLoad: function onLoad(options) {
	        var listener = createListener(this, store, mapState, options);
	        listener.index = listeners.push(listener) - 1;

	        this.onUnload = function () {
	          listeners.splice(listener.index, 1);
	          return (0, _utils.callInContext)(onUnload, this, arguments);
	        };

	        this.onShow = injectChangeListenerStatus(store, onShow, listener, true);
	        this.onHide = injectChangeListenerStatus(store, onHide, listener, false);
	        return (0, _utils.callInContext)(_onLoad, this, arguments);
	      },

	      onUnload: (0, _utils.isFn)(onUnload) ? onUnload : _utils.noop,
	      onShow: (0, _utils.isFn)(onShow) ? onShow : _utils.noop,
	      onHide: (0, _utils.isFn)(onHide) ? onHide : _utils.noop,
	      onStateChange: injectOnStateChange(onStateChange)
	    };
	  };

	  return function (config) {
	    return factory(injectPageLifeCycle, config);
	  };
	};

	exports.default = {
	  App: connectApp,
	  Page: connectPage
	};
	module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var proto = Object.prototype;
	var hasOwnProp = proto.hasOwnProperty;

	var noop = function noop() {};

	var isFn = function isFn(fn) {
	  return 'function' === typeof fn;
	};

	var typeOf = function typeOf(v) {
	  var t = proto.toString.call(v); // [object XXX]
	  return t.substr(8, t.length - 9);
	};

	var deepEqual = function deepEqual(a, b) {
	  if (a === b) {
	    return true;
	  }

	  if (a && b && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object') {
	    var arrA = typeOf(a) === 'Array',
	        arrB = typeOf(b) === 'Array';
	    if (arrA !== arrB) {
	      return false;
	    }

	    var i = void 0;
	    if (arrA && arrB) {
	      if (a.length !== b.length) {
	        return false;
	      }

	      i = a.length;
	      while (i--) {
	        if (!deepEqual(a[i], b[i])) {
	          return false;
	        }
	      }
	      return true;
	    }

	    var dateA = a instanceof Date,
	        dateB = b instanceof Date;
	    if (dateA !== dateB) {
	      return false;
	    }

	    if (dateA && dateB) {
	      return a.getTime() === b.getTime();
	    }

	    var regexpA = a instanceof RegExp,
	        regexpB = b instanceof RegExp;
	    if (regexpA !== regexpB) {
	      return false;
	    }
	    if (regexpA && regexpB) {
	      return a.toString() === b.toString();
	    }

	    var keys = Object.keys(a);
	    i = keys.length;
	    if (i !== Object.keys(b).length) {
	      return false;
	    }

	    // check own props
	    while (i--) {
	      if (!hasOwnProp.call(b, keys[i])) {
	        return false;
	      }
	    }

	    i = keys.length;
	    while (i--) {
	      if (!deepEqual(a[keys[i]], b[keys[i]])) {
	        return false;
	      }
	    }

	    return true;
	  }

	  return a !== a && b !== b;
	};

	// Clone JSON serializable object recursive
	// Because a store state should/must be JSON serializable
	var clonable = function clonable(target) {
	  switch (typeOf(target)) {
	    case 'Object':
	    case 'Array':
	    case 'Date':
	      return true;
	    default:
	      return false;
	  }
	};

	var clone = function clone(target) {
	  if (Object(target) !== target) {
	    //primitives
	    return target;
	  }

	  if (!clonable(target)) {
	    return;
	  }

	  if (target instanceof Array) {
	    var newArr = [];
	    for (var i = 0, len = target.length; i < len; i++) {
	      newArr[i] = clone(target[i]);
	    }
	    return newArr;
	  }

	  if (target instanceof Date) {
	    return new Date(target.getTime());
	  }

	  var result = {};
	  for (var k in target) {
	    result[k] = clone(target[k]);
	  }
	  return result;
	};

	var callInContext = function callInContext(fn, context) {
	  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  if (!isFn(fn)) return;
	  if (Object.prototype.toString.call(args[0]) === '[object Arguments]') {
	    return fn.call.apply(fn, [context].concat(_toConsumableArray([].slice.call(args[0]))));
	  }
	  return fn.call.apply(fn, [context].concat(args));
	};

	exports.isFn = isFn;
	exports.noop = noop;
	exports.deepEqual = deepEqual;
	exports.clone = clone;
	exports.callInContext = callInContext;

/***/ })
/******/ ])
});
;