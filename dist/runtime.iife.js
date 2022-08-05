/*! 
// ==UserScript==
// @name         spider-runtime
// @namespace    http://tampermonkey.net/
// @version      0.2.9
// @description  help control browser
// @author       zxxzzzzz
// @include      *
// @icon         https://cdn.onlinewebfonts.com/svg/img_562349.png
// @grant        none
// ==/UserScript==
 */
const spider_monkey_runtime = function() {
  "use strict";
  const FUNC_PREFIX = "__func__";
  var MESSAGE_TYPE = /* @__PURE__ */ ((MESSAGE_TYPE2) => {
    MESSAGE_TYPE2["init"] = "init";
    MESSAGE_TYPE2["data"] = "data";
    MESSAGE_TYPE2["payload"] = "payload";
    MESSAGE_TYPE2["store"] = "store";
    return MESSAGE_TYPE2;
  })(MESSAGE_TYPE || {});
  function delay(n = 6 * 1e3) {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, n);
    });
  }
  var F = function() {
    return false;
  };
  const F$1 = F;
  var T = function() {
    return true;
  };
  const T$1 = T;
  const __ = {
    "@@functional/placeholder": true
  };
  function _isPlaceholder(a) {
    return a != null && typeof a === "object" && a["@@functional/placeholder"] === true;
  }
  function _curry1(fn) {
    return function f1(a) {
      if (arguments.length === 0 || _isPlaceholder(a)) {
        return f1;
      } else {
        return fn.apply(this, arguments);
      }
    };
  }
  function _curry2(fn) {
    return function f2(a, b) {
      switch (arguments.length) {
        case 0:
          return f2;
        case 1:
          return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
            return fn(a, _b);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a) {
            return fn(_a, b);
          }) : _isPlaceholder(b) ? _curry1(function(_b) {
            return fn(a, _b);
          }) : fn(a, b);
      }
    };
  }
  var add = /* @__PURE__ */ _curry2(function add2(a, b) {
    return Number(a) + Number(b);
  });
  const add$1 = add;
  function _concat(set1, set2) {
    set1 = set1 || [];
    set2 = set2 || [];
    var idx;
    var len1 = set1.length;
    var len2 = set2.length;
    var result = [];
    idx = 0;
    while (idx < len1) {
      result[result.length] = set1[idx];
      idx += 1;
    }
    idx = 0;
    while (idx < len2) {
      result[result.length] = set2[idx];
      idx += 1;
    }
    return result;
  }
  function _arity(n, fn) {
    switch (n) {
      case 0:
        return function() {
          return fn.apply(this, arguments);
        };
      case 1:
        return function(a0) {
          return fn.apply(this, arguments);
        };
      case 2:
        return function(a0, a1) {
          return fn.apply(this, arguments);
        };
      case 3:
        return function(a0, a1, a2) {
          return fn.apply(this, arguments);
        };
      case 4:
        return function(a0, a1, a2, a3) {
          return fn.apply(this, arguments);
        };
      case 5:
        return function(a0, a1, a2, a3, a4) {
          return fn.apply(this, arguments);
        };
      case 6:
        return function(a0, a1, a2, a3, a4, a5) {
          return fn.apply(this, arguments);
        };
      case 7:
        return function(a0, a1, a2, a3, a4, a5, a6) {
          return fn.apply(this, arguments);
        };
      case 8:
        return function(a0, a1, a2, a3, a4, a5, a6, a7) {
          return fn.apply(this, arguments);
        };
      case 9:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          return fn.apply(this, arguments);
        };
      case 10:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return fn.apply(this, arguments);
        };
      default:
        throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
    }
  }
  function _curryN(length2, received, fn) {
    return function() {
      var combined = [];
      var argsIdx = 0;
      var left = length2;
      var combinedIdx = 0;
      while (combinedIdx < received.length || argsIdx < arguments.length) {
        var result;
        if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
          result = received[combinedIdx];
        } else {
          result = arguments[argsIdx];
          argsIdx += 1;
        }
        combined[combinedIdx] = result;
        if (!_isPlaceholder(result)) {
          left -= 1;
        }
        combinedIdx += 1;
      }
      return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length2, combined, fn));
    };
  }
  var curryN = /* @__PURE__ */ _curry2(function curryN2(length2, fn) {
    if (length2 === 1) {
      return _curry1(fn);
    }
    return _arity(length2, _curryN(length2, [], fn));
  });
  const curryN$1 = curryN;
  var addIndex = /* @__PURE__ */ _curry1(function addIndex2(fn) {
    return curryN$1(fn.length, function() {
      var idx = 0;
      var origFn = arguments[0];
      var list = arguments[arguments.length - 1];
      var args = Array.prototype.slice.call(arguments, 0);
      args[0] = function() {
        var result = origFn.apply(this, _concat(arguments, [idx, list]));
        idx += 1;
        return result;
      };
      return fn.apply(this, args);
    });
  });
  const addIndex$1 = addIndex;
  function _curry3(fn) {
    return function f3(a, b, c) {
      switch (arguments.length) {
        case 0:
          return f3;
        case 1:
          return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
            return fn(a, _b, _c);
          });
        case 2:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
            return fn(a, _b, _c);
          }) : _curry1(function(_c) {
            return fn(a, b, _c);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) {
            return fn(_a, _b, c);
          }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
            return fn(a, _b, _c);
          }) : _isPlaceholder(a) ? _curry1(function(_a) {
            return fn(_a, b, c);
          }) : _isPlaceholder(b) ? _curry1(function(_b) {
            return fn(a, _b, c);
          }) : _isPlaceholder(c) ? _curry1(function(_c) {
            return fn(a, b, _c);
          }) : fn(a, b, c);
      }
    };
  }
  var adjust = /* @__PURE__ */ _curry3(function adjust2(idx, fn, list) {
    var len = list.length;
    if (idx >= len || idx < -len) {
      return list;
    }
    var _idx = (len + idx) % len;
    var _list = _concat(list);
    _list[_idx] = fn(list[_idx]);
    return _list;
  });
  const adjust$1 = adjust;
  const _isArray = Array.isArray || function _isArray2(val) {
    return val != null && val.length >= 0 && Object.prototype.toString.call(val) === "[object Array]";
  };
  function _isTransformer(obj) {
    return obj != null && typeof obj["@@transducer/step"] === "function";
  }
  function _dispatchable(methodNames, transducerCreator, fn) {
    return function() {
      if (arguments.length === 0) {
        return fn();
      }
      var obj = arguments[arguments.length - 1];
      if (!_isArray(obj)) {
        var idx = 0;
        while (idx < methodNames.length) {
          if (typeof obj[methodNames[idx]] === "function") {
            return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
          }
          idx += 1;
        }
        if (_isTransformer(obj)) {
          var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
          return transducer(obj);
        }
      }
      return fn.apply(this, arguments);
    };
  }
  function _reduced(x) {
    return x && x["@@transducer/reduced"] ? x : {
      "@@transducer/value": x,
      "@@transducer/reduced": true
    };
  }
  const _xfBase = {
    init: function() {
      return this.xf["@@transducer/init"]();
    },
    result: function(result) {
      return this.xf["@@transducer/result"](result);
    }
  };
  var XAll = /* @__PURE__ */ function() {
    function XAll2(f, xf) {
      this.xf = xf;
      this.f = f;
      this.all = true;
    }
    XAll2.prototype["@@transducer/init"] = _xfBase.init;
    XAll2.prototype["@@transducer/result"] = function(result) {
      if (this.all) {
        result = this.xf["@@transducer/step"](result, true);
      }
      return this.xf["@@transducer/result"](result);
    };
    XAll2.prototype["@@transducer/step"] = function(result, input2) {
      if (!this.f(input2)) {
        this.all = false;
        result = _reduced(this.xf["@@transducer/step"](result, false));
      }
      return result;
    };
    return XAll2;
  }();
  var _xall = /* @__PURE__ */ _curry2(function _xall2(f, xf) {
    return new XAll(f, xf);
  });
  const _xall$1 = _xall;
  var all = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable(["all"], _xall$1, function all2(fn, list) {
    var idx = 0;
    while (idx < list.length) {
      if (!fn(list[idx])) {
        return false;
      }
      idx += 1;
    }
    return true;
  }));
  const all$1 = all;
  var max = /* @__PURE__ */ _curry2(function max2(a, b) {
    return b > a ? b : a;
  });
  const max$1 = max;
  function _map(fn, functor) {
    var idx = 0;
    var len = functor.length;
    var result = Array(len);
    while (idx < len) {
      result[idx] = fn(functor[idx]);
      idx += 1;
    }
    return result;
  }
  function _isString(x) {
    return Object.prototype.toString.call(x) === "[object String]";
  }
  var _isArrayLike = /* @__PURE__ */ _curry1(function isArrayLike(x) {
    if (_isArray(x)) {
      return true;
    }
    if (!x) {
      return false;
    }
    if (typeof x !== "object") {
      return false;
    }
    if (_isString(x)) {
      return false;
    }
    if (x.length === 0) {
      return true;
    }
    if (x.length > 0) {
      return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
    }
    return false;
  });
  const _isArrayLike$1 = _isArrayLike;
  var XWrap = /* @__PURE__ */ function() {
    function XWrap2(fn) {
      this.f = fn;
    }
    XWrap2.prototype["@@transducer/init"] = function() {
      throw new Error("init not implemented on XWrap");
    };
    XWrap2.prototype["@@transducer/result"] = function(acc) {
      return acc;
    };
    XWrap2.prototype["@@transducer/step"] = function(acc, x) {
      return this.f(acc, x);
    };
    return XWrap2;
  }();
  function _xwrap(fn) {
    return new XWrap(fn);
  }
  var bind = /* @__PURE__ */ _curry2(function bind2(fn, thisObj) {
    return _arity(fn.length, function() {
      return fn.apply(thisObj, arguments);
    });
  });
  const bind$1 = bind;
  function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      acc = xf["@@transducer/step"](acc, list[idx]);
      if (acc && acc["@@transducer/reduced"]) {
        acc = acc["@@transducer/value"];
        break;
      }
      idx += 1;
    }
    return xf["@@transducer/result"](acc);
  }
  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf["@@transducer/step"](acc, step.value);
      if (acc && acc["@@transducer/reduced"]) {
        acc = acc["@@transducer/value"];
        break;
      }
      step = iter.next();
    }
    return xf["@@transducer/result"](acc);
  }
  function _methodReduce(xf, acc, obj, methodName) {
    return xf["@@transducer/result"](obj[methodName](bind$1(xf["@@transducer/step"], xf), acc));
  }
  var symIterator = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
  function _reduce(fn, acc, list) {
    if (typeof fn === "function") {
      fn = _xwrap(fn);
    }
    if (_isArrayLike$1(list)) {
      return _arrayReduce(fn, acc, list);
    }
    if (typeof list["fantasy-land/reduce"] === "function") {
      return _methodReduce(fn, acc, list, "fantasy-land/reduce");
    }
    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === "function") {
      return _iterableReduce(fn, acc, list);
    }
    if (typeof list.reduce === "function") {
      return _methodReduce(fn, acc, list, "reduce");
    }
    throw new TypeError("reduce: list must be array or iterable");
  }
  var XMap = /* @__PURE__ */ function() {
    function XMap2(f, xf) {
      this.xf = xf;
      this.f = f;
    }
    XMap2.prototype["@@transducer/init"] = _xfBase.init;
    XMap2.prototype["@@transducer/result"] = _xfBase.result;
    XMap2.prototype["@@transducer/step"] = function(result, input2) {
      return this.xf["@@transducer/step"](result, this.f(input2));
    };
    return XMap2;
  }();
  var _xmap = /* @__PURE__ */ _curry2(function _xmap2(f, xf) {
    return new XMap(f, xf);
  });
  const _xmap$1 = _xmap;
  function _has(prop2, obj) {
    return Object.prototype.hasOwnProperty.call(obj, prop2);
  }
  var toString$2 = Object.prototype.toString;
  var _isArguments = /* @__PURE__ */ function() {
    return toString$2.call(arguments) === "[object Arguments]" ? function _isArguments2(x) {
      return toString$2.call(x) === "[object Arguments]";
    } : function _isArguments2(x) {
      return _has("callee", x);
    };
  }();
  const _isArguments$1 = _isArguments;
  var hasEnumBug = !/* @__PURE__ */ {
    toString: null
  }.propertyIsEnumerable("toString");
  var nonEnumerableProps = ["constructor", "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
  var hasArgsEnumBug = /* @__PURE__ */ function() {
    return arguments.propertyIsEnumerable("length");
  }();
  var contains = function contains2(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };
  var keys = typeof Object.keys === "function" && !hasArgsEnumBug ? /* @__PURE__ */ _curry1(function keys2(obj) {
    return Object(obj) !== obj ? [] : Object.keys(obj);
  }) : /* @__PURE__ */ _curry1(function keys2(obj) {
    if (Object(obj) !== obj) {
      return [];
    }
    var prop2, nIdx;
    var ks = [];
    var checkArgsLength = hasArgsEnumBug && _isArguments$1(obj);
    for (prop2 in obj) {
      if (_has(prop2, obj) && (!checkArgsLength || prop2 !== "length")) {
        ks[ks.length] = prop2;
      }
    }
    if (hasEnumBug) {
      nIdx = nonEnumerableProps.length - 1;
      while (nIdx >= 0) {
        prop2 = nonEnumerableProps[nIdx];
        if (_has(prop2, obj) && !contains(ks, prop2)) {
          ks[ks.length] = prop2;
        }
        nIdx -= 1;
      }
    }
    return ks;
  });
  const keys$1 = keys;
  var map = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable(["fantasy-land/map", "map"], _xmap$1, function map2(fn, functor) {
    switch (Object.prototype.toString.call(functor)) {
      case "[object Function]":
        return curryN$1(functor.length, function() {
          return fn.call(this, functor.apply(this, arguments));
        });
      case "[object Object]":
        return _reduce(function(acc, key) {
          acc[key] = fn(functor[key]);
          return acc;
        }, {}, keys$1(functor));
      default:
        return _map(fn, functor);
    }
  }));
  const map$1 = map;
  const _isInteger = Number.isInteger || function _isInteger2(n) {
    return n << 0 === n;
  };
  var nth = /* @__PURE__ */ _curry2(function nth2(offset, list) {
    var idx = offset < 0 ? list.length + offset : offset;
    return _isString(list) ? list.charAt(idx) : list[idx];
  });
  const nth$1 = nth;
  var prop = /* @__PURE__ */ _curry2(function prop2(p, obj) {
    if (obj == null) {
      return;
    }
    return _isInteger(p) ? nth$1(p, obj) : obj[p];
  });
  const prop$1 = prop;
  var pluck = /* @__PURE__ */ _curry2(function pluck2(p, list) {
    return map$1(prop$1(p), list);
  });
  const pluck$1 = pluck;
  var reduce = /* @__PURE__ */ _curry3(_reduce);
  const reduce$1 = reduce;
  var allPass = /* @__PURE__ */ _curry1(function allPass2(preds) {
    return curryN$1(reduce$1(max$1, 0, pluck$1("length", preds)), function() {
      var idx = 0;
      var len = preds.length;
      while (idx < len) {
        if (!preds[idx].apply(this, arguments)) {
          return false;
        }
        idx += 1;
      }
      return true;
    });
  });
  const allPass$1 = allPass;
  var always = /* @__PURE__ */ _curry1(function always2(val) {
    return function() {
      return val;
    };
  });
  const always$1 = always;
  var and = /* @__PURE__ */ _curry2(function and2(a, b) {
    return a && b;
  });
  const and$1 = and;
  var XAny = /* @__PURE__ */ function() {
    function XAny2(f, xf) {
      this.xf = xf;
      this.f = f;
      this.any = false;
    }
    XAny2.prototype["@@transducer/init"] = _xfBase.init;
    XAny2.prototype["@@transducer/result"] = function(result) {
      if (!this.any) {
        result = this.xf["@@transducer/step"](result, false);
      }
      return this.xf["@@transducer/result"](result);
    };
    XAny2.prototype["@@transducer/step"] = function(result, input2) {
      if (this.f(input2)) {
        this.any = true;
        result = _reduced(this.xf["@@transducer/step"](result, true));
      }
      return result;
    };
    return XAny2;
  }();
  var _xany = /* @__PURE__ */ _curry2(function _xany2(f, xf) {
    return new XAny(f, xf);
  });
  const _xany$1 = _xany;
  var any = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable(["any"], _xany$1, function any2(fn, list) {
    var idx = 0;
    while (idx < list.length) {
      if (fn(list[idx])) {
        return true;
      }
      idx += 1;
    }
    return false;
  }));
  const any$1 = any;
  var anyPass = /* @__PURE__ */ _curry1(function anyPass2(preds) {
    return curryN$1(reduce$1(max$1, 0, pluck$1("length", preds)), function() {
      var idx = 0;
      var len = preds.length;
      while (idx < len) {
        if (preds[idx].apply(this, arguments)) {
          return true;
        }
        idx += 1;
      }
      return false;
    });
  });
  const anyPass$1 = anyPass;
  var ap = /* @__PURE__ */ _curry2(function ap2(applyF, applyX) {
    return typeof applyX["fantasy-land/ap"] === "function" ? applyX["fantasy-land/ap"](applyF) : typeof applyF.ap === "function" ? applyF.ap(applyX) : typeof applyF === "function" ? function(x) {
      return applyF(x)(applyX(x));
    } : _reduce(function(acc, f) {
      return _concat(acc, map$1(f, applyX));
    }, [], applyF);
  });
  const ap$1 = ap;
  function _aperture(n, list) {
    var idx = 0;
    var limit = list.length - (n - 1);
    var acc = new Array(limit >= 0 ? limit : 0);
    while (idx < limit) {
      acc[idx] = Array.prototype.slice.call(list, idx, idx + n);
      idx += 1;
    }
    return acc;
  }
  var XAperture = /* @__PURE__ */ function() {
    function XAperture2(n, xf) {
      this.xf = xf;
      this.pos = 0;
      this.full = false;
      this.acc = new Array(n);
    }
    XAperture2.prototype["@@transducer/init"] = _xfBase.init;
    XAperture2.prototype["@@transducer/result"] = function(result) {
      this.acc = null;
      return this.xf["@@transducer/result"](result);
    };
    XAperture2.prototype["@@transducer/step"] = function(result, input2) {
      this.store(input2);
      return this.full ? this.xf["@@transducer/step"](result, this.getCopy()) : result;
    };
    XAperture2.prototype.store = function(input2) {
      this.acc[this.pos] = input2;
      this.pos += 1;
      if (this.pos === this.acc.length) {
        this.pos = 0;
        this.full = true;
      }
    };
    XAperture2.prototype.getCopy = function() {
      return _concat(Array.prototype.slice.call(this.acc, this.pos), Array.prototype.slice.call(this.acc, 0, this.pos));
    };
    return XAperture2;
  }();
  var _xaperture = /* @__PURE__ */ _curry2(function _xaperture2(n, xf) {
    return new XAperture(n, xf);
  });
  const _xaperture$1 = _xaperture;
  var aperture = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable([], _xaperture$1, _aperture));
  const aperture$1 = aperture;
  var append = /* @__PURE__ */ _curry2(function append2(el, list) {
    return _concat(list, [el]);
  });
  const append$1 = append;
  var apply = /* @__PURE__ */ _curry2(function apply2(fn, args) {
    return fn.apply(this, args);
  });
  const apply$1 = apply;
  var values = /* @__PURE__ */ _curry1(function values2(obj) {
    var props2 = keys$1(obj);
    var len = props2.length;
    var vals = [];
    var idx = 0;
    while (idx < len) {
      vals[idx] = obj[props2[idx]];
      idx += 1;
    }
    return vals;
  });
  const values$1 = values;
  function mapValues(fn, obj) {
    return _isArray(obj) ? obj.map(fn) : keys$1(obj).reduce(function(acc, key) {
      acc[key] = fn(obj[key]);
      return acc;
    }, {});
  }
  var applySpec = /* @__PURE__ */ _curry1(function applySpec2(spec) {
    spec = mapValues(function(v) {
      return typeof v == "function" ? v : applySpec2(v);
    }, spec);
    return curryN$1(reduce$1(max$1, 0, pluck$1("length", values$1(spec))), function() {
      var args = arguments;
      return mapValues(function(f) {
        return apply$1(f, args);
      }, spec);
    });
  });
  const applySpec$1 = applySpec;
  var applyTo = /* @__PURE__ */ _curry2(function applyTo2(x, f) {
    return f(x);
  });
  const applyTo$1 = applyTo;
  var ascend = /* @__PURE__ */ _curry3(function ascend2(fn, a, b) {
    var aa = fn(a);
    var bb = fn(b);
    return aa < bb ? -1 : aa > bb ? 1 : 0;
  });
  const ascend$1 = ascend;
  function _assoc(prop2, val, obj) {
    if (_isInteger(prop2) && _isArray(obj)) {
      var arr = [].concat(obj);
      arr[prop2] = val;
      return arr;
    }
    var result = {};
    for (var p in obj) {
      result[p] = obj[p];
    }
    result[prop2] = val;
    return result;
  }
  var isNil = /* @__PURE__ */ _curry1(function isNil2(x) {
    return x == null;
  });
  const isNil$1 = isNil;
  var assocPath = /* @__PURE__ */ _curry3(function assocPath2(path2, val, obj) {
    if (path2.length === 0) {
      return val;
    }
    var idx = path2[0];
    if (path2.length > 1) {
      var nextObj = !isNil$1(obj) && _has(idx, obj) ? obj[idx] : _isInteger(path2[1]) ? [] : {};
      val = assocPath2(Array.prototype.slice.call(path2, 1), val, nextObj);
    }
    return _assoc(idx, val, obj);
  });
  const assocPath$1 = assocPath;
  var assoc = /* @__PURE__ */ _curry3(function assoc2(prop2, val, obj) {
    return assocPath$1([prop2], val, obj);
  });
  const assoc$1 = assoc;
  var nAry = /* @__PURE__ */ _curry2(function nAry2(n, fn) {
    switch (n) {
      case 0:
        return function() {
          return fn.call(this);
        };
      case 1:
        return function(a0) {
          return fn.call(this, a0);
        };
      case 2:
        return function(a0, a1) {
          return fn.call(this, a0, a1);
        };
      case 3:
        return function(a0, a1, a2) {
          return fn.call(this, a0, a1, a2);
        };
      case 4:
        return function(a0, a1, a2, a3) {
          return fn.call(this, a0, a1, a2, a3);
        };
      case 5:
        return function(a0, a1, a2, a3, a4) {
          return fn.call(this, a0, a1, a2, a3, a4);
        };
      case 6:
        return function(a0, a1, a2, a3, a4, a5) {
          return fn.call(this, a0, a1, a2, a3, a4, a5);
        };
      case 7:
        return function(a0, a1, a2, a3, a4, a5, a6) {
          return fn.call(this, a0, a1, a2, a3, a4, a5, a6);
        };
      case 8:
        return function(a0, a1, a2, a3, a4, a5, a6, a7) {
          return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7);
        };
      case 9:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8);
        };
      case 10:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
        };
      default:
        throw new Error("First argument to nAry must be a non-negative integer no greater than ten");
    }
  });
  const nAry$1 = nAry;
  var binary = /* @__PURE__ */ _curry1(function binary2(fn) {
    return nAry$1(2, fn);
  });
  const binary$1 = binary;
  function _isFunction(x) {
    var type2 = Object.prototype.toString.call(x);
    return type2 === "[object Function]" || type2 === "[object AsyncFunction]" || type2 === "[object GeneratorFunction]" || type2 === "[object AsyncGeneratorFunction]";
  }
  var liftN = /* @__PURE__ */ _curry2(function liftN2(arity, fn) {
    var lifted = curryN$1(arity, fn);
    return curryN$1(arity, function() {
      return _reduce(ap$1, map$1(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
    });
  });
  const liftN$1 = liftN;
  var lift = /* @__PURE__ */ _curry1(function lift2(fn) {
    return liftN$1(fn.length, fn);
  });
  const lift$1 = lift;
  var both = /* @__PURE__ */ _curry2(function both2(f, g) {
    return _isFunction(f) ? function _both() {
      return f.apply(this, arguments) && g.apply(this, arguments);
    } : lift$1(and$1)(f, g);
  });
  const both$1 = both;
  var call = /* @__PURE__ */ _curry1(function call2(fn) {
    return fn.apply(this, Array.prototype.slice.call(arguments, 1));
  });
  const call$1 = call;
  function _makeFlat(recursive) {
    return function flatt(list) {
      var value, jlen, j;
      var result = [];
      var idx = 0;
      var ilen = list.length;
      while (idx < ilen) {
        if (_isArrayLike$1(list[idx])) {
          value = recursive ? flatt(list[idx]) : list[idx];
          j = 0;
          jlen = value.length;
          while (j < jlen) {
            result[result.length] = value[j];
            j += 1;
          }
        } else {
          result[result.length] = list[idx];
        }
        idx += 1;
      }
      return result;
    };
  }
  function _forceReduced(x) {
    return {
      "@@transducer/value": x,
      "@@transducer/reduced": true
    };
  }
  var preservingReduced = function(xf) {
    return {
      "@@transducer/init": _xfBase.init,
      "@@transducer/result": function(result) {
        return xf["@@transducer/result"](result);
      },
      "@@transducer/step": function(result, input2) {
        var ret = xf["@@transducer/step"](result, input2);
        return ret["@@transducer/reduced"] ? _forceReduced(ret) : ret;
      }
    };
  };
  var _flatCat = function _xcat(xf) {
    var rxf = preservingReduced(xf);
    return {
      "@@transducer/init": _xfBase.init,
      "@@transducer/result": function(result) {
        return rxf["@@transducer/result"](result);
      },
      "@@transducer/step": function(result, input2) {
        return !_isArrayLike$1(input2) ? _reduce(rxf, result, [input2]) : _reduce(rxf, result, input2);
      }
    };
  };
  const _flatCat$1 = _flatCat;
  var _xchain = /* @__PURE__ */ _curry2(function _xchain2(f, xf) {
    return map$1(f, _flatCat$1(xf));
  });
  const _xchain$1 = _xchain;
  var chain = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable(["fantasy-land/chain", "chain"], _xchain$1, function chain2(fn, monad) {
    if (typeof monad === "function") {
      return function(x) {
        return fn(monad(x))(x);
      };
    }
    return _makeFlat(false)(map$1(fn, monad));
  }));
  const chain$1 = chain;
  var clamp = /* @__PURE__ */ _curry3(function clamp2(min2, max2, value) {
    if (min2 > max2) {
      throw new Error("min must not be greater than max in clamp(min, max, value)");
    }
    return value < min2 ? min2 : value > max2 ? max2 : value;
  });
  const clamp$1 = clamp;
  function _cloneRegExp(pattern) {
    return new RegExp(pattern.source, (pattern.global ? "g" : "") + (pattern.ignoreCase ? "i" : "") + (pattern.multiline ? "m" : "") + (pattern.sticky ? "y" : "") + (pattern.unicode ? "u" : ""));
  }
  var type = /* @__PURE__ */ _curry1(function type2(val) {
    return val === null ? "Null" : val === void 0 ? "Undefined" : Object.prototype.toString.call(val).slice(8, -1);
  });
  const type$1 = type;
  function _clone(value, refFrom, refTo, deep) {
    var copy = function copy2(copiedValue) {
      var len = refFrom.length;
      var idx = 0;
      while (idx < len) {
        if (value === refFrom[idx]) {
          return refTo[idx];
        }
        idx += 1;
      }
      refFrom[idx] = value;
      refTo[idx] = copiedValue;
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          copiedValue[key] = deep ? _clone(value[key], refFrom, refTo, true) : value[key];
        }
      }
      return copiedValue;
    };
    switch (type$1(value)) {
      case "Object":
        return copy(Object.create(Object.getPrototypeOf(value)));
      case "Array":
        return copy([]);
      case "Date":
        return new Date(value.valueOf());
      case "RegExp":
        return _cloneRegExp(value);
      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "BigInt64Array":
      case "BigUint64Array":
        return value.slice();
      default:
        return value;
    }
  }
  var clone = /* @__PURE__ */ _curry1(function clone2(value) {
    return value != null && typeof value.clone === "function" ? value.clone() : _clone(value, [], [], true);
  });
  const clone$1 = clone;
  var collectBy = /* @__PURE__ */ _curry2(function collectBy2(fn, list) {
    var group = _reduce(function(o2, x) {
      var tag2 = fn(x);
      if (o2[tag2] === void 0) {
        o2[tag2] = [];
      }
      o2[tag2].push(x);
      return o2;
    }, {}, list);
    var newList = [];
    for (var tag in group) {
      newList.push(group[tag]);
    }
    return newList;
  });
  const collectBy$1 = collectBy;
  var comparator = /* @__PURE__ */ _curry1(function comparator2(pred) {
    return function(a, b) {
      return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
    };
  });
  const comparator$1 = comparator;
  var not = /* @__PURE__ */ _curry1(function not2(a) {
    return !a;
  });
  const not$1 = not;
  var complement = /* @__PURE__ */ lift$1(not$1);
  const complement$1 = complement;
  function _pipe(f, g) {
    return function() {
      return g.call(this, f.apply(this, arguments));
    };
  }
  function _checkForMethod(methodname, fn) {
    return function() {
      var length2 = arguments.length;
      if (length2 === 0) {
        return fn();
      }
      var obj = arguments[length2 - 1];
      return _isArray(obj) || typeof obj[methodname] !== "function" ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length2 - 1));
    };
  }
  var slice = /* @__PURE__ */ _curry3(/* @__PURE__ */ _checkForMethod("slice", function slice2(fromIndex, toIndex, list) {
    return Array.prototype.slice.call(list, fromIndex, toIndex);
  }));
  const slice$1 = slice;
  var tail = /* @__PURE__ */ _curry1(/* @__PURE__ */ _checkForMethod("tail", /* @__PURE__ */ slice$1(1, Infinity)));
  const tail$1 = tail;
  function pipe() {
    if (arguments.length === 0) {
      throw new Error("pipe requires at least one argument");
    }
    return _arity(arguments[0].length, reduce$1(_pipe, arguments[0], tail$1(arguments)));
  }
  var reverse = /* @__PURE__ */ _curry1(function reverse2(list) {
    return _isString(list) ? list.split("").reverse().join("") : Array.prototype.slice.call(list, 0).reverse();
  });
  const reverse$1 = reverse;
  function compose() {
    if (arguments.length === 0) {
      throw new Error("compose requires at least one argument");
    }
    return pipe.apply(this, reverse$1(arguments));
  }
  var head = /* @__PURE__ */ nth$1(0);
  const head$1 = head;
  function _identity(x) {
    return x;
  }
  var identity = /* @__PURE__ */ _curry1(_identity);
  const identity$1 = identity;
  var pipeWith = /* @__PURE__ */ _curry2(function pipeWith2(xf, list) {
    if (list.length <= 0) {
      return identity$1;
    }
    var headList = head$1(list);
    var tailList = tail$1(list);
    return _arity(headList.length, function() {
      return _reduce(function(result, f) {
        return xf.call(this, f, result);
      }, headList.apply(this, arguments), tailList);
    });
  });
  const pipeWith$1 = pipeWith;
  var composeWith = /* @__PURE__ */ _curry2(function composeWith2(xf, list) {
    return pipeWith$1.apply(this, [xf, reverse$1(list)]);
  });
  const composeWith$1 = composeWith;
  function _arrayFromIterator(iter) {
    var list = [];
    var next;
    while (!(next = iter.next()).done) {
      list.push(next.value);
    }
    return list;
  }
  function _includesWith(pred, x, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      if (pred(x, list[idx])) {
        return true;
      }
      idx += 1;
    }
    return false;
  }
  function _functionName(f) {
    var match2 = String(f).match(/^function (\w*)/);
    return match2 == null ? "" : match2[1];
  }
  function _objectIs(a, b) {
    if (a === b) {
      return a !== 0 || 1 / a === 1 / b;
    } else {
      return a !== a && b !== b;
    }
  }
  const _objectIs$1 = typeof Object.is === "function" ? Object.is : _objectIs;
  function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
    var a = _arrayFromIterator(aIterator);
    var b = _arrayFromIterator(bIterator);
    function eq(_a, _b) {
      return _equals(_a, _b, stackA.slice(), stackB.slice());
    }
    return !_includesWith(function(b2, aItem) {
      return !_includesWith(eq, aItem, b2);
    }, b, a);
  }
  function _equals(a, b, stackA, stackB) {
    if (_objectIs$1(a, b)) {
      return true;
    }
    var typeA = type$1(a);
    if (typeA !== type$1(b)) {
      return false;
    }
    if (typeof a["fantasy-land/equals"] === "function" || typeof b["fantasy-land/equals"] === "function") {
      return typeof a["fantasy-land/equals"] === "function" && a["fantasy-land/equals"](b) && typeof b["fantasy-land/equals"] === "function" && b["fantasy-land/equals"](a);
    }
    if (typeof a.equals === "function" || typeof b.equals === "function") {
      return typeof a.equals === "function" && a.equals(b) && typeof b.equals === "function" && b.equals(a);
    }
    switch (typeA) {
      case "Arguments":
      case "Array":
      case "Object":
        if (typeof a.constructor === "function" && _functionName(a.constructor) === "Promise") {
          return a === b;
        }
        break;
      case "Boolean":
      case "Number":
      case "String":
        if (!(typeof a === typeof b && _objectIs$1(a.valueOf(), b.valueOf()))) {
          return false;
        }
        break;
      case "Date":
        if (!_objectIs$1(a.valueOf(), b.valueOf())) {
          return false;
        }
        break;
      case "Error":
        return a.name === b.name && a.message === b.message;
      case "RegExp":
        if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
          return false;
        }
        break;
    }
    var idx = stackA.length - 1;
    while (idx >= 0) {
      if (stackA[idx] === a) {
        return stackB[idx] === b;
      }
      idx -= 1;
    }
    switch (typeA) {
      case "Map":
        if (a.size !== b.size) {
          return false;
        }
        return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));
      case "Set":
        if (a.size !== b.size) {
          return false;
        }
        return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));
      case "Arguments":
      case "Array":
      case "Object":
      case "Boolean":
      case "Number":
      case "String":
      case "Date":
      case "Error":
      case "RegExp":
      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "ArrayBuffer":
        break;
      default:
        return false;
    }
    var keysA = keys$1(a);
    if (keysA.length !== keys$1(b).length) {
      return false;
    }
    var extendedStackA = stackA.concat([a]);
    var extendedStackB = stackB.concat([b]);
    idx = keysA.length - 1;
    while (idx >= 0) {
      var key = keysA[idx];
      if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
        return false;
      }
      idx -= 1;
    }
    return true;
  }
  var equals = /* @__PURE__ */ _curry2(function equals2(a, b) {
    return _equals(a, b, [], []);
  });
  const equals$1 = equals;
  function _indexOf(list, a, idx) {
    var inf, item;
    if (typeof list.indexOf === "function") {
      switch (typeof a) {
        case "number":
          if (a === 0) {
            inf = 1 / a;
            while (idx < list.length) {
              item = list[idx];
              if (item === 0 && 1 / item === inf) {
                return idx;
              }
              idx += 1;
            }
            return -1;
          } else if (a !== a) {
            while (idx < list.length) {
              item = list[idx];
              if (typeof item === "number" && item !== item) {
                return idx;
              }
              idx += 1;
            }
            return -1;
          }
          return list.indexOf(a, idx);
        case "string":
        case "boolean":
        case "function":
        case "undefined":
          return list.indexOf(a, idx);
        case "object":
          if (a === null) {
            return list.indexOf(a, idx);
          }
      }
    }
    while (idx < list.length) {
      if (equals$1(list[idx], a)) {
        return idx;
      }
      idx += 1;
    }
    return -1;
  }
  function _includes(a, list) {
    return _indexOf(list, a, 0) >= 0;
  }
  function _quote(s) {
    var escaped = s.replace(/\\/g, "\\\\").replace(/[\b]/g, "\\b").replace(/\f/g, "\\f").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\v/g, "\\v").replace(/\0/g, "\\0");
    return '"' + escaped.replace(/"/g, '\\"') + '"';
  }
  var pad = function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  };
  var _toISOString = typeof Date.prototype.toISOString === "function" ? function _toISOString2(d) {
    return d.toISOString();
  } : function _toISOString2(d) {
    return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "." + (d.getUTCMilliseconds() / 1e3).toFixed(3).slice(2, 5) + "Z";
  };
  const _toISOString$1 = _toISOString;
  function _complement(f) {
    return function() {
      return !f.apply(this, arguments);
    };
  }
  function _filter(fn, list) {
    var idx = 0;
    var len = list.length;
    var result = [];
    while (idx < len) {
      if (fn(list[idx])) {
        result[result.length] = list[idx];
      }
      idx += 1;
    }
    return result;
  }
  function _isObject(x) {
    return Object.prototype.toString.call(x) === "[object Object]";
  }
  var XFilter = /* @__PURE__ */ function() {
    function XFilter2(f, xf) {
      this.xf = xf;
      this.f = f;
    }
    XFilter2.prototype["@@transducer/init"] = _xfBase.init;
    XFilter2.prototype["@@transducer/result"] = _xfBase.result;
    XFilter2.prototype["@@transducer/step"] = function(result, input2) {
      return this.f(input2) ? this.xf["@@transducer/step"](result, input2) : result;
    };
    return XFilter2;
  }();
  var _xfilter = /* @__PURE__ */ _curry2(function _xfilter2(f, xf) {
    return new XFilter(f, xf);
  });
  const _xfilter$1 = _xfilter;
  var filter = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable(["fantasy-land/filter", "filter"], _xfilter$1, function(pred, filterable) {
    return _isObject(filterable) ? _reduce(function(acc, key) {
      if (pred(filterable[key])) {
        acc[key] = filterable[key];
      }
      return acc;
    }, {}, keys$1(filterable)) : _filter(pred, filterable);
  }));
  const filter$1 = filter;
  var reject = /* @__PURE__ */ _curry2(function reject2(pred, filterable) {
    return filter$1(_complement(pred), filterable);
  });
  const reject$1 = reject;
  function _toString(x, seen) {
    var recur = function recur2(y) {
      var xs = seen.concat([x]);
      return _includes(y, xs) ? "<Circular>" : _toString(y, xs);
    };
    var mapPairs = function(obj, keys2) {
      return _map(function(k) {
        return _quote(k) + ": " + recur(obj[k]);
      }, keys2.slice().sort());
    };
    switch (Object.prototype.toString.call(x)) {
      case "[object Arguments]":
        return "(function() { return arguments; }(" + _map(recur, x).join(", ") + "))";
      case "[object Array]":
        return "[" + _map(recur, x).concat(mapPairs(x, reject$1(function(k) {
          return /^\d+$/.test(k);
        }, keys$1(x)))).join(", ") + "]";
      case "[object Boolean]":
        return typeof x === "object" ? "new Boolean(" + recur(x.valueOf()) + ")" : x.toString();
      case "[object Date]":
        return "new Date(" + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString$1(x))) + ")";
      case "[object Null]":
        return "null";
      case "[object Number]":
        return typeof x === "object" ? "new Number(" + recur(x.valueOf()) + ")" : 1 / x === -Infinity ? "-0" : x.toString(10);
      case "[object String]":
        return typeof x === "object" ? "new String(" + recur(x.valueOf()) + ")" : _quote(x);
      case "[object Undefined]":
        return "undefined";
      default:
        if (typeof x.toString === "function") {
          var repr = x.toString();
          if (repr !== "[object Object]") {
            return repr;
          }
        }
        return "{" + mapPairs(x, keys$1(x)).join(", ") + "}";
    }
  }
  var toString = /* @__PURE__ */ _curry1(function toString2(val) {
    return _toString(val, []);
  });
  const toString$1 = toString;
  var concat = /* @__PURE__ */ _curry2(function concat2(a, b) {
    if (_isArray(a)) {
      if (_isArray(b)) {
        return a.concat(b);
      }
      throw new TypeError(toString$1(b) + " is not an array");
    }
    if (_isString(a)) {
      if (_isString(b)) {
        return a + b;
      }
      throw new TypeError(toString$1(b) + " is not a string");
    }
    if (a != null && _isFunction(a["fantasy-land/concat"])) {
      return a["fantasy-land/concat"](b);
    }
    if (a != null && _isFunction(a.concat)) {
      return a.concat(b);
    }
    throw new TypeError(toString$1(a) + ' does not have a method named "concat" or "fantasy-land/concat"');
  });
  const concat$1 = concat;
  var cond = /* @__PURE__ */ _curry1(function cond2(pairs) {
    var arity = reduce$1(max$1, 0, map$1(function(pair2) {
      return pair2[0].length;
    }, pairs));
    return _arity(arity, function() {
      var idx = 0;
      while (idx < pairs.length) {
        if (pairs[idx][0].apply(this, arguments)) {
          return pairs[idx][1].apply(this, arguments);
        }
        idx += 1;
      }
    });
  });
  const cond$1 = cond;
  var curry = /* @__PURE__ */ _curry1(function curry2(fn) {
    return curryN$1(fn.length, fn);
  });
  const curry$1 = curry;
  var constructN = /* @__PURE__ */ _curry2(function constructN2(n, Fn) {
    if (n > 10) {
      throw new Error("Constructor with greater than ten arguments");
    }
    if (n === 0) {
      return function() {
        return new Fn();
      };
    }
    return curry$1(nAry$1(n, function($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
      switch (arguments.length) {
        case 1:
          return new Fn($0);
        case 2:
          return new Fn($0, $1);
        case 3:
          return new Fn($0, $1, $2);
        case 4:
          return new Fn($0, $1, $2, $3);
        case 5:
          return new Fn($0, $1, $2, $3, $4);
        case 6:
          return new Fn($0, $1, $2, $3, $4, $5);
        case 7:
          return new Fn($0, $1, $2, $3, $4, $5, $6);
        case 8:
          return new Fn($0, $1, $2, $3, $4, $5, $6, $7);
        case 9:
          return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8);
        case 10:
          return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8, $9);
      }
    }));
  });
  const constructN$1 = constructN;
  var construct = /* @__PURE__ */ _curry1(function construct2(Fn) {
    return constructN$1(Fn.length, Fn);
  });
  const construct$1 = construct;
  var converge = /* @__PURE__ */ _curry2(function converge2(after, fns) {
    return curryN$1(reduce$1(max$1, 0, pluck$1("length", fns)), function() {
      var args = arguments;
      var context = this;
      return after.apply(context, _map(function(fn) {
        return fn.apply(context, args);
      }, fns));
    });
  });
  const converge$1 = converge;
  var count = /* @__PURE__ */ curry$1(function(pred, list) {
    return _reduce(function(a, e) {
      return pred(e) ? a + 1 : a;
    }, 0, list);
  });
  const count$1 = count;
  var XReduceBy = /* @__PURE__ */ function() {
    function XReduceBy2(valueFn, valueAcc, keyFn, xf) {
      this.valueFn = valueFn;
      this.valueAcc = valueAcc;
      this.keyFn = keyFn;
      this.xf = xf;
      this.inputs = {};
    }
    XReduceBy2.prototype["@@transducer/init"] = _xfBase.init;
    XReduceBy2.prototype["@@transducer/result"] = function(result) {
      var key;
      for (key in this.inputs) {
        if (_has(key, this.inputs)) {
          result = this.xf["@@transducer/step"](result, this.inputs[key]);
          if (result["@@transducer/reduced"]) {
            result = result["@@transducer/value"];
            break;
          }
        }
      }
      this.inputs = null;
      return this.xf["@@transducer/result"](result);
    };
    XReduceBy2.prototype["@@transducer/step"] = function(result, input2) {
      var key = this.keyFn(input2);
      this.inputs[key] = this.inputs[key] || [key, this.valueAcc];
      this.inputs[key][1] = this.valueFn(this.inputs[key][1], input2);
      return result;
    };
    return XReduceBy2;
  }();
  var _xreduceBy = /* @__PURE__ */ _curryN(4, [], function _xreduceBy2(valueFn, valueAcc, keyFn, xf) {
    return new XReduceBy(valueFn, valueAcc, keyFn, xf);
  });
  const _xreduceBy$1 = _xreduceBy;
  var reduceBy = /* @__PURE__ */ _curryN(4, [], /* @__PURE__ */ _dispatchable([], _xreduceBy$1, function reduceBy2(valueFn, valueAcc, keyFn, list) {
    return _reduce(function(acc, elt) {
      var key = keyFn(elt);
      var value = valueFn(_has(key, acc) ? acc[key] : _clone(valueAcc, [], [], false), elt);
      if (value && value["@@transducer/reduced"]) {
        return _reduced(acc);
      }
      acc[key] = value;
      return acc;
    }, {}, list);
  }));
  const reduceBy$1 = reduceBy;
  var countBy = /* @__PURE__ */ reduceBy$1(function(acc, elem) {
    return acc + 1;
  }, 0);
  const countBy$1 = countBy;
  var dec = /* @__PURE__ */ add$1(-1);
  const dec$1 = dec;
  var defaultTo = /* @__PURE__ */ _curry2(function defaultTo2(d, v) {
    return v == null || v !== v ? d : v;
  });
  const defaultTo$1 = defaultTo;
  var descend = /* @__PURE__ */ _curry3(function descend2(fn, a, b) {
    var aa = fn(a);
    var bb = fn(b);
    return aa > bb ? -1 : aa < bb ? 1 : 0;
  });
  const descend$1 = descend;
  var _Set = /* @__PURE__ */ function() {
    function _Set2() {
      this._nativeSet = typeof Set === "function" ? /* @__PURE__ */ new Set() : null;
      this._items = {};
    }
    _Set2.prototype.add = function(item) {
      return !hasOrAdd(item, true, this);
    };
    _Set2.prototype.has = function(item) {
      return hasOrAdd(item, false, this);
    };
    return _Set2;
  }();
  function hasOrAdd(item, shouldAdd, set2) {
    var type2 = typeof item;
    var prevSize, newSize;
    switch (type2) {
      case "string":
      case "number":
        if (item === 0 && 1 / item === -Infinity) {
          if (set2._items["-0"]) {
            return true;
          } else {
            if (shouldAdd) {
              set2._items["-0"] = true;
            }
            return false;
          }
        }
        if (set2._nativeSet !== null) {
          if (shouldAdd) {
            prevSize = set2._nativeSet.size;
            set2._nativeSet.add(item);
            newSize = set2._nativeSet.size;
            return newSize === prevSize;
          } else {
            return set2._nativeSet.has(item);
          }
        } else {
          if (!(type2 in set2._items)) {
            if (shouldAdd) {
              set2._items[type2] = {};
              set2._items[type2][item] = true;
            }
            return false;
          } else if (item in set2._items[type2]) {
            return true;
          } else {
            if (shouldAdd) {
              set2._items[type2][item] = true;
            }
            return false;
          }
        }
      case "boolean":
        if (type2 in set2._items) {
          var bIdx = item ? 1 : 0;
          if (set2._items[type2][bIdx]) {
            return true;
          } else {
            if (shouldAdd) {
              set2._items[type2][bIdx] = true;
            }
            return false;
          }
        } else {
          if (shouldAdd) {
            set2._items[type2] = item ? [false, true] : [true, false];
          }
          return false;
        }
      case "function":
        if (set2._nativeSet !== null) {
          if (shouldAdd) {
            prevSize = set2._nativeSet.size;
            set2._nativeSet.add(item);
            newSize = set2._nativeSet.size;
            return newSize === prevSize;
          } else {
            return set2._nativeSet.has(item);
          }
        } else {
          if (!(type2 in set2._items)) {
            if (shouldAdd) {
              set2._items[type2] = [item];
            }
            return false;
          }
          if (!_includes(item, set2._items[type2])) {
            if (shouldAdd) {
              set2._items[type2].push(item);
            }
            return false;
          }
          return true;
        }
      case "undefined":
        if (set2._items[type2]) {
          return true;
        } else {
          if (shouldAdd) {
            set2._items[type2] = true;
          }
          return false;
        }
      case "object":
        if (item === null) {
          if (!set2._items["null"]) {
            if (shouldAdd) {
              set2._items["null"] = true;
            }
            return false;
          }
          return true;
        }
      default:
        type2 = Object.prototype.toString.call(item);
        if (!(type2 in set2._items)) {
          if (shouldAdd) {
            set2._items[type2] = [item];
          }
          return false;
        }
        if (!_includes(item, set2._items[type2])) {
          if (shouldAdd) {
            set2._items[type2].push(item);
          }
          return false;
        }
        return true;
    }
  }
  const _Set$1 = _Set;
  var difference = /* @__PURE__ */ _curry2(function difference2(first, second) {
    var out = [];
    var idx = 0;
    var firstLen = first.length;
    var secondLen = second.length;
    var toFilterOut = new _Set$1();
    for (var i = 0; i < secondLen; i += 1) {
      toFilterOut.add(second[i]);
    }
    while (idx < firstLen) {
      if (toFilterOut.add(first[idx])) {
        out[out.length] = first[idx];
      }
      idx += 1;
    }
    return out;
  });
  const difference$1 = difference;
  var differenceWith = /* @__PURE__ */ _curry3(function differenceWith2(pred, first, second) {
    var out = [];
    var idx = 0;
    var firstLen = first.length;
    while (idx < firstLen) {
      if (!_includesWith(pred, first[idx], second) && !_includesWith(pred, first[idx], out)) {
        out.push(first[idx]);
      }
      idx += 1;
    }
    return out;
  });
  const differenceWith$1 = differenceWith;
  var remove = /* @__PURE__ */ _curry3(function remove2(start, count2, list) {
    var result = Array.prototype.slice.call(list, 0);
    result.splice(start, count2);
    return result;
  });
  const remove$1 = remove;
  function _dissoc(prop2, obj) {
    if (obj == null) {
      return obj;
    }
    if (_isInteger(prop2) && _isArray(obj)) {
      return remove$1(prop2, 1, obj);
    }
    var result = {};
    for (var p in obj) {
      result[p] = obj[p];
    }
    delete result[prop2];
    return result;
  }
  function _shallowCloneObject(prop2, obj) {
    if (_isInteger(prop2) && _isArray(obj)) {
      return [].concat(obj);
    }
    var result = {};
    for (var p in obj) {
      result[p] = obj[p];
    }
    return result;
  }
  var dissocPath = /* @__PURE__ */ _curry2(function dissocPath2(path2, obj) {
    if (obj == null) {
      return obj;
    }
    switch (path2.length) {
      case 0:
        return obj;
      case 1:
        return _dissoc(path2[0], obj);
      default:
        var head2 = path2[0];
        var tail2 = Array.prototype.slice.call(path2, 1);
        if (obj[head2] == null) {
          return _shallowCloneObject(head2, obj);
        } else {
          return assoc$1(head2, dissocPath2(tail2, obj[head2]), obj);
        }
    }
  });
  const dissocPath$1 = dissocPath;
  var dissoc = /* @__PURE__ */ _curry2(function dissoc2(prop2, obj) {
    return dissocPath$1([prop2], obj);
  });
  const dissoc$1 = dissoc;
  var divide = /* @__PURE__ */ _curry2(function divide2(a, b) {
    return a / b;
  });
  const divide$1 = divide;
  var XDrop = /* @__PURE__ */ function() {
    function XDrop2(n, xf) {
      this.xf = xf;
      this.n = n;
    }
    XDrop2.prototype["@@transducer/init"] = _xfBase.init;
    XDrop2.prototype["@@transducer/result"] = _xfBase.result;
    XDrop2.prototype["@@transducer/step"] = function(result, input2) {
      if (this.n > 0) {
        this.n -= 1;
        return result;
      }
      return this.xf["@@transducer/step"](result, input2);
    };
    return XDrop2;
  }();
  var _xdrop = /* @__PURE__ */ _curry2(function _xdrop2(n, xf) {
    return new XDrop(n, xf);
  });
  const _xdrop$1 = _xdrop;
  var drop = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable(["drop"], _xdrop$1, function drop2(n, xs) {
    return slice$1(Math.max(0, n), Infinity, xs);
  }));
  const drop$1 = drop;
  var XTake = /* @__PURE__ */ function() {
    function XTake2(n, xf) {
      this.xf = xf;
      this.n = n;
      this.i = 0;
    }
    XTake2.prototype["@@transducer/init"] = _xfBase.init;
    XTake2.prototype["@@transducer/result"] = _xfBase.result;
    XTake2.prototype["@@transducer/step"] = function(result, input2) {
      this.i += 1;
      var ret = this.n === 0 ? result : this.xf["@@transducer/step"](result, input2);
      return this.n >= 0 && this.i >= this.n ? _reduced(ret) : ret;
    };
    return XTake2;
  }();
  var _xtake = /* @__PURE__ */ _curry2(function _xtake2(n, xf) {
    return new XTake(n, xf);
  });
  const _xtake$1 = _xtake;
  var take = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable(["take"], _xtake$1, function take2(n, xs) {
    return slice$1(0, n < 0 ? Infinity : n, xs);
  }));
  const take$1 = take;
  function dropLast$2(n, xs) {
    return take$1(n < xs.length ? xs.length - n : 0, xs);
  }
  var XDropLast = /* @__PURE__ */ function() {
    function XDropLast2(n, xf) {
      this.xf = xf;
      this.pos = 0;
      this.full = false;
      this.acc = new Array(n);
    }
    XDropLast2.prototype["@@transducer/init"] = _xfBase.init;
    XDropLast2.prototype["@@transducer/result"] = function(result) {
      this.acc = null;
      return this.xf["@@transducer/result"](result);
    };
    XDropLast2.prototype["@@transducer/step"] = function(result, input2) {
      if (this.full) {
        result = this.xf["@@transducer/step"](result, this.acc[this.pos]);
      }
      this.store(input2);
      return result;
    };
    XDropLast2.prototype.store = function(input2) {
      this.acc[this.pos] = input2;
      this.pos += 1;
      if (this.pos === this.acc.length) {
        this.pos = 0;
        this.full = true;
      }
    };
    return XDropLast2;
  }();
  var _xdropLast = /* @__PURE__ */ _curry2(function _xdropLast2(n, xf) {
    return new XDropLast(n, xf);
  });
  const _xdropLast$1 = _xdropLast;
  var dropLast = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable([], _xdropLast$1, dropLast$2));
  const dropLast$1 = dropLast;
  function dropLastWhile$2(pred, xs) {
    var idx = xs.length - 1;
    while (idx >= 0 && pred(xs[idx])) {
      idx -= 1;
    }
    return slice$1(0, idx + 1, xs);
  }
  var XDropLastWhile = /* @__PURE__ */ function() {
    function XDropLastWhile2(fn, xf) {
      this.f = fn;
      this.retained = [];
      this.xf = xf;
    }
    XDropLastWhile2.prototype["@@transducer/init"] = _xfBase.init;
    XDropLastWhile2.prototype["@@transducer/result"] = function(result) {
      this.retained = null;
      return this.xf["@@transducer/result"](result);
    };
    XDropLastWhile2.prototype["@@transducer/step"] = function(result, input2) {
      return this.f(input2) ? this.retain(result, input2) : this.flush(result, input2);
    };
    XDropLastWhile2.prototype.flush = function(result, input2) {
      result = _reduce(this.xf["@@transducer/step"], result, this.retained);
      this.retained = [];
      return this.xf["@@transducer/step"](result, input2);
    };
    XDropLastWhile2.prototype.retain = function(result, input2) {
      this.retained.push(input2);
      return result;
    };
    return XDropLastWhile2;
  }();
  var _xdropLastWhile = /* @__PURE__ */ _curry2(function _xdropLastWhile2(fn, xf) {
    return new XDropLastWhile(fn, xf);
  });
  const _xdropLastWhile$1 = _xdropLastWhile;
  var dropLastWhile = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable([], _xdropLastWhile$1, dropLastWhile$2));
  const dropLastWhile$1 = dropLastWhile;
  var XDropRepeatsWith = /* @__PURE__ */ function() {
    function XDropRepeatsWith2(pred, xf) {
      this.xf = xf;
      this.pred = pred;
      this.lastValue = void 0;
      this.seenFirstValue = false;
    }
    XDropRepeatsWith2.prototype["@@transducer/init"] = _xfBase.init;
    XDropRepeatsWith2.prototype["@@transducer/result"] = _xfBase.result;
    XDropRepeatsWith2.prototype["@@transducer/step"] = function(result, input2) {
      var sameAsLast = false;
      if (!this.seenFirstValue) {
        this.seenFirstValue = true;
      } else if (this.pred(this.lastValue, input2)) {
        sameAsLast = true;
      }
      this.lastValue = input2;
      return sameAsLast ? result : this.xf["@@transducer/step"](result, input2);
    };
    return XDropRepeatsWith2;
  }();
  var _xdropRepeatsWith = /* @__PURE__ */ _curry2(function _xdropRepeatsWith2(pred, xf) {
    return new XDropRepeatsWith(pred, xf);
  });
  const _xdropRepeatsWith$1 = _xdropRepeatsWith;
  var last = /* @__PURE__ */ nth$1(-1);
  const last$1 = last;
  var dropRepeatsWith = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable([], _xdropRepeatsWith$1, function dropRepeatsWith2(pred, list) {
    var result = [];
    var idx = 1;
    var len = list.length;
    if (len !== 0) {
      result[0] = list[0];
      while (idx < len) {
        if (!pred(last$1(result), list[idx])) {
          result[result.length] = list[idx];
        }
        idx += 1;
      }
    }
    return result;
  }));
  const dropRepeatsWith$1 = dropRepeatsWith;
  var dropRepeats = /* @__PURE__ */ _curry1(/* @__PURE__ */ _dispatchable([], /* @__PURE__ */ _xdropRepeatsWith$1(equals$1), /* @__PURE__ */ dropRepeatsWith$1(equals$1)));
  const dropRepeats$1 = dropRepeats;
  var XDropWhile = /* @__PURE__ */ function() {
    function XDropWhile2(f, xf) {
      this.xf = xf;
      this.f = f;
    }
    XDropWhile2.prototype["@@transducer/init"] = _xfBase.init;
    XDropWhile2.prototype["@@transducer/result"] = _xfBase.result;
    XDropWhile2.prototype["@@transducer/step"] = function(result, input2) {
      if (this.f) {
        if (this.f(input2)) {
          return result;
        }
        this.f = null;
      }
      return this.xf["@@transducer/step"](result, input2);
    };
    return XDropWhile2;
  }();
  var _xdropWhile = /* @__PURE__ */ _curry2(function _xdropWhile2(f, xf) {
    return new XDropWhile(f, xf);
  });
  const _xdropWhile$1 = _xdropWhile;
  var dropWhile = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable(["dropWhile"], _xdropWhile$1, function dropWhile2(pred, xs) {
    var idx = 0;
    var len = xs.length;
    while (idx < len && pred(xs[idx])) {
      idx += 1;
    }
    return slice$1(idx, Infinity, xs);
  }));
  const dropWhile$1 = dropWhile;
  var or = /* @__PURE__ */ _curry2(function or2(a, b) {
    return a || b;
  });
  const or$1 = or;
  var either = /* @__PURE__ */ _curry2(function either2(f, g) {
    return _isFunction(f) ? function _either() {
      return f.apply(this, arguments) || g.apply(this, arguments);
    } : lift$1(or$1)(f, g);
  });
  const either$1 = either;
  function _isTypedArray(val) {
    var type2 = Object.prototype.toString.call(val);
    return type2 === "[object Uint8ClampedArray]" || type2 === "[object Int8Array]" || type2 === "[object Uint8Array]" || type2 === "[object Int16Array]" || type2 === "[object Uint16Array]" || type2 === "[object Int32Array]" || type2 === "[object Uint32Array]" || type2 === "[object Float32Array]" || type2 === "[object Float64Array]" || type2 === "[object BigInt64Array]" || type2 === "[object BigUint64Array]";
  }
  var empty = /* @__PURE__ */ _curry1(function empty2(x) {
    return x != null && typeof x["fantasy-land/empty"] === "function" ? x["fantasy-land/empty"]() : x != null && x.constructor != null && typeof x.constructor["fantasy-land/empty"] === "function" ? x.constructor["fantasy-land/empty"]() : x != null && typeof x.empty === "function" ? x.empty() : x != null && x.constructor != null && typeof x.constructor.empty === "function" ? x.constructor.empty() : _isArray(x) ? [] : _isString(x) ? "" : _isObject(x) ? {} : _isArguments$1(x) ? function() {
      return arguments;
    }() : _isTypedArray(x) ? x.constructor.from("") : void 0;
  });
  const empty$1 = empty;
  var takeLast = /* @__PURE__ */ _curry2(function takeLast2(n, xs) {
    return drop$1(n >= 0 ? xs.length - n : 0, xs);
  });
  const takeLast$1 = takeLast;
  var endsWith = /* @__PURE__ */ _curry2(function(suffix, list) {
    return equals$1(takeLast$1(suffix.length, list), suffix);
  });
  const endsWith$1 = endsWith;
  var eqBy = /* @__PURE__ */ _curry3(function eqBy2(f, x, y) {
    return equals$1(f(x), f(y));
  });
  const eqBy$1 = eqBy;
  var eqProps = /* @__PURE__ */ _curry3(function eqProps2(prop2, obj1, obj2) {
    return equals$1(obj1[prop2], obj2[prop2]);
  });
  const eqProps$1 = eqProps;
  var evolve = /* @__PURE__ */ _curry2(function evolve2(transformations, object) {
    if (!_isObject(object) && !_isArray(object)) {
      return object;
    }
    var result = object instanceof Array ? [] : {};
    var transformation, key, type2;
    for (key in object) {
      transformation = transformations[key];
      type2 = typeof transformation;
      result[key] = type2 === "function" ? transformation(object[key]) : transformation && type2 === "object" ? evolve2(transformation, object[key]) : object[key];
    }
    return result;
  });
  const evolve$1 = evolve;
  var XFind = /* @__PURE__ */ function() {
    function XFind2(f, xf) {
      this.xf = xf;
      this.f = f;
      this.found = false;
    }
    XFind2.prototype["@@transducer/init"] = _xfBase.init;
    XFind2.prototype["@@transducer/result"] = function(result) {
      if (!this.found) {
        result = this.xf["@@transducer/step"](result, void 0);
      }
      return this.xf["@@transducer/result"](result);
    };
    XFind2.prototype["@@transducer/step"] = function(result, input2) {
      if (this.f(input2)) {
        this.found = true;
        result = _reduced(this.xf["@@transducer/step"](result, input2));
      }
      return result;
    };
    return XFind2;
  }();
  var _xfind = /* @__PURE__ */ _curry2(function _xfind2(f, xf) {
    return new XFind(f, xf);
  });
  const _xfind$1 = _xfind;
  var find = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable(["find"], _xfind$1, function find2(fn, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      if (fn(list[idx])) {
        return list[idx];
      }
      idx += 1;
    }
  }));
  const find$1 = find;
  var XFindIndex = /* @__PURE__ */ function() {
    function XFindIndex2(f, xf) {
      this.xf = xf;
      this.f = f;
      this.idx = -1;
      this.found = false;
    }
    XFindIndex2.prototype["@@transducer/init"] = _xfBase.init;
    XFindIndex2.prototype["@@transducer/result"] = function(result) {
      if (!this.found) {
        result = this.xf["@@transducer/step"](result, -1);
      }
      return this.xf["@@transducer/result"](result);
    };
    XFindIndex2.prototype["@@transducer/step"] = function(result, input2) {
      this.idx += 1;
      if (this.f(input2)) {
        this.found = true;
        result = _reduced(this.xf["@@transducer/step"](result, this.idx));
      }
      return result;
    };
    return XFindIndex2;
  }();
  var _xfindIndex = /* @__PURE__ */ _curry2(function _xfindIndex2(f, xf) {
    return new XFindIndex(f, xf);
  });
  const _xfindIndex$1 = _xfindIndex;
  var findIndex = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable([], _xfindIndex$1, function findIndex2(fn, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      if (fn(list[idx])) {
        return idx;
      }
      idx += 1;
    }
    return -1;
  }));
  const findIndex$1 = findIndex;
  var XFindLast = /* @__PURE__ */ function() {
    function XFindLast2(f, xf) {
      this.xf = xf;
      this.f = f;
    }
    XFindLast2.prototype["@@transducer/init"] = _xfBase.init;
    XFindLast2.prototype["@@transducer/result"] = function(result) {
      return this.xf["@@transducer/result"](this.xf["@@transducer/step"](result, this.last));
    };
    XFindLast2.prototype["@@transducer/step"] = function(result, input2) {
      if (this.f(input2)) {
        this.last = input2;
      }
      return result;
    };
    return XFindLast2;
  }();
  var _xfindLast = /* @__PURE__ */ _curry2(function _xfindLast2(f, xf) {
    return new XFindLast(f, xf);
  });
  const _xfindLast$1 = _xfindLast;
  var findLast = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable([], _xfindLast$1, function findLast2(fn, list) {
    var idx = list.length - 1;
    while (idx >= 0) {
      if (fn(list[idx])) {
        return list[idx];
      }
      idx -= 1;
    }
  }));
  const findLast$1 = findLast;
  var XFindLastIndex = /* @__PURE__ */ function() {
    function XFindLastIndex2(f, xf) {
      this.xf = xf;
      this.f = f;
      this.idx = -1;
      this.lastIdx = -1;
    }
    XFindLastIndex2.prototype["@@transducer/init"] = _xfBase.init;
    XFindLastIndex2.prototype["@@transducer/result"] = function(result) {
      return this.xf["@@transducer/result"](this.xf["@@transducer/step"](result, this.lastIdx));
    };
    XFindLastIndex2.prototype["@@transducer/step"] = function(result, input2) {
      this.idx += 1;
      if (this.f(input2)) {
        this.lastIdx = this.idx;
      }
      return result;
    };
    return XFindLastIndex2;
  }();
  var _xfindLastIndex = /* @__PURE__ */ _curry2(function _xfindLastIndex2(f, xf) {
    return new XFindLastIndex(f, xf);
  });
  const _xfindLastIndex$1 = _xfindLastIndex;
  var findLastIndex = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable([], _xfindLastIndex$1, function findLastIndex2(fn, list) {
    var idx = list.length - 1;
    while (idx >= 0) {
      if (fn(list[idx])) {
        return idx;
      }
      idx -= 1;
    }
    return -1;
  }));
  const findLastIndex$1 = findLastIndex;
  var flatten = /* @__PURE__ */ _curry1(/* @__PURE__ */ _makeFlat(true));
  const flatten$1 = flatten;
  var flip = /* @__PURE__ */ _curry1(function flip2(fn) {
    return curryN$1(fn.length, function(a, b) {
      var args = Array.prototype.slice.call(arguments, 0);
      args[0] = b;
      args[1] = a;
      return fn.apply(this, args);
    });
  });
  const flip$1 = flip;
  var forEach = /* @__PURE__ */ _curry2(/* @__PURE__ */ _checkForMethod("forEach", function forEach2(fn, list) {
    var len = list.length;
    var idx = 0;
    while (idx < len) {
      fn(list[idx]);
      idx += 1;
    }
    return list;
  }));
  const forEach$1 = forEach;
  var forEachObjIndexed = /* @__PURE__ */ _curry2(function forEachObjIndexed2(fn, obj) {
    var keyList = keys$1(obj);
    var idx = 0;
    while (idx < keyList.length) {
      var key = keyList[idx];
      fn(obj[key], key, obj);
      idx += 1;
    }
    return obj;
  });
  const forEachObjIndexed$1 = forEachObjIndexed;
  var fromPairs = /* @__PURE__ */ _curry1(function fromPairs2(pairs) {
    var result = {};
    var idx = 0;
    while (idx < pairs.length) {
      result[pairs[idx][0]] = pairs[idx][1];
      idx += 1;
    }
    return result;
  });
  const fromPairs$1 = fromPairs;
  var groupBy = /* @__PURE__ */ _curry2(/* @__PURE__ */ _checkForMethod("groupBy", /* @__PURE__ */ reduceBy$1(function(acc, item) {
    acc.push(item);
    return acc;
  }, [])));
  const groupBy$1 = groupBy;
  var groupWith = /* @__PURE__ */ _curry2(function(fn, list) {
    var res = [];
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      var nextidx = idx + 1;
      while (nextidx < len && fn(list[nextidx - 1], list[nextidx])) {
        nextidx += 1;
      }
      res.push(list.slice(idx, nextidx));
      idx = nextidx;
    }
    return res;
  });
  const groupWith$1 = groupWith;
  var gt = /* @__PURE__ */ _curry2(function gt2(a, b) {
    return a > b;
  });
  const gt$1 = gt;
  var gte = /* @__PURE__ */ _curry2(function gte2(a, b) {
    return a >= b;
  });
  const gte$1 = gte;
  var hasPath = /* @__PURE__ */ _curry2(function hasPath2(_path, obj) {
    if (_path.length === 0 || isNil$1(obj)) {
      return false;
    }
    var val = obj;
    var idx = 0;
    while (idx < _path.length) {
      if (!isNil$1(val) && _has(_path[idx], val)) {
        val = val[_path[idx]];
        idx += 1;
      } else {
        return false;
      }
    }
    return true;
  });
  const hasPath$1 = hasPath;
  var has = /* @__PURE__ */ _curry2(function has2(prop2, obj) {
    return hasPath$1([prop2], obj);
  });
  const has$1 = has;
  var hasIn = /* @__PURE__ */ _curry2(function hasIn2(prop2, obj) {
    if (isNil$1(obj)) {
      return false;
    }
    return prop2 in obj;
  });
  const hasIn$1 = hasIn;
  var identical = /* @__PURE__ */ _curry2(_objectIs$1);
  const identical$1 = identical;
  var ifElse = /* @__PURE__ */ _curry3(function ifElse2(condition, onTrue, onFalse) {
    return curryN$1(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
      return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
    });
  });
  const ifElse$1 = ifElse;
  var inc = /* @__PURE__ */ add$1(1);
  const inc$1 = inc;
  var includes = /* @__PURE__ */ _curry2(_includes);
  const includes$1 = includes;
  var indexBy = /* @__PURE__ */ reduceBy$1(function(acc, elem) {
    return elem;
  }, null);
  const indexBy$1 = indexBy;
  var indexOf = /* @__PURE__ */ _curry2(function indexOf2(target, xs) {
    return typeof xs.indexOf === "function" && !_isArray(xs) ? xs.indexOf(target) : _indexOf(xs, target, 0);
  });
  const indexOf$1 = indexOf;
  var init = /* @__PURE__ */ slice$1(0, -1);
  const init$1 = init;
  var innerJoin = /* @__PURE__ */ _curry3(function innerJoin2(pred, xs, ys) {
    return _filter(function(x) {
      return _includesWith(pred, x, ys);
    }, xs);
  });
  const innerJoin$1 = innerJoin;
  var insert = /* @__PURE__ */ _curry3(function insert2(idx, elt, list) {
    idx = idx < list.length && idx >= 0 ? idx : list.length;
    var result = Array.prototype.slice.call(list, 0);
    result.splice(idx, 0, elt);
    return result;
  });
  const insert$1 = insert;
  var insertAll = /* @__PURE__ */ _curry3(function insertAll2(idx, elts, list) {
    idx = idx < list.length && idx >= 0 ? idx : list.length;
    return [].concat(Array.prototype.slice.call(list, 0, idx), elts, Array.prototype.slice.call(list, idx));
  });
  const insertAll$1 = insertAll;
  var XUniqBy = /* @__PURE__ */ function() {
    function XUniqBy2(f, xf) {
      this.xf = xf;
      this.f = f;
      this.set = new _Set$1();
    }
    XUniqBy2.prototype["@@transducer/init"] = _xfBase.init;
    XUniqBy2.prototype["@@transducer/result"] = _xfBase.result;
    XUniqBy2.prototype["@@transducer/step"] = function(result, input2) {
      return this.set.add(this.f(input2)) ? this.xf["@@transducer/step"](result, input2) : result;
    };
    return XUniqBy2;
  }();
  var _xuniqBy = /* @__PURE__ */ _curry2(function _xuniqBy2(f, xf) {
    return new XUniqBy(f, xf);
  });
  const _xuniqBy$1 = _xuniqBy;
  var uniqBy = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable([], _xuniqBy$1, function(fn, list) {
    var set2 = new _Set$1();
    var result = [];
    var idx = 0;
    var appliedItem, item;
    while (idx < list.length) {
      item = list[idx];
      appliedItem = fn(item);
      if (set2.add(appliedItem)) {
        result.push(item);
      }
      idx += 1;
    }
    return result;
  }));
  const uniqBy$1 = uniqBy;
  var uniq = /* @__PURE__ */ uniqBy$1(identity$1);
  const uniq$1 = uniq;
  var intersection = /* @__PURE__ */ _curry2(function intersection2(list1, list2) {
    var lookupList, filteredList;
    if (list1.length > list2.length) {
      lookupList = list1;
      filteredList = list2;
    } else {
      lookupList = list2;
      filteredList = list1;
    }
    return uniq$1(_filter(flip$1(_includes)(lookupList), filteredList));
  });
  const intersection$1 = intersection;
  var intersperse = /* @__PURE__ */ _curry2(/* @__PURE__ */ _checkForMethod("intersperse", function intersperse2(separator, list) {
    var out = [];
    var idx = 0;
    var length2 = list.length;
    while (idx < length2) {
      if (idx === length2 - 1) {
        out.push(list[idx]);
      } else {
        out.push(list[idx], separator);
      }
      idx += 1;
    }
    return out;
  }));
  const intersperse$1 = intersperse;
  function _objectAssign(target) {
    if (target == null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    var output = Object(target);
    var idx = 1;
    var length2 = arguments.length;
    while (idx < length2) {
      var source = arguments[idx];
      if (source != null) {
        for (var nextKey in source) {
          if (_has(nextKey, source)) {
            output[nextKey] = source[nextKey];
          }
        }
      }
      idx += 1;
    }
    return output;
  }
  const _objectAssign$1 = typeof Object.assign === "function" ? Object.assign : _objectAssign;
  var objOf = /* @__PURE__ */ _curry2(function objOf2(key, val) {
    var obj = {};
    obj[key] = val;
    return obj;
  });
  const objOf$1 = objOf;
  var _stepCatArray = {
    "@@transducer/init": Array,
    "@@transducer/step": function(xs, x) {
      xs.push(x);
      return xs;
    },
    "@@transducer/result": _identity
  };
  var _stepCatString = {
    "@@transducer/init": String,
    "@@transducer/step": function(a, b) {
      return a + b;
    },
    "@@transducer/result": _identity
  };
  var _stepCatObject = {
    "@@transducer/init": Object,
    "@@transducer/step": function(result, input2) {
      return _objectAssign$1(result, _isArrayLike$1(input2) ? objOf$1(input2[0], input2[1]) : input2);
    },
    "@@transducer/result": _identity
  };
  function _stepCat(obj) {
    if (_isTransformer(obj)) {
      return obj;
    }
    if (_isArrayLike$1(obj)) {
      return _stepCatArray;
    }
    if (typeof obj === "string") {
      return _stepCatString;
    }
    if (typeof obj === "object") {
      return _stepCatObject;
    }
    throw new Error("Cannot create transformer for " + obj);
  }
  var into = /* @__PURE__ */ _curry3(function into2(acc, xf, list) {
    return _isTransformer(acc) ? _reduce(xf(acc), acc["@@transducer/init"](), list) : _reduce(xf(_stepCat(acc)), _clone(acc, [], [], false), list);
  });
  const into$1 = into;
  var invert = /* @__PURE__ */ _curry1(function invert2(obj) {
    var props2 = keys$1(obj);
    var len = props2.length;
    var idx = 0;
    var out = {};
    while (idx < len) {
      var key = props2[idx];
      var val = obj[key];
      var list = _has(val, out) ? out[val] : out[val] = [];
      list[list.length] = key;
      idx += 1;
    }
    return out;
  });
  const invert$1 = invert;
  var invertObj = /* @__PURE__ */ _curry1(function invertObj2(obj) {
    var props2 = keys$1(obj);
    var len = props2.length;
    var idx = 0;
    var out = {};
    while (idx < len) {
      var key = props2[idx];
      out[obj[key]] = key;
      idx += 1;
    }
    return out;
  });
  const invertObj$1 = invertObj;
  var invoker = /* @__PURE__ */ _curry2(function invoker2(arity, method) {
    return curryN$1(arity + 1, function() {
      var target = arguments[arity];
      if (target != null && _isFunction(target[method])) {
        return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
      }
      throw new TypeError(toString$1(target) + ' does not have a method named "' + method + '"');
    });
  });
  const invoker$1 = invoker;
  var is = /* @__PURE__ */ _curry2(function is2(Ctor, val) {
    return val instanceof Ctor || val != null && (val.constructor === Ctor || Ctor.name === "Object" && typeof val === "object");
  });
  const is$1 = is;
  var isEmpty = /* @__PURE__ */ _curry1(function isEmpty2(x) {
    return x != null && equals$1(x, empty$1(x));
  });
  const isEmpty$1 = isEmpty;
  var join = /* @__PURE__ */ invoker$1(1, "join");
  const join$1 = join;
  var juxt = /* @__PURE__ */ _curry1(function juxt2(fns) {
    return converge$1(function() {
      return Array.prototype.slice.call(arguments, 0);
    }, fns);
  });
  const juxt$1 = juxt;
  var keysIn = /* @__PURE__ */ _curry1(function keysIn2(obj) {
    var prop2;
    var ks = [];
    for (prop2 in obj) {
      ks[ks.length] = prop2;
    }
    return ks;
  });
  const keysIn$1 = keysIn;
  var lastIndexOf = /* @__PURE__ */ _curry2(function lastIndexOf2(target, xs) {
    if (typeof xs.lastIndexOf === "function" && !_isArray(xs)) {
      return xs.lastIndexOf(target);
    } else {
      var idx = xs.length - 1;
      while (idx >= 0) {
        if (equals$1(xs[idx], target)) {
          return idx;
        }
        idx -= 1;
      }
      return -1;
    }
  });
  const lastIndexOf$1 = lastIndexOf;
  function _isNumber(x) {
    return Object.prototype.toString.call(x) === "[object Number]";
  }
  var length = /* @__PURE__ */ _curry1(function length2(list) {
    return list != null && _isNumber(list.length) ? list.length : NaN;
  });
  const length$1 = length;
  var lens = /* @__PURE__ */ _curry2(function lens2(getter, setter) {
    return function(toFunctorFn) {
      return function(target) {
        return map$1(function(focus) {
          return setter(focus, target);
        }, toFunctorFn(getter(target)));
      };
    };
  });
  const lens$1 = lens;
  var update = /* @__PURE__ */ _curry3(function update2(idx, x, list) {
    return adjust$1(idx, always$1(x), list);
  });
  const update$1 = update;
  var lensIndex = /* @__PURE__ */ _curry1(function lensIndex2(n) {
    return lens$1(nth$1(n), update$1(n));
  });
  const lensIndex$1 = lensIndex;
  var paths = /* @__PURE__ */ _curry2(function paths2(pathsArray, obj) {
    return pathsArray.map(function(paths3) {
      var val = obj;
      var idx = 0;
      var p;
      while (idx < paths3.length) {
        if (val == null) {
          return;
        }
        p = paths3[idx];
        val = _isInteger(p) ? nth$1(p, val) : val[p];
        idx += 1;
      }
      return val;
    });
  });
  const paths$1 = paths;
  var path = /* @__PURE__ */ _curry2(function path2(pathAr, obj) {
    return paths$1([pathAr], obj)[0];
  });
  const path$1 = path;
  var lensPath = /* @__PURE__ */ _curry1(function lensPath2(p) {
    return lens$1(path$1(p), assocPath$1(p));
  });
  const lensPath$1 = lensPath;
  var lensProp = /* @__PURE__ */ _curry1(function lensProp2(k) {
    return lens$1(prop$1(k), assoc$1(k));
  });
  const lensProp$1 = lensProp;
  var lt = /* @__PURE__ */ _curry2(function lt2(a, b) {
    return a < b;
  });
  const lt$1 = lt;
  var lte = /* @__PURE__ */ _curry2(function lte2(a, b) {
    return a <= b;
  });
  const lte$1 = lte;
  var mapAccum = /* @__PURE__ */ _curry3(function mapAccum2(fn, acc, list) {
    var idx = 0;
    var len = list.length;
    var result = [];
    var tuple = [acc];
    while (idx < len) {
      tuple = fn(tuple[0], list[idx]);
      result[idx] = tuple[1];
      idx += 1;
    }
    return [tuple[0], result];
  });
  const mapAccum$1 = mapAccum;
  var mapAccumRight = /* @__PURE__ */ _curry3(function mapAccumRight2(fn, acc, list) {
    var idx = list.length - 1;
    var result = [];
    var tuple = [acc];
    while (idx >= 0) {
      tuple = fn(tuple[0], list[idx]);
      result[idx] = tuple[1];
      idx -= 1;
    }
    return [tuple[0], result];
  });
  const mapAccumRight$1 = mapAccumRight;
  var mapObjIndexed = /* @__PURE__ */ _curry2(function mapObjIndexed2(fn, obj) {
    return _reduce(function(acc, key) {
      acc[key] = fn(obj[key], key, obj);
      return acc;
    }, {}, keys$1(obj));
  });
  const mapObjIndexed$1 = mapObjIndexed;
  var match = /* @__PURE__ */ _curry2(function match2(rx, str) {
    return str.match(rx) || [];
  });
  const match$1 = match;
  var mathMod = /* @__PURE__ */ _curry2(function mathMod2(m, p) {
    if (!_isInteger(m)) {
      return NaN;
    }
    if (!_isInteger(p) || p < 1) {
      return NaN;
    }
    return (m % p + p) % p;
  });
  const mathMod$1 = mathMod;
  var maxBy = /* @__PURE__ */ _curry3(function maxBy2(f, a, b) {
    return f(b) > f(a) ? b : a;
  });
  const maxBy$1 = maxBy;
  var sum = /* @__PURE__ */ reduce$1(add$1, 0);
  const sum$1 = sum;
  var mean = /* @__PURE__ */ _curry1(function mean2(list) {
    return sum$1(list) / list.length;
  });
  const mean$1 = mean;
  var median = /* @__PURE__ */ _curry1(function median2(list) {
    var len = list.length;
    if (len === 0) {
      return NaN;
    }
    var width = 2 - len % 2;
    var idx = (len - width) / 2;
    return mean$1(Array.prototype.slice.call(list, 0).sort(function(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    }).slice(idx, idx + width));
  });
  const median$1 = median;
  var memoizeWith = /* @__PURE__ */ _curry2(function memoizeWith2(mFn, fn) {
    var cache = {};
    return _arity(fn.length, function() {
      var key = mFn.apply(this, arguments);
      if (!_has(key, cache)) {
        cache[key] = fn.apply(this, arguments);
      }
      return cache[key];
    });
  });
  const memoizeWith$1 = memoizeWith;
  var mergeAll = /* @__PURE__ */ _curry1(function mergeAll2(list) {
    return _objectAssign$1.apply(null, [{}].concat(list));
  });
  const mergeAll$1 = mergeAll;
  var mergeWithKey = /* @__PURE__ */ _curry3(function mergeWithKey2(fn, l, r) {
    var result = {};
    var k;
    for (k in l) {
      if (_has(k, l)) {
        result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
      }
    }
    for (k in r) {
      if (_has(k, r) && !_has(k, result)) {
        result[k] = r[k];
      }
    }
    return result;
  });
  const mergeWithKey$1 = mergeWithKey;
  var mergeDeepWithKey = /* @__PURE__ */ _curry3(function mergeDeepWithKey2(fn, lObj, rObj) {
    return mergeWithKey$1(function(k, lVal, rVal) {
      if (_isObject(lVal) && _isObject(rVal)) {
        return mergeDeepWithKey2(fn, lVal, rVal);
      } else {
        return fn(k, lVal, rVal);
      }
    }, lObj, rObj);
  });
  const mergeDeepWithKey$1 = mergeDeepWithKey;
  var mergeDeepLeft = /* @__PURE__ */ _curry2(function mergeDeepLeft2(lObj, rObj) {
    return mergeDeepWithKey$1(function(k, lVal, rVal) {
      return lVal;
    }, lObj, rObj);
  });
  const mergeDeepLeft$1 = mergeDeepLeft;
  var mergeDeepRight = /* @__PURE__ */ _curry2(function mergeDeepRight2(lObj, rObj) {
    return mergeDeepWithKey$1(function(k, lVal, rVal) {
      return rVal;
    }, lObj, rObj);
  });
  const mergeDeepRight$1 = mergeDeepRight;
  var mergeDeepWith = /* @__PURE__ */ _curry3(function mergeDeepWith2(fn, lObj, rObj) {
    return mergeDeepWithKey$1(function(k, lVal, rVal) {
      return fn(lVal, rVal);
    }, lObj, rObj);
  });
  const mergeDeepWith$1 = mergeDeepWith;
  var mergeLeft = /* @__PURE__ */ _curry2(function mergeLeft2(l, r) {
    return _objectAssign$1({}, r, l);
  });
  const mergeLeft$1 = mergeLeft;
  var mergeRight = /* @__PURE__ */ _curry2(function mergeRight2(l, r) {
    return _objectAssign$1({}, l, r);
  });
  const mergeRight$1 = mergeRight;
  var mergeWith = /* @__PURE__ */ _curry3(function mergeWith2(fn, l, r) {
    return mergeWithKey$1(function(_, _l, _r) {
      return fn(_l, _r);
    }, l, r);
  });
  const mergeWith$1 = mergeWith;
  var min = /* @__PURE__ */ _curry2(function min2(a, b) {
    return b < a ? b : a;
  });
  const min$1 = min;
  var minBy = /* @__PURE__ */ _curry3(function minBy2(f, a, b) {
    return f(b) < f(a) ? b : a;
  });
  const minBy$1 = minBy;
  function _modify(prop2, fn, obj) {
    if (_isInteger(prop2) && _isArray(obj)) {
      var arr = [].concat(obj);
      arr[prop2] = fn(arr[prop2]);
      return arr;
    }
    var result = {};
    for (var p in obj) {
      result[p] = obj[p];
    }
    result[prop2] = fn(result[prop2]);
    return result;
  }
  var modifyPath = /* @__PURE__ */ _curry3(function modifyPath2(path2, fn, object) {
    if (!_isObject(object) && !_isArray(object) || path2.length === 0) {
      return object;
    }
    var idx = path2[0];
    if (!_has(idx, object)) {
      return object;
    }
    if (path2.length === 1) {
      return _modify(idx, fn, object);
    }
    var val = modifyPath2(Array.prototype.slice.call(path2, 1), fn, object[idx]);
    if (val === object[idx]) {
      return object;
    }
    return _assoc(idx, val, object);
  });
  const modifyPath$1 = modifyPath;
  var modify = /* @__PURE__ */ _curry3(function modify2(prop2, fn, object) {
    return modifyPath$1([prop2], fn, object);
  });
  const modify$1 = modify;
  var modulo = /* @__PURE__ */ _curry2(function modulo2(a, b) {
    return a % b;
  });
  const modulo$1 = modulo;
  var move = /* @__PURE__ */ _curry3(function(from, to, list) {
    var length2 = list.length;
    var result = list.slice();
    var positiveFrom = from < 0 ? length2 + from : from;
    var positiveTo = to < 0 ? length2 + to : to;
    var item = result.splice(positiveFrom, 1);
    return positiveFrom < 0 || positiveFrom >= list.length || positiveTo < 0 || positiveTo >= list.length ? list : [].concat(result.slice(0, positiveTo)).concat(item).concat(result.slice(positiveTo, list.length));
  });
  const move$1 = move;
  var multiply = /* @__PURE__ */ _curry2(function multiply2(a, b) {
    return a * b;
  });
  const multiply$1 = multiply;
  const partialObject = /* @__PURE__ */ _curry2((f, o2) => (props2) => f.call(globalThis, mergeDeepRight$1(o2, props2)));
  var negate = /* @__PURE__ */ _curry1(function negate2(n) {
    return -n;
  });
  const negate$1 = negate;
  var none = /* @__PURE__ */ _curry2(function none2(fn, input2) {
    return all$1(_complement(fn), input2);
  });
  const none$1 = none;
  var nthArg = /* @__PURE__ */ _curry1(function nthArg2(n) {
    var arity = n < 0 ? 1 : n + 1;
    return curryN$1(arity, function() {
      return nth$1(n, arguments);
    });
  });
  const nthArg$1 = nthArg;
  var o = /* @__PURE__ */ _curry3(function o2(f, g, x) {
    return f(g(x));
  });
  const o$1 = o;
  function _of(x) {
    return [x];
  }
  var of = /* @__PURE__ */ _curry1(_of);
  const of$1 = of;
  var omit = /* @__PURE__ */ _curry2(function omit2(names, obj) {
    var result = {};
    var index2 = {};
    var idx = 0;
    var len = names.length;
    while (idx < len) {
      index2[names[idx]] = 1;
      idx += 1;
    }
    for (var prop2 in obj) {
      if (!index2.hasOwnProperty(prop2)) {
        result[prop2] = obj[prop2];
      }
    }
    return result;
  });
  const omit$1 = omit;
  var on = /* @__PURE__ */ _curryN(4, [], function on2(f, g, a, b) {
    return f(g(a), g(b));
  });
  const on$1 = on;
  var once = /* @__PURE__ */ _curry1(function once2(fn) {
    var called = false;
    var result;
    return _arity(fn.length, function() {
      if (called) {
        return result;
      }
      called = true;
      result = fn.apply(this, arguments);
      return result;
    });
  });
  const once$1 = once;
  function _assertPromise(name, p) {
    if (p == null || !_isFunction(p.then)) {
      throw new TypeError("`" + name + "` expected a Promise, received " + _toString(p, []));
    }
  }
  var otherwise = /* @__PURE__ */ _curry2(function otherwise2(f, p) {
    _assertPromise("otherwise", p);
    return p.then(null, f);
  });
  const otherwise$1 = otherwise;
  var Identity = function(x) {
    return {
      value: x,
      map: function(f) {
        return Identity(f(x));
      }
    };
  };
  var over = /* @__PURE__ */ _curry3(function over2(lens2, f, x) {
    return lens2(function(y) {
      return Identity(f(y));
    })(x).value;
  });
  const over$1 = over;
  var pair = /* @__PURE__ */ _curry2(function pair2(fst, snd) {
    return [fst, snd];
  });
  const pair$1 = pair;
  function _createPartialApplicator(concat2) {
    return _curry2(function(fn, args) {
      return _arity(Math.max(0, fn.length - args.length), function() {
        return fn.apply(this, concat2(args, arguments));
      });
    });
  }
  var partial = /* @__PURE__ */ _createPartialApplicator(_concat);
  const partial$1 = partial;
  var partialRight = /* @__PURE__ */ _createPartialApplicator(/* @__PURE__ */ flip$1(_concat));
  const partialRight$1 = partialRight;
  var partition = /* @__PURE__ */ juxt$1([filter$1, reject$1]);
  const partition$1 = partition;
  var pathEq = /* @__PURE__ */ _curry3(function pathEq2(_path, val, obj) {
    return equals$1(path$1(_path, obj), val);
  });
  const pathEq$1 = pathEq;
  var pathOr = /* @__PURE__ */ _curry3(function pathOr2(d, p, obj) {
    return defaultTo$1(d, path$1(p, obj));
  });
  const pathOr$1 = pathOr;
  var pathSatisfies = /* @__PURE__ */ _curry3(function pathSatisfies2(pred, propPath, obj) {
    return pred(path$1(propPath, obj));
  });
  const pathSatisfies$1 = pathSatisfies;
  var pick = /* @__PURE__ */ _curry2(function pick2(names, obj) {
    var result = {};
    var idx = 0;
    while (idx < names.length) {
      if (names[idx] in obj) {
        result[names[idx]] = obj[names[idx]];
      }
      idx += 1;
    }
    return result;
  });
  const pick$1 = pick;
  var pickAll = /* @__PURE__ */ _curry2(function pickAll2(names, obj) {
    var result = {};
    var idx = 0;
    var len = names.length;
    while (idx < len) {
      var name = names[idx];
      result[name] = obj[name];
      idx += 1;
    }
    return result;
  });
  const pickAll$1 = pickAll;
  var pickBy = /* @__PURE__ */ _curry2(function pickBy2(test2, obj) {
    var result = {};
    for (var prop2 in obj) {
      if (test2(obj[prop2], prop2, obj)) {
        result[prop2] = obj[prop2];
      }
    }
    return result;
  });
  const pickBy$1 = pickBy;
  var prepend = /* @__PURE__ */ _curry2(function prepend2(el, list) {
    return _concat([el], list);
  });
  const prepend$1 = prepend;
  var product = /* @__PURE__ */ reduce$1(multiply$1, 1);
  const product$1 = product;
  var useWith = /* @__PURE__ */ _curry2(function useWith2(fn, transformers) {
    return curryN$1(transformers.length, function() {
      var args = [];
      var idx = 0;
      while (idx < transformers.length) {
        args.push(transformers[idx].call(this, arguments[idx]));
        idx += 1;
      }
      return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, transformers.length)));
    });
  });
  const useWith$1 = useWith;
  var project = /* @__PURE__ */ useWith$1(_map, [pickAll$1, identity$1]);
  const project$1 = project;
  function _promap(f, g, profunctor) {
    return function(x) {
      return g(profunctor(f(x)));
    };
  }
  var XPromap = /* @__PURE__ */ function() {
    function XPromap2(f, g, xf) {
      this.xf = xf;
      this.f = f;
      this.g = g;
    }
    XPromap2.prototype["@@transducer/init"] = _xfBase.init;
    XPromap2.prototype["@@transducer/result"] = _xfBase.result;
    XPromap2.prototype["@@transducer/step"] = function(result, input2) {
      return this.xf["@@transducer/step"](result, _promap(this.f, this.g, input2));
    };
    return XPromap2;
  }();
  var _xpromap = /* @__PURE__ */ _curry3(function _xpromap2(f, g, xf) {
    return new XPromap(f, g, xf);
  });
  const _xpromap$1 = _xpromap;
  var promap = /* @__PURE__ */ _curry3(/* @__PURE__ */ _dispatchable(["fantasy-land/promap", "promap"], _xpromap$1, _promap));
  const promap$1 = promap;
  var propEq = /* @__PURE__ */ _curry3(function propEq2(name, val, obj) {
    return equals$1(val, prop$1(name, obj));
  });
  const propEq$1 = propEq;
  var propIs = /* @__PURE__ */ _curry3(function propIs2(type2, name, obj) {
    return is$1(type2, prop$1(name, obj));
  });
  const propIs$1 = propIs;
  var propOr = /* @__PURE__ */ _curry3(function propOr2(val, p, obj) {
    return defaultTo$1(val, prop$1(p, obj));
  });
  const propOr$1 = propOr;
  var propSatisfies = /* @__PURE__ */ _curry3(function propSatisfies2(pred, name, obj) {
    return pred(prop$1(name, obj));
  });
  const propSatisfies$1 = propSatisfies;
  var props = /* @__PURE__ */ _curry2(function props2(ps, obj) {
    return ps.map(function(p) {
      return path$1([p], obj);
    });
  });
  const props$1 = props;
  var range = /* @__PURE__ */ _curry2(function range2(from, to) {
    if (!(_isNumber(from) && _isNumber(to))) {
      throw new TypeError("Both arguments to range must be numbers");
    }
    var result = [];
    var n = from;
    while (n < to) {
      result.push(n);
      n += 1;
    }
    return result;
  });
  const range$1 = range;
  var reduceRight = /* @__PURE__ */ _curry3(function reduceRight2(fn, acc, list) {
    var idx = list.length - 1;
    while (idx >= 0) {
      acc = fn(list[idx], acc);
      if (acc && acc["@@transducer/reduced"]) {
        acc = acc["@@transducer/value"];
        break;
      }
      idx -= 1;
    }
    return acc;
  });
  const reduceRight$1 = reduceRight;
  var reduceWhile = /* @__PURE__ */ _curryN(4, [], function _reduceWhile(pred, fn, a, list) {
    return _reduce(function(acc, x) {
      return pred(acc, x) ? fn(acc, x) : _reduced(acc);
    }, a, list);
  });
  const reduceWhile$1 = reduceWhile;
  var reduced = /* @__PURE__ */ _curry1(_reduced);
  const reduced$1 = reduced;
  var times = /* @__PURE__ */ _curry2(function times2(fn, n) {
    var len = Number(n);
    var idx = 0;
    var list;
    if (len < 0 || isNaN(len)) {
      throw new RangeError("n must be a non-negative number");
    }
    list = new Array(len);
    while (idx < len) {
      list[idx] = fn(idx);
      idx += 1;
    }
    return list;
  });
  const times$1 = times;
  var repeat = /* @__PURE__ */ _curry2(function repeat2(value, n) {
    return times$1(always$1(value), n);
  });
  const repeat$1 = repeat;
  var replace = /* @__PURE__ */ _curry3(function replace2(regex, replacement, str) {
    return str.replace(regex, replacement);
  });
  const replace$1 = replace;
  var scan = /* @__PURE__ */ _curry3(function scan2(fn, acc, list) {
    var idx = 0;
    var len = list.length;
    var result = [acc];
    while (idx < len) {
      acc = fn(acc, list[idx]);
      result[idx + 1] = acc;
      idx += 1;
    }
    return result;
  });
  const scan$1 = scan;
  var sequence = /* @__PURE__ */ _curry2(function sequence2(of2, traversable) {
    return typeof traversable.sequence === "function" ? traversable.sequence(of2) : reduceRight$1(function(x, acc) {
      return ap$1(map$1(prepend$1, x), acc);
    }, of2([]), traversable);
  });
  const sequence$1 = sequence;
  var set = /* @__PURE__ */ _curry3(function set2(lens2, v, x) {
    return over$1(lens2, always$1(v), x);
  });
  const set$1 = set;
  var sort = /* @__PURE__ */ _curry2(function sort2(comparator2, list) {
    return Array.prototype.slice.call(list, 0).sort(comparator2);
  });
  const sort$1 = sort;
  var sortBy = /* @__PURE__ */ _curry2(function sortBy2(fn, list) {
    return Array.prototype.slice.call(list, 0).sort(function(a, b) {
      var aa = fn(a);
      var bb = fn(b);
      return aa < bb ? -1 : aa > bb ? 1 : 0;
    });
  });
  const sortBy$1 = sortBy;
  var sortWith = /* @__PURE__ */ _curry2(function sortWith2(fns, list) {
    return Array.prototype.slice.call(list, 0).sort(function(a, b) {
      var result = 0;
      var i = 0;
      while (result === 0 && i < fns.length) {
        result = fns[i](a, b);
        i += 1;
      }
      return result;
    });
  });
  const sortWith$1 = sortWith;
  var split = /* @__PURE__ */ invoker$1(1, "split");
  const split$1 = split;
  var splitAt = /* @__PURE__ */ _curry2(function splitAt2(index2, array) {
    return [slice$1(0, index2, array), slice$1(index2, length$1(array), array)];
  });
  const splitAt$1 = splitAt;
  var splitEvery = /* @__PURE__ */ _curry2(function splitEvery2(n, list) {
    if (n <= 0) {
      throw new Error("First argument to splitEvery must be a positive integer");
    }
    var result = [];
    var idx = 0;
    while (idx < list.length) {
      result.push(slice$1(idx, idx += n, list));
    }
    return result;
  });
  const splitEvery$1 = splitEvery;
  var splitWhen = /* @__PURE__ */ _curry2(function splitWhen2(pred, list) {
    var idx = 0;
    var len = list.length;
    var prefix = [];
    while (idx < len && !pred(list[idx])) {
      prefix.push(list[idx]);
      idx += 1;
    }
    return [prefix, Array.prototype.slice.call(list, idx)];
  });
  const splitWhen$1 = splitWhen;
  var splitWhenever = /* @__PURE__ */ _curryN(2, [], function splitWhenever2(pred, list) {
    var acc = [];
    var curr = [];
    for (var i = 0; i < list.length; i = i + 1) {
      if (!pred(list[i])) {
        curr.push(list[i]);
      }
      if ((i < list.length - 1 && pred(list[i + 1]) || i === list.length - 1) && curr.length > 0) {
        acc.push(curr);
        curr = [];
      }
    }
    return acc;
  });
  const splitWhenever$1 = splitWhenever;
  var startsWith = /* @__PURE__ */ _curry2(function(prefix, list) {
    return equals$1(take$1(prefix.length, list), prefix);
  });
  const startsWith$1 = startsWith;
  var subtract = /* @__PURE__ */ _curry2(function subtract2(a, b) {
    return Number(a) - Number(b);
  });
  const subtract$1 = subtract;
  var symmetricDifference = /* @__PURE__ */ _curry2(function symmetricDifference2(list1, list2) {
    return concat$1(difference$1(list1, list2), difference$1(list2, list1));
  });
  const symmetricDifference$1 = symmetricDifference;
  var symmetricDifferenceWith = /* @__PURE__ */ _curry3(function symmetricDifferenceWith2(pred, list1, list2) {
    return concat$1(differenceWith$1(pred, list1, list2), differenceWith$1(pred, list2, list1));
  });
  const symmetricDifferenceWith$1 = symmetricDifferenceWith;
  var takeLastWhile = /* @__PURE__ */ _curry2(function takeLastWhile2(fn, xs) {
    var idx = xs.length - 1;
    while (idx >= 0 && fn(xs[idx])) {
      idx -= 1;
    }
    return slice$1(idx + 1, Infinity, xs);
  });
  const takeLastWhile$1 = takeLastWhile;
  var XTakeWhile = /* @__PURE__ */ function() {
    function XTakeWhile2(f, xf) {
      this.xf = xf;
      this.f = f;
    }
    XTakeWhile2.prototype["@@transducer/init"] = _xfBase.init;
    XTakeWhile2.prototype["@@transducer/result"] = _xfBase.result;
    XTakeWhile2.prototype["@@transducer/step"] = function(result, input2) {
      return this.f(input2) ? this.xf["@@transducer/step"](result, input2) : _reduced(result);
    };
    return XTakeWhile2;
  }();
  var _xtakeWhile = /* @__PURE__ */ _curry2(function _xtakeWhile2(f, xf) {
    return new XTakeWhile(f, xf);
  });
  const _xtakeWhile$1 = _xtakeWhile;
  var takeWhile = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable(["takeWhile"], _xtakeWhile$1, function takeWhile2(fn, xs) {
    var idx = 0;
    var len = xs.length;
    while (idx < len && fn(xs[idx])) {
      idx += 1;
    }
    return slice$1(0, idx, xs);
  }));
  const takeWhile$1 = takeWhile;
  var XTap = /* @__PURE__ */ function() {
    function XTap2(f, xf) {
      this.xf = xf;
      this.f = f;
    }
    XTap2.prototype["@@transducer/init"] = _xfBase.init;
    XTap2.prototype["@@transducer/result"] = _xfBase.result;
    XTap2.prototype["@@transducer/step"] = function(result, input2) {
      this.f(input2);
      return this.xf["@@transducer/step"](result, input2);
    };
    return XTap2;
  }();
  var _xtap = /* @__PURE__ */ _curry2(function _xtap2(f, xf) {
    return new XTap(f, xf);
  });
  const _xtap$1 = _xtap;
  var tap = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable([], _xtap$1, function tap2(fn, x) {
    fn(x);
    return x;
  }));
  const tap$1 = tap;
  function _isRegExp(x) {
    return Object.prototype.toString.call(x) === "[object RegExp]";
  }
  var test = /* @__PURE__ */ _curry2(function test2(pattern, str) {
    if (!_isRegExp(pattern)) {
      throw new TypeError("\u2018test\u2019 requires a value of type RegExp as its first argument; received " + toString$1(pattern));
    }
    return _cloneRegExp(pattern).test(str);
  });
  const test$1 = test;
  var andThen = /* @__PURE__ */ _curry2(function andThen2(f, p) {
    _assertPromise("andThen", p);
    return p.then(f);
  });
  const andThen$1 = andThen;
  var toLower = /* @__PURE__ */ invoker$1(0, "toLowerCase");
  const toLower$1 = toLower;
  var toPairs = /* @__PURE__ */ _curry1(function toPairs2(obj) {
    var pairs = [];
    for (var prop2 in obj) {
      if (_has(prop2, obj)) {
        pairs[pairs.length] = [prop2, obj[prop2]];
      }
    }
    return pairs;
  });
  const toPairs$1 = toPairs;
  var toPairsIn = /* @__PURE__ */ _curry1(function toPairsIn2(obj) {
    var pairs = [];
    for (var prop2 in obj) {
      pairs[pairs.length] = [prop2, obj[prop2]];
    }
    return pairs;
  });
  const toPairsIn$1 = toPairsIn;
  var toUpper = /* @__PURE__ */ invoker$1(0, "toUpperCase");
  const toUpper$1 = toUpper;
  var transduce = /* @__PURE__ */ curryN$1(4, function transduce2(xf, fn, acc, list) {
    return _reduce(xf(typeof fn === "function" ? _xwrap(fn) : fn), acc, list);
  });
  const transduce$1 = transduce;
  var transpose = /* @__PURE__ */ _curry1(function transpose2(outerlist) {
    var i = 0;
    var result = [];
    while (i < outerlist.length) {
      var innerlist = outerlist[i];
      var j = 0;
      while (j < innerlist.length) {
        if (typeof result[j] === "undefined") {
          result[j] = [];
        }
        result[j].push(innerlist[j]);
        j += 1;
      }
      i += 1;
    }
    return result;
  });
  const transpose$1 = transpose;
  var traverse = /* @__PURE__ */ _curry3(function traverse2(of2, f, traversable) {
    return typeof traversable["fantasy-land/traverse"] === "function" ? traversable["fantasy-land/traverse"](f, of2) : typeof traversable.traverse === "function" ? traversable.traverse(f, of2) : sequence$1(of2, map$1(f, traversable));
  });
  const traverse$1 = traverse;
  var ws = "	\n\v\f\r \xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
  var zeroWidth = "\u200B";
  var hasProtoTrim = typeof String.prototype.trim === "function";
  var trim = !hasProtoTrim || /* @__PURE__ */ ws.trim() || !/* @__PURE__ */ zeroWidth.trim() ? /* @__PURE__ */ _curry1(function trim2(str) {
    var beginRx = new RegExp("^[" + ws + "][" + ws + "]*");
    var endRx = new RegExp("[" + ws + "][" + ws + "]*$");
    return str.replace(beginRx, "").replace(endRx, "");
  }) : /* @__PURE__ */ _curry1(function trim2(str) {
    return str.trim();
  });
  const trim$1 = trim;
  var tryCatch = /* @__PURE__ */ _curry2(function _tryCatch(tryer, catcher) {
    return _arity(tryer.length, function() {
      try {
        return tryer.apply(this, arguments);
      } catch (e) {
        return catcher.apply(this, _concat([e], arguments));
      }
    });
  });
  const tryCatch$1 = tryCatch;
  var unapply = /* @__PURE__ */ _curry1(function unapply2(fn) {
    return function() {
      return fn(Array.prototype.slice.call(arguments, 0));
    };
  });
  const unapply$1 = unapply;
  var unary = /* @__PURE__ */ _curry1(function unary2(fn) {
    return nAry$1(1, fn);
  });
  const unary$1 = unary;
  var uncurryN = /* @__PURE__ */ _curry2(function uncurryN2(depth, fn) {
    return curryN$1(depth, function() {
      var currentDepth = 1;
      var value = fn;
      var idx = 0;
      var endIdx;
      while (currentDepth <= depth && typeof value === "function") {
        endIdx = currentDepth === depth ? arguments.length : idx + value.length;
        value = value.apply(this, Array.prototype.slice.call(arguments, idx, endIdx));
        currentDepth += 1;
        idx = endIdx;
      }
      return value;
    });
  });
  const uncurryN$1 = uncurryN;
  var unfold = /* @__PURE__ */ _curry2(function unfold2(fn, seed) {
    var pair2 = fn(seed);
    var result = [];
    while (pair2 && pair2.length) {
      result[result.length] = pair2[0];
      pair2 = fn(pair2[1]);
    }
    return result;
  });
  const unfold$1 = unfold;
  var union = /* @__PURE__ */ _curry2(/* @__PURE__ */ compose(uniq$1, _concat));
  const union$1 = union;
  var XUniqWith = /* @__PURE__ */ function() {
    function XUniqWith2(pred, xf) {
      this.xf = xf;
      this.pred = pred;
      this.items = [];
    }
    XUniqWith2.prototype["@@transducer/init"] = _xfBase.init;
    XUniqWith2.prototype["@@transducer/result"] = _xfBase.result;
    XUniqWith2.prototype["@@transducer/step"] = function(result, input2) {
      if (_includesWith(this.pred, input2, this.items)) {
        return result;
      } else {
        this.items.push(input2);
        return this.xf["@@transducer/step"](result, input2);
      }
    };
    return XUniqWith2;
  }();
  var _xuniqWith = /* @__PURE__ */ _curry2(function _xuniqWith2(pred, xf) {
    return new XUniqWith(pred, xf);
  });
  const _xuniqWith$1 = _xuniqWith;
  var uniqWith = /* @__PURE__ */ _curry2(/* @__PURE__ */ _dispatchable([], _xuniqWith$1, function(pred, list) {
    var idx = 0;
    var len = list.length;
    var result = [];
    var item;
    while (idx < len) {
      item = list[idx];
      if (!_includesWith(pred, item, result)) {
        result[result.length] = item;
      }
      idx += 1;
    }
    return result;
  }));
  const uniqWith$1 = uniqWith;
  var unionWith = /* @__PURE__ */ _curry3(function unionWith2(pred, list1, list2) {
    return uniqWith$1(pred, _concat(list1, list2));
  });
  const unionWith$1 = unionWith;
  var unless = /* @__PURE__ */ _curry3(function unless2(pred, whenFalseFn, x) {
    return pred(x) ? x : whenFalseFn(x);
  });
  const unless$1 = unless;
  var unnest = /* @__PURE__ */ chain$1(_identity);
  const unnest$1 = unnest;
  var until = /* @__PURE__ */ _curry3(function until2(pred, fn, init2) {
    var val = init2;
    while (!pred(val)) {
      val = fn(val);
    }
    return val;
  });
  const until$1 = until;
  var unwind = /* @__PURE__ */ _curry2(function(key, object) {
    if (!(key in object && _isArray(object[key]))) {
      return [object];
    }
    return _map(function(item) {
      return _assoc(key, item, object);
    }, object[key]);
  });
  const unwind$1 = unwind;
  var valuesIn = /* @__PURE__ */ _curry1(function valuesIn2(obj) {
    var prop2;
    var vs = [];
    for (prop2 in obj) {
      vs[vs.length] = obj[prop2];
    }
    return vs;
  });
  const valuesIn$1 = valuesIn;
  var Const = function(x) {
    return {
      value: x,
      "fantasy-land/map": function() {
        return this;
      }
    };
  };
  var view = /* @__PURE__ */ _curry2(function view2(lens2, x) {
    return lens2(Const)(x).value;
  });
  const view$1 = view;
  var when = /* @__PURE__ */ _curry3(function when2(pred, whenTrueFn, x) {
    return pred(x) ? whenTrueFn(x) : x;
  });
  const when$1 = when;
  var where = /* @__PURE__ */ _curry2(function where2(spec, testObj) {
    for (var prop2 in spec) {
      if (_has(prop2, spec) && !spec[prop2](testObj[prop2])) {
        return false;
      }
    }
    return true;
  });
  const where$1 = where;
  var whereAny = /* @__PURE__ */ _curry2(function whereAny2(spec, testObj) {
    for (var prop2 in spec) {
      if (_has(prop2, spec) && spec[prop2](testObj[prop2])) {
        return true;
      }
    }
    return false;
  });
  const whereAny$1 = whereAny;
  var whereEq = /* @__PURE__ */ _curry2(function whereEq2(spec, testObj) {
    return where$1(map$1(equals$1, spec), testObj);
  });
  const whereEq$1 = whereEq;
  var without = /* @__PURE__ */ _curry2(function(xs, list) {
    return reject$1(flip$1(_includes)(xs), list);
  });
  const without$1 = without;
  var xor = /* @__PURE__ */ _curry2(function xor2(a, b) {
    return Boolean(!a ^ !b);
  });
  const xor$1 = xor;
  var xprod = /* @__PURE__ */ _curry2(function xprod2(a, b) {
    var idx = 0;
    var ilen = a.length;
    var j;
    var jlen = b.length;
    var result = [];
    while (idx < ilen) {
      j = 0;
      while (j < jlen) {
        result[result.length] = [a[idx], b[j]];
        j += 1;
      }
      idx += 1;
    }
    return result;
  });
  const xprod$1 = xprod;
  var zip = /* @__PURE__ */ _curry2(function zip2(a, b) {
    var rv = [];
    var idx = 0;
    var len = Math.min(a.length, b.length);
    while (idx < len) {
      rv[idx] = [a[idx], b[idx]];
      idx += 1;
    }
    return rv;
  });
  const zip$1 = zip;
  var zipObj = /* @__PURE__ */ _curry2(function zipObj2(keys2, values2) {
    var idx = 0;
    var len = Math.min(keys2.length, values2.length);
    var out = {};
    while (idx < len) {
      out[keys2[idx]] = values2[idx];
      idx += 1;
    }
    return out;
  });
  const zipObj$1 = zipObj;
  var zipWith = /* @__PURE__ */ _curry3(function zipWith2(fn, a, b) {
    var rv = [];
    var idx = 0;
    var len = Math.min(a.length, b.length);
    while (idx < len) {
      rv[idx] = fn(a[idx], b[idx]);
      idx += 1;
    }
    return rv;
  });
  const zipWith$1 = zipWith;
  var thunkify = /* @__PURE__ */ _curry1(function thunkify2(fn) {
    return curryN$1(fn.length, function createThunk() {
      var fnArgs = arguments;
      return function invokeThunk() {
        return fn.apply(this, fnArgs);
      };
    });
  });
  const thunkify$1 = thunkify;
  const R = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    F: F$1,
    T: T$1,
    __,
    add: add$1,
    addIndex: addIndex$1,
    adjust: adjust$1,
    all: all$1,
    allPass: allPass$1,
    always: always$1,
    and: and$1,
    any: any$1,
    anyPass: anyPass$1,
    ap: ap$1,
    aperture: aperture$1,
    append: append$1,
    apply: apply$1,
    applySpec: applySpec$1,
    applyTo: applyTo$1,
    ascend: ascend$1,
    assoc: assoc$1,
    assocPath: assocPath$1,
    binary: binary$1,
    bind: bind$1,
    both: both$1,
    call: call$1,
    chain: chain$1,
    clamp: clamp$1,
    clone: clone$1,
    collectBy: collectBy$1,
    comparator: comparator$1,
    complement: complement$1,
    compose,
    composeWith: composeWith$1,
    concat: concat$1,
    cond: cond$1,
    construct: construct$1,
    constructN: constructN$1,
    converge: converge$1,
    count: count$1,
    countBy: countBy$1,
    curry: curry$1,
    curryN: curryN$1,
    dec: dec$1,
    defaultTo: defaultTo$1,
    descend: descend$1,
    difference: difference$1,
    differenceWith: differenceWith$1,
    dissoc: dissoc$1,
    dissocPath: dissocPath$1,
    divide: divide$1,
    drop: drop$1,
    dropLast: dropLast$1,
    dropLastWhile: dropLastWhile$1,
    dropRepeats: dropRepeats$1,
    dropRepeatsWith: dropRepeatsWith$1,
    dropWhile: dropWhile$1,
    either: either$1,
    empty: empty$1,
    endsWith: endsWith$1,
    eqBy: eqBy$1,
    eqProps: eqProps$1,
    equals: equals$1,
    evolve: evolve$1,
    filter: filter$1,
    find: find$1,
    findIndex: findIndex$1,
    findLast: findLast$1,
    findLastIndex: findLastIndex$1,
    flatten: flatten$1,
    flip: flip$1,
    forEach: forEach$1,
    forEachObjIndexed: forEachObjIndexed$1,
    fromPairs: fromPairs$1,
    groupBy: groupBy$1,
    groupWith: groupWith$1,
    gt: gt$1,
    gte: gte$1,
    has: has$1,
    hasIn: hasIn$1,
    hasPath: hasPath$1,
    head: head$1,
    identical: identical$1,
    identity: identity$1,
    ifElse: ifElse$1,
    inc: inc$1,
    includes: includes$1,
    indexBy: indexBy$1,
    indexOf: indexOf$1,
    init: init$1,
    innerJoin: innerJoin$1,
    insert: insert$1,
    insertAll: insertAll$1,
    intersection: intersection$1,
    intersperse: intersperse$1,
    into: into$1,
    invert: invert$1,
    invertObj: invertObj$1,
    invoker: invoker$1,
    is: is$1,
    isEmpty: isEmpty$1,
    isNil: isNil$1,
    join: join$1,
    juxt: juxt$1,
    keys: keys$1,
    keysIn: keysIn$1,
    last: last$1,
    lastIndexOf: lastIndexOf$1,
    length: length$1,
    lens: lens$1,
    lensIndex: lensIndex$1,
    lensPath: lensPath$1,
    lensProp: lensProp$1,
    lift: lift$1,
    liftN: liftN$1,
    lt: lt$1,
    lte: lte$1,
    map: map$1,
    mapAccum: mapAccum$1,
    mapAccumRight: mapAccumRight$1,
    mapObjIndexed: mapObjIndexed$1,
    match: match$1,
    mathMod: mathMod$1,
    max: max$1,
    maxBy: maxBy$1,
    mean: mean$1,
    median: median$1,
    memoizeWith: memoizeWith$1,
    mergeAll: mergeAll$1,
    mergeDeepLeft: mergeDeepLeft$1,
    mergeDeepRight: mergeDeepRight$1,
    mergeDeepWith: mergeDeepWith$1,
    mergeDeepWithKey: mergeDeepWithKey$1,
    mergeLeft: mergeLeft$1,
    mergeRight: mergeRight$1,
    mergeWith: mergeWith$1,
    mergeWithKey: mergeWithKey$1,
    min: min$1,
    minBy: minBy$1,
    modify: modify$1,
    modifyPath: modifyPath$1,
    modulo: modulo$1,
    move: move$1,
    multiply: multiply$1,
    nAry: nAry$1,
    partialObject,
    negate: negate$1,
    none: none$1,
    not: not$1,
    nth: nth$1,
    nthArg: nthArg$1,
    o: o$1,
    objOf: objOf$1,
    of: of$1,
    omit: omit$1,
    on: on$1,
    once: once$1,
    or: or$1,
    otherwise: otherwise$1,
    over: over$1,
    pair: pair$1,
    partial: partial$1,
    partialRight: partialRight$1,
    partition: partition$1,
    path: path$1,
    paths: paths$1,
    pathEq: pathEq$1,
    pathOr: pathOr$1,
    pathSatisfies: pathSatisfies$1,
    pick: pick$1,
    pickAll: pickAll$1,
    pickBy: pickBy$1,
    pipe,
    pipeWith: pipeWith$1,
    pluck: pluck$1,
    prepend: prepend$1,
    product: product$1,
    project: project$1,
    promap: promap$1,
    prop: prop$1,
    propEq: propEq$1,
    propIs: propIs$1,
    propOr: propOr$1,
    propSatisfies: propSatisfies$1,
    props: props$1,
    range: range$1,
    reduce: reduce$1,
    reduceBy: reduceBy$1,
    reduceRight: reduceRight$1,
    reduceWhile: reduceWhile$1,
    reduced: reduced$1,
    reject: reject$1,
    remove: remove$1,
    repeat: repeat$1,
    replace: replace$1,
    reverse: reverse$1,
    scan: scan$1,
    sequence: sequence$1,
    set: set$1,
    slice: slice$1,
    sort: sort$1,
    sortBy: sortBy$1,
    sortWith: sortWith$1,
    split: split$1,
    splitAt: splitAt$1,
    splitEvery: splitEvery$1,
    splitWhen: splitWhen$1,
    splitWhenever: splitWhenever$1,
    startsWith: startsWith$1,
    subtract: subtract$1,
    sum: sum$1,
    symmetricDifference: symmetricDifference$1,
    symmetricDifferenceWith: symmetricDifferenceWith$1,
    tail: tail$1,
    take: take$1,
    takeLast: takeLast$1,
    takeLastWhile: takeLastWhile$1,
    takeWhile: takeWhile$1,
    tap: tap$1,
    test: test$1,
    andThen: andThen$1,
    times: times$1,
    toLower: toLower$1,
    toPairs: toPairs$1,
    toPairsIn: toPairsIn$1,
    toString: toString$1,
    toUpper: toUpper$1,
    transduce: transduce$1,
    transpose: transpose$1,
    traverse: traverse$1,
    trim: trim$1,
    tryCatch: tryCatch$1,
    type: type$1,
    unapply: unapply$1,
    unary: unary$1,
    uncurryN: uncurryN$1,
    unfold: unfold$1,
    union: union$1,
    unionWith: unionWith$1,
    uniq: uniq$1,
    uniqBy: uniqBy$1,
    uniqWith: uniqWith$1,
    unless: unless$1,
    unnest: unnest$1,
    until: until$1,
    unwind: unwind$1,
    update: update$1,
    useWith: useWith$1,
    values: values$1,
    valuesIn: valuesIn$1,
    view: view$1,
    when: when$1,
    where: where$1,
    whereAny: whereAny$1,
    whereEq: whereEq$1,
    without: without$1,
    xor: xor$1,
    xprod: xprod$1,
    zip: zip$1,
    zipObj: zipObj$1,
    zipWith: zipWith$1,
    thunkify: thunkify$1
  }, Symbol.toStringTag, { value: "Module" }));
  async function getFunc(funcStr = "", name = "zxx") {
    const sc = document.createElement("script");
    const varName = `${FUNC_PREFIX}_${name}`;
    sc.innerHTML = `window.${varName} = ${funcStr};`;
    document.body.append(sc);
    while (true) {
      const func = window[varName];
      if (func) {
        func.destroy = () => {
          window[varName] = void 0;
          sc.remove();
        };
        return func;
      }
      await delay(100);
    }
  }
  async function _eval(t, funcStr, data) {
    const func = await getFunc(funcStr, "eval");
    const re = await func({ R, delay }, data);
    func.destroy();
    return re;
  }
  const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    getFunc,
    eval: _eval
  }, Symbol.toStringTag, { value: "Module" }));
  function input(dom, v) {
    dom.value = v;
    dom.dispatchEvent(new InputEvent("input", { inputType: "insert", data: "" }));
  }
  async function click(dom, isReadyFuncStr) {
    dom.click();
    if (!isReadyFuncStr) {
      return;
    }
    const isReadyFunc = await getFunc(isReadyFuncStr);
    let index2 = 0;
    const MAX = 3;
    while (index2 < MAX) {
      await delay(1e3);
      const isReady = await isReadyFunc(window);
      if (isReady) {
        return;
      }
      index2 += 1;
    }
  }
  const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    input,
    click
  }, Symbol.toStringTag, { value: "Module" }));
  const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null
  }, Symbol.toStringTag, { value: "Module" }));
  const modules = Object.assign({ "./action/event.ts": __vite_glob_0_0, "./action/func.ts": __vite_glob_0_1, "./action/query.ts": __vite_glob_0_2 });
  const actionMap = Object.keys(modules).reduce((re, key) => {
    const _module = modules[key];
    return { ...re, ..._module };
  }, {});
  async function execPayload(payloadList) {
    let t = void 0;
    if (!Array.isArray(payloadList)) {
      payloadList = [payloadList];
    }
    for (const payload of payloadList) {
      const { action, params } = payload;
      if (actionMap[action]) {
        t = await actionMap[action](t, ...params);
      }
    }
    return t;
  }
  const VITE_EXPORT_NAME = "__socket__";
  let socket = window[VITE_EXPORT_NAME];
  let webSocketId = "";
  function sendMessage(message) {
    return new Promise((resolve, reject2) => {
      if (socket) {
        if (message.type === MESSAGE_TYPE.data) {
          socket.send(JSON.stringify(message));
          resolve(message);
          return;
        }
        if (message.type === MESSAGE_TYPE.init || message.type === MESSAGE_TYPE.payload) {
          socket.send(JSON.stringify(message));
          const li = (evt) => {
            const data = JSON.parse(evt.data);
            if ((data == null ? void 0 : data.messageId) === message.messageId) {
              resolve(data);
              if (socket) {
                socket == null ? void 0 : socket.removeEventListener("message", li);
              }
            }
          };
          socket.addEventListener("message", li);
          return;
        }
        return;
      }
      reject2("need init socket");
    });
  }
  async function initMessage() {
    const webSocketId2 = new URL(location.href).searchParams.get("webSocketId") || window.name;
    const data = await sendMessage({
      type: MESSAGE_TYPE.init,
      content: { url: location.href },
      messageId: new Date().valueOf().toString(),
      webSocketId: webSocketId2
    });
    if (data) {
      const resWebSocketId = data.webSocketId;
      console.log("runtime init success", "res", resWebSocketId, "brow", webSocketId2);
    } else {
      throw Error("runtime init fail");
    }
  }
  async function onPayloadMessage() {
    if (socket) {
      const li = async (evt) => {
        const message = JSON.parse(evt.data);
        if (message.type === MESSAGE_TYPE.payload) {
          const data = await execPayload(message.data);
          sendMessage({ type: MESSAGE_TYPE.data, data, messageId: message.messageId, webSocketId });
        }
      };
      socket.addEventListener("message", li);
    } else {
      throw Error("need init socket");
    }
  }
  async function initSocket() {
    if (!socket) {
      const host = location.host;
      socket = new WebSocket(`wss://${host}/spider-runtime`);
      window[VITE_EXPORT_NAME] = socket;
      socket.addEventListener("open", async () => {
        await initMessage();
        onPayloadMessage();
      });
      socket.addEventListener("close", () => {
        window[VITE_EXPORT_NAME] = void 0;
        console.log(new Date().toLocaleString(), "socket close");
      });
      return;
    }
    await initMessage();
  }
  setTimeout(() => {
    initSocket();
  }, 1e3);
  const index = {
    version: "0.0.1"
  };
  return index;
}();
