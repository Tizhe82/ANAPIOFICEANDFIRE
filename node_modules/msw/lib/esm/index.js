export { i as context } from './index-deps.js';
import { c as commonjsGlobal, p as parse_1, l as lib$4, a as lib$6, j as jsonParse } from './fetch-deps.js';
import { _ as __awaiter$3, d as devUtils, p as parseBody, g as getPublicUrlFromRequest, N as NetworkError, l as lib$5, a as getCleanUrl } from './RequestHandler-deps.js';
export { R as RequestHandler, f as compose, c as createResponseComposition, e as defaultContext, b as defaultResponse, m as matchRequestUrl, r as response } from './RequestHandler-deps.js';
import { i as isStringEqual, R as RestHandler } from './rest-deps.js';
export { a as RESTMethods, R as RestHandler, r as rest, b as restContext } from './rest-deps.js';
import { t as tryCatch, p as parseGraphQLRequest, G as GraphQLHandler } from './graphql-deps.js';
export { G as GraphQLHandler, g as graphql, a as graphqlContext } from './graphql-deps.js';
import { m as mergeRight } from './errors-deps.js';
import require$$3 from 'debug';
import './xml-deps.js';

var lib$3 = {};

var StrictEventEmitter$1 = {};

var events = {exports: {}};

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  };

var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}
events.exports = EventEmitter;
events.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    }
    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

var __extends$1 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (commonjsGlobal && commonjsGlobal.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
StrictEventEmitter$1.__esModule = true;
StrictEventEmitter$1.StrictEventEmitter = void 0;
var events_1 = events.exports;
var StrictEventEmitter = /** @class */ (function (_super) {
    __extends$1(StrictEventEmitter, _super);
    function StrictEventEmitter() {
        return _super.call(this) || this;
    }
    StrictEventEmitter.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event.toString(), listener);
    };
    StrictEventEmitter.prototype.once = function (event, listener) {
        return _super.prototype.on.call(this, event.toString(), listener);
    };
    StrictEventEmitter.prototype.off = function (event, listener) {
        return _super.prototype.off.call(this, event.toString(), listener);
    };
    StrictEventEmitter.prototype.emit = function (event) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, __spreadArrays([event.toString()], data));
    };
    StrictEventEmitter.prototype.addListener = function (event, listener) {
        return _super.prototype.addListener.call(this, event.toString(), listener);
    };
    StrictEventEmitter.prototype.removeListener = function (event, listener) {
        return _super.prototype.removeListener.call(this, event.toString(), listener);
    };
    return StrictEventEmitter;
}(events_1.EventEmitter));
StrictEventEmitter$1.StrictEventEmitter = StrictEventEmitter;

(function (exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.StrictEventEmitter = void 0;
var StrictEventEmitter_1 = StrictEventEmitter$1;
__createBinding(exports, StrictEventEmitter_1, "StrictEventEmitter");
}(lib$3));

var lib$2 = {};

var until$1 = {};

Object.defineProperty(until$1, "__esModule", { value: true });
/**
 * Gracefully handles a given Promise factory.
 * @example
 * cosnt [error, data] = await until(() => asyncAction())
 */
until$1.until = async (promise) => {
    try {
        const data = await promise().catch((error) => {
            throw error;
        });
        return [null, data];
    }
    catch (error) {
        return [error, null];
    }
};

Object.defineProperty(lib$2, "__esModule", { value: true });
var until_1$1 = until$1;
var until = lib$2.until = until_1$1.until;

/**
 * Attempts to resolve a Service Worker instance from a given registration,
 * regardless of its state (active, installing, waiting).
 */
const getWorkerByRegistration = (registration, absoluteWorkerUrl, findWorker) => {
    const allStates = [
        registration.active,
        registration.installing,
        registration.waiting,
    ];
    const existingStates = allStates.filter(Boolean);
    const mockWorker = existingStates.find((worker) => {
        return findWorker(worker.scriptURL, absoluteWorkerUrl);
    });
    return mockWorker || null;
};

/**
 * Returns an absolute Service Worker URL based on the given
 * relative URL (known during the registration).
 */
function getAbsoluteWorkerUrl(relativeUrl) {
    return new URL(relativeUrl, location.origin).href;
}

/**
 * Returns an active Service Worker instance.
 * When not found, registers a new Service Worker.
 */
const getWorkerInstance = (url, options = {}, findWorker) => __awaiter$3(void 0, void 0, void 0, function* () {
    // Resolve the absolute Service Worker URL.
    const absoluteWorkerUrl = getAbsoluteWorkerUrl(url);
    const mockRegistrations = yield navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => registrations.filter((registration) => getWorkerByRegistration(registration, absoluteWorkerUrl, findWorker)));
    if (!navigator.serviceWorker.controller && mockRegistrations.length > 0) {
        // Reload the page when it has associated workers, but no active controller.
        // The absence of a controller can mean either:
        // - page has no Service Worker associated with it
        // - page has been hard-reloaded and its workers won't be used until the next reload.
        // Since we've checked that there are registrations associated with this page,
        // at this point we are sure it's hard reload that falls into this clause.
        location.reload();
    }
    const [existingRegistration] = mockRegistrations;
    if (existingRegistration) {
        // When the Service Worker is registered, update it and return the reference.
        return existingRegistration.update().then(() => {
            return [
                getWorkerByRegistration(existingRegistration, absoluteWorkerUrl, findWorker),
                existingRegistration,
            ];
        });
    }
    // When the Service Worker wasn't found, register it anew and return the reference.
    const [error, instance] = yield until(() => __awaiter$3(void 0, void 0, void 0, function* () {
        const registration = yield navigator.serviceWorker.register(url, options);
        return [
            // Compare existing worker registration by its worker URL,
            // to prevent irrelevant workers to resolve here (such as Codesandbox worker).
            getWorkerByRegistration(registration, absoluteWorkerUrl, findWorker),
            registration,
        ];
    }));
    // Handle Service Worker registration errors.
    if (error) {
        const isWorkerMissing = error.message.includes('(404)');
        // Produce a custom error message when given a non-existing Service Worker url.
        // Suggest developers to check their setup.
        if (isWorkerMissing) {
            const scopeUrl = new URL((options === null || options === void 0 ? void 0 : options.scope) || '/', location.href);
            throw new Error(devUtils.formatMessage(`\
Failed to register a Service Worker for scope ('${scopeUrl.href}') with script ('${absoluteWorkerUrl}'): Service Worker script does not exist at the given path.

Did you forget to run "npx msw init <PUBLIC_DIR>"?

Learn more about creating the Service Worker script: https://mswjs.io/docs/cli/init`));
        }
        // Fallback error message for any other registration errors.
        throw new Error(devUtils.formatMessage('Failed to register the Service Worker:\n\n%s', error.message));
    }
    return instance;
});

/**
 * Prints a worker activation message in the browser's console.
 */
function printStartMessage(args = {}) {
    if (args.quiet) {
        return;
    }
    const message = args.message || 'Mocking enabled.';
    console.groupCollapsed(`%c${devUtils.formatMessage(message)}`, 'color:orangered;font-weight:bold;');
    console.log('%cDocumentation: %chttps://mswjs.io/docs', 'font-weight:bold', 'font-weight:normal');
    console.log('Found an issue? https://github.com/mswjs/msw/issues');
    console.groupEnd();
}

/**
 * Signals the worker to enable the interception of requests.
 */
function enableMocking(context, options) {
    return __awaiter$3(this, void 0, void 0, function* () {
        context.workerChannel.send('MOCK_ACTIVATE');
        return context.events.once('MOCKING_ENABLED').then(() => {
            printStartMessage({ quiet: options.quiet });
        });
    });
}

/**
 * Creates a communication channel between the client
 * and the Service Worker associated with the given event.
 */
const createBroadcastChannel = (event) => {
    const port = event.ports[0];
    return {
        /**
         * Sends a text message to the connected Service Worker.
         */
        send(message) {
            if (port) {
                port.postMessage(message);
            }
        },
    };
};

var lib$1 = {};

var CookieStore = {};

var setCookie = {exports: {}};

var defaultParseOptions = {
  decodeValues: true,
  map: false,
  silent: false,
};

function isNonEmptyString(str) {
  return typeof str === "string" && !!str.trim();
}

function parseString(setCookieValue, options) {
  var parts = setCookieValue.split(";").filter(isNonEmptyString);
  var nameValue = parts.shift().split("=");
  var name = nameValue.shift();
  var value = nameValue.join("="); // everything after the first =, joined by a "=" if there was more than one part

  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;

  try {
    value = options.decodeValues ? decodeURIComponent(value) : value; // decode cookie value
  } catch (e) {
    console.error(
      "set-cookie-parser encountered an error while decoding a cookie with value '" +
        value +
        "'. Set options.decodeValues to false to disable this feature.",
      e
    );
  }

  var cookie = {
    name: name, // grab everything before the first =
    value: value,
  };

  parts.forEach(function (part) {
    var sides = part.split("=");
    var key = sides.shift().trimLeft().toLowerCase();
    var value = sides.join("=");
    if (key === "expires") {
      cookie.expires = new Date(value);
    } else if (key === "max-age") {
      cookie.maxAge = parseInt(value, 10);
    } else if (key === "secure") {
      cookie.secure = true;
    } else if (key === "httponly") {
      cookie.httpOnly = true;
    } else if (key === "samesite") {
      cookie.sameSite = value;
    } else {
      cookie[key] = value;
    }
  });

  return cookie;
}

function parse$1(input, options) {
  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;

  if (!input) {
    if (!options.map) {
      return [];
    } else {
      return {};
    }
  }

  if (input.headers && input.headers["set-cookie"]) {
    // fast-path for node.js (which automatically normalizes header names to lower-case
    input = input.headers["set-cookie"];
  } else if (input.headers) {
    // slow-path for other environments - see #25
    var sch =
      input.headers[
        Object.keys(input.headers).find(function (key) {
          return key.toLowerCase() === "set-cookie";
        })
      ];
    // warn if called on a request-like object with a cookie header rather than a set-cookie header - see #34, 36
    if (!sch && input.headers.cookie && !options.silent) {
      console.warn(
        "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
      );
    }
    input = sch;
  }
  if (!Array.isArray(input)) {
    input = [input];
  }

  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;

  if (!options.map) {
    return input.filter(isNonEmptyString).map(function (str) {
      return parseString(str, options);
    });
  } else {
    var cookies = {};
    return input.filter(isNonEmptyString).reduce(function (cookies, str) {
      var cookie = parseString(str, options);
      cookies[cookie.name] = cookie;
      return cookies;
    }, cookies);
  }
}

/*
  Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
  that are within a single set-cookie field-value, such as in the Expires portion.

  This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
  Node.js does this for every header *except* set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
  React Native's fetch does this for *every* header, including set-cookie.

  Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
  Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
*/
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }

  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;

  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }

  function notSpecialChar() {
    ch = cookiesString.charAt(pos);

    return ch !== "=" && ch !== ";" && ch !== ",";
  }

  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;

    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        // ',' is a cookie separator if we have later first '=', not ';' or ','
        lastComma = pos;
        pos += 1;

        skipWhitespace();
        nextStart = pos;

        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }

        // currently special character
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          // we found cookies separator
          cookiesSeparatorFound = true;
          // pos is inside the next cookie, so back up and return it.
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          // in param ',' or param separator ';',
          // we continue from that comma
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }

    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }

  return cookiesStrings;
}

setCookie.exports = parse$1;
setCookie.exports.parse = parse$1;
setCookie.exports.parseString = parseString;
setCookie.exports.splitCookiesString = splitCookiesString;

(function (exports) {
var __rest = (commonjsGlobal && commonjsGlobal.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERSISTENCY_KEY = void 0;
const set_cookie_parser_1 = setCookie.exports;
exports.PERSISTENCY_KEY = 'MSW_COOKIE_STORE';
const SUPPORTS_LOCAL_STORAGE = typeof localStorage !== 'undefined';
class CookieStore {
    constructor() {
        this.store = new Map();
    }
    /**
     * Sets the given request cookies into the store.
     * Respects the `request.credentials` policy.
     */
    add(request, response) {
        if (request.credentials === 'omit') {
            return;
        }
        const requestUrl = new URL(request.url);
        const responseCookies = response.headers.get('set-cookie');
        if (!responseCookies) {
            return;
        }
        const now = Date.now();
        const parsedResponseCookies = set_cookie_parser_1.parse(responseCookies).map((_a) => {
            var { maxAge } = _a, cookie = __rest(_a, ["maxAge"]);
            return (Object.assign(Object.assign({}, cookie), { expires: maxAge === undefined ? cookie.expires : new Date(now + maxAge * 1000), maxAge }));
        });
        const prevCookies = this.store.get(requestUrl.origin) || new Map();
        parsedResponseCookies.forEach((cookie) => {
            this.store.set(requestUrl.origin, prevCookies.set(cookie.name, cookie));
        });
    }
    /**
     * Returns cookies relevant to the given request
     * and its `request.credentials` policy.
     */
    get(request) {
        this.deleteExpiredCookies();
        const requestUrl = new URL(request.url);
        const originCookies = this.store.get(requestUrl.origin) || new Map();
        switch (request.credentials) {
            case 'include': {
                const documentCookies = set_cookie_parser_1.parse(document.cookie);
                documentCookies.forEach((cookie) => {
                    originCookies.set(cookie.name, cookie);
                });
                return originCookies;
            }
            case 'same-origin': {
                return originCookies;
            }
            default:
                return new Map();
        }
    }
    /**
     * Returns a collection of all stored cookies.
     */
    getAll() {
        this.deleteExpiredCookies();
        return this.store;
    }
    /**
     * Deletes all cookies associated with the given request.
     */
    deleteAll(request) {
        const requestUrl = new URL(request.url);
        this.store.delete(requestUrl.origin);
    }
    /**
     * Clears the entire cookie store.
     */
    clear() {
        this.store.clear();
    }
    /**
     * Hydrates the virtual cookie store from the `localStorage` if defined.
     */
    hydrate() {
        if (!SUPPORTS_LOCAL_STORAGE) {
            return;
        }
        const persistedCookies = localStorage.getItem(exports.PERSISTENCY_KEY);
        if (persistedCookies) {
            try {
                const parsedCookies = JSON.parse(persistedCookies);
                parsedCookies.forEach(([origin, cookies]) => {
                    this.store.set(origin, new Map(cookies.map((_a) => {
                        var [token, _b] = _a, { expires } = _b, cookie = __rest(_b, ["expires"]);
                        return [
                            token,
                            expires === undefined
                                ? cookie
                                : Object.assign(Object.assign({}, cookie), { expires: new Date(expires) }),
                        ];
                    })));
                });
            }
            catch (error) {
                console.warn(`
[virtual-cookie] Failed to parse a stored cookie from the localStorage (key "${exports.PERSISTENCY_KEY}").

Stored value:
${localStorage.getItem(exports.PERSISTENCY_KEY)}

Thrown exception:
${error}

Invalid value has been removed from localStorage to prevent subsequent failed parsing attempts.`);
                localStorage.removeItem(exports.PERSISTENCY_KEY);
            }
        }
    }
    /**
     * Persists the current virtual cookies into the `localStorage` if defined,
     * so they are available on the next page load.
     */
    persist() {
        if (!SUPPORTS_LOCAL_STORAGE) {
            return;
        }
        const serializedCookies = Array.from(this.store.entries()).map(([origin, cookies]) => {
            return [origin, Array.from(cookies.entries())];
        });
        localStorage.setItem(exports.PERSISTENCY_KEY, JSON.stringify(serializedCookies));
    }
    deleteExpiredCookies() {
        const now = Date.now();
        this.store.forEach((originCookies, origin) => {
            originCookies.forEach(({ expires, name }) => {
                if (expires !== undefined && expires.getTime() <= now) {
                    originCookies.delete(name);
                }
            });
            if (originCookies.size === 0) {
                this.store.delete(origin);
            }
        });
    }
}
exports.default = new CookieStore();
}(CookieStore));

(function (exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERSISTENCY_KEY = exports.store = void 0;
var CookieStore_1 = CookieStore;
Object.defineProperty(exports, "store", { enumerable: true, get: function () { return __importDefault(CookieStore_1).default; } });
Object.defineProperty(exports, "PERSISTENCY_KEY", { enumerable: true, get: function () { return CookieStore_1.PERSISTENCY_KEY; } });
}(lib$1));

function getAllCookies() {
    return parse_1(document.cookie);
}
/**
 * Returns relevant document cookies based on the request `credentials` option.
 */
function getRequestCookies(request) {
    /**
     * @note No cookies persist on the document in Node.js: no document.
     */
    if (typeof location === 'undefined') {
        return {};
    }
    switch (request.credentials) {
        case 'same-origin': {
            // Return document cookies only when requested a resource
            // from the same origin as the current document.
            return location.origin === request.url.origin ? getAllCookies() : {};
        }
        case 'include': {
            // Return all document cookies.
            return getAllCookies();
        }
        default: {
            return {};
        }
    }
}

function setRequestCookies(request) {
    var _a;
    lib$1.store.hydrate();
    request.cookies = Object.assign(Object.assign({}, getRequestCookies(request)), Array.from((_a = lib$1.store.get(Object.assign(Object.assign({}, request), { url: request.url.toString() }))) === null || _a === void 0 ? void 0 : _a.entries()).reduce((cookies, [name, { value }]) => Object.assign(cookies, { [name]: value }), {}));
    request.headers.set('cookie', Object.entries(request.cookies)
        .map(([name, value]) => `${name}=${value}`)
        .join('; '));
}

/**
 * Ensures that an empty GET request body is always represented as `undefined`.
 */
function pruneGetRequestBody(request) {
    if (request.method &&
        isStringEqual(request.method, 'GET') &&
        request.body === '') {
        return undefined;
    }
    return request.body;
}

/**
 * Converts a given request received from the Service Worker
 * into a `MockedRequest` instance.
 */
function parseWorkerRequest(rawRequest) {
    const request = {
        id: rawRequest.id,
        cache: rawRequest.cache,
        credentials: rawRequest.credentials,
        method: rawRequest.method,
        url: new URL(rawRequest.url),
        referrer: rawRequest.referrer,
        referrerPolicy: rawRequest.referrerPolicy,
        redirect: rawRequest.redirect,
        mode: rawRequest.mode,
        params: {},
        cookies: {},
        integrity: rawRequest.integrity,
        keepalive: rawRequest.keepalive,
        destination: rawRequest.destination,
        body: pruneGetRequestBody(rawRequest),
        bodyUsed: rawRequest.bodyUsed,
        headers: new lib$4.Headers(rawRequest.headers),
    };
    // Set document cookies on the request.
    setRequestCookies(request);
    // Parse the request's body based on the "Content-Type" header.
    request.body = parseBody(request.body, request.headers);
    return request;
}

/**
 * Returns a mocked response for a given request using following request handlers.
 */
const getResponse = (request, handlers, resolutionContext) => __awaiter$3(void 0, void 0, void 0, function* () {
    const relevantHandlers = handlers.filter((handler) => {
        return handler.test(request, resolutionContext);
    });
    if (relevantHandlers.length === 0) {
        return {
            handler: undefined,
            response: undefined,
        };
    }
    const result = yield relevantHandlers.reduce((executionResult, handler) => __awaiter$3(void 0, void 0, void 0, function* () {
        const previousResults = yield executionResult;
        if (!!(previousResults === null || previousResults === void 0 ? void 0 : previousResults.response)) {
            return executionResult;
        }
        const result = yield handler.run(request, resolutionContext);
        if (result === null || result.handler.shouldSkip) {
            return null;
        }
        if (!result.response) {
            return {
                request: result.request,
                handler: result.handler,
                response: undefined,
                parsedResult: result.parsedResult,
            };
        }
        if (result.response.once) {
            handler.markAsSkipped(true);
        }
        return result;
    }), Promise.resolve(null));
    // Although reducing a list of relevant request handlers, it's possible
    // that in the end there will be no handler associted with the request
    // (i.e. if relevant handlers are fall-through).
    if (!result) {
        return {
            handler: undefined,
            response: undefined,
        };
    }
    return {
        handler: result.handler,
        publicRequest: result.request,
        parsedRequest: result.parsedResult,
        response: result.response,
    };
});

var jsLevenshtein = (function()
{
  function _min(d0, d1, d2, bx, ay)
  {
    return d0 < d1 || d2 < d1
        ? d0 > d2
            ? d2 + 1
            : d0 + 1
        : bx === ay
            ? d1
            : d1 + 1;
  }

  return function(a, b)
  {
    if (a === b) {
      return 0;
    }

    if (a.length > b.length) {
      var tmp = a;
      a = b;
      b = tmp;
    }

    var la = a.length;
    var lb = b.length;

    while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
      la--;
      lb--;
    }

    var offset = 0;

    while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
      offset++;
    }

    la -= offset;
    lb -= offset;

    if (la === 0 || lb < 3) {
      return lb;
    }

    var x = 0;
    var y;
    var d0;
    var d1;
    var d2;
    var d3;
    var dd;
    var dy;
    var ay;
    var bx0;
    var bx1;
    var bx2;
    var bx3;

    var vector = [];

    for (y = 0; y < la; y++) {
      vector.push(y + 1);
      vector.push(a.charCodeAt(offset + y));
    }

    var len = vector.length - 1;

    for (; x < lb - 3;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      bx1 = b.charCodeAt(offset + (d1 = x + 1));
      bx2 = b.charCodeAt(offset + (d2 = x + 2));
      bx3 = b.charCodeAt(offset + (d3 = x + 3));
      dd = (x += 4);
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        ay = vector[y + 1];
        d0 = _min(dy, d0, d1, bx0, ay);
        d1 = _min(d0, d1, d2, bx1, ay);
        d2 = _min(d1, d2, d3, bx2, ay);
        dd = _min(d2, d3, dd, bx3, ay);
        vector[y] = dd;
        d3 = d2;
        d2 = d1;
        d1 = d0;
        d0 = dy;
      }
    }

    for (; x < lb;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      dd = ++x;
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
        d0 = dy;
      }
    }

    return dd;
  };
})();

const MAX_MATCH_SCORE = 3;
const MAX_SUGGESTION_COUNT = 4;
const TYPE_MATCH_DELTA = 0.5;
function groupHandlersByType(handlers) {
    return handlers.reduce((groups, handler) => {
        if (handler instanceof RestHandler) {
            groups.rest.push(handler);
        }
        if (handler instanceof GraphQLHandler) {
            groups.graphql.push(handler);
        }
        return groups;
    }, {
        rest: [],
        graphql: [],
    });
}
function getScoreForRestHandler() {
    return (request, handler) => {
        const { path, method } = handler.info;
        if (path instanceof RegExp) {
            return Infinity;
        }
        const hasSameMethod = isStringEqual(request.method, method);
        // Always treat a handler with the same method as a more similar one.
        const methodScoreDelta = hasSameMethod ? TYPE_MATCH_DELTA : 0;
        const requestPublicUrl = getPublicUrlFromRequest(request);
        const score = jsLevenshtein(requestPublicUrl, path);
        return score - methodScoreDelta;
    };
}
function getScoreForGraphQLHandler(parsedQuery) {
    return (_, handler) => {
        if (typeof parsedQuery.operationName === 'undefined') {
            return Infinity;
        }
        const { operationType, operationName } = handler.info;
        const hasSameOperationType = parsedQuery.operationType === operationType;
        // Always treat a handler with the same operation type as a more similar one.
        const operationTypeScoreDelta = hasSameOperationType ? TYPE_MATCH_DELTA : 0;
        const score = jsLevenshtein(parsedQuery.operationName, operationName);
        return score - operationTypeScoreDelta;
    };
}
function getSuggestedHandler(request, handlers, getScore) {
    const suggestedHandlers = handlers
        .reduce((acc, handler) => {
        const score = getScore(request, handler);
        return acc.concat([[score, handler]]);
    }, [])
        .sort(([leftScore], [rightScore]) => {
        return leftScore - rightScore;
    })
        .filter(([score]) => {
        return score <= MAX_MATCH_SCORE;
    })
        .slice(0, MAX_SUGGESTION_COUNT)
        .map(([, handler]) => handler);
    return suggestedHandlers;
}
function getSuggestedHandlersMessage(handlers) {
    if (handlers.length > 1) {
        return `\
Did you mean to request one of the following resources instead?

${handlers.map((handler) => `  • ${handler.info.header}`).join('\n')}`;
    }
    return `Did you mean to request "${handlers[0].info.header}" instead?`;
}
function onUnhandledRequest(request, handlers, strategy = 'warn') {
    if (typeof strategy === 'function') {
        strategy(request);
        return;
    }
    /**
     * @note Ignore exceptions during GraphQL request parsing because at this point
     * we cannot assume the unhandled request is a valid GraphQL request.
     * If the GraphQL parsing fails, just don't treat it as a GraphQL request.
     */
    const parsedGraphQLQuery = tryCatch(() => parseGraphQLRequest(request));
    const handlerGroups = groupHandlersByType(handlers);
    const relevantHandlers = parsedGraphQLQuery
        ? handlerGroups.graphql
        : handlerGroups.rest;
    const suggestedHandlers = getSuggestedHandler(request, relevantHandlers, parsedGraphQLQuery
        ? getScoreForGraphQLHandler(parsedGraphQLQuery)
        : getScoreForRestHandler());
    const handlerSuggestion = suggestedHandlers.length > 0
        ? getSuggestedHandlersMessage(suggestedHandlers)
        : '';
    const publicUrl = getPublicUrlFromRequest(request);
    const requestHeader = parsedGraphQLQuery
        ? `${parsedGraphQLQuery.operationType} ${parsedGraphQLQuery.operationName} (${request.method} ${publicUrl})`
        : `${request.method} ${publicUrl}`;
    const messageTemplate = [
        `captured a request without a matching request handler:`,
        `  \u2022 ${requestHeader}`,
        handlerSuggestion,
        `\
If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/getting-started/mocks\
`,
    ].filter(Boolean);
    const message = messageTemplate.join('\n\n');
    switch (strategy) {
        case 'error': {
            // Print a developer-friendly error.
            devUtils.error('Error: %s', message);
            // Throw an exception to halt request processing and not perform the original request.
            throw new Error('Cannot bypass a request when using the "error" strategy for the "onUnhandledRequest" option.');
        }
        case 'warn': {
            devUtils.warn('Warning: %s', message);
            break;
        }
        case 'bypass':
            break;
        default:
            throw new Error(devUtils.formatMessage('Failed to react to an unhandled request: unknown strategy "%s". Please provide one of the supported strategies ("bypass", "warn", "error") or a custom callback function as the value of the "onUnhandledRequest" option.', strategy));
    }
}

function readResponseCookies(request, response) {
    lib$1.store.add(Object.assign(Object.assign({}, request), { url: request.url.toString() }), response);
    lib$1.store.persist();
}

function handleRequest(request, handlers, options, emitter, handleRequestOptions) {
    var _a, _b, _c;
    return __awaiter$3(this, void 0, void 0, function* () {
        emitter.emit('request:start', request);
        // Perform bypassed requests (i.e. issued via "ctx.fetch") as-is.
        if (request.headers.get('x-msw-bypass')) {
            emitter.emit('request:end', request);
            (_a = handleRequestOptions === null || handleRequestOptions === void 0 ? void 0 : handleRequestOptions.onBypassResponse) === null || _a === void 0 ? void 0 : _a.call(handleRequestOptions, request);
            return;
        }
        // Resolve a mocked response from the list of request handlers.
        const lookupResult = yield getResponse(request, handlers, handleRequestOptions === null || handleRequestOptions === void 0 ? void 0 : handleRequestOptions.resolutionContext);
        const { handler, response } = lookupResult;
        // When there's no handler for the request, consider it unhandled.
        // Allow the developer to react to such cases.
        if (!handler) {
            onUnhandledRequest(request, handlers, options.onUnhandledRequest);
            emitter.emit('request:unhandled', request);
            emitter.emit('request:end', request);
            (_b = handleRequestOptions === null || handleRequestOptions === void 0 ? void 0 : handleRequestOptions.onBypassResponse) === null || _b === void 0 ? void 0 : _b.call(handleRequestOptions, request);
            return;
        }
        // When the handled request returned no mocked response, warn the developer,
        // as it may be an oversight on their part. Perform the request as-is.
        if (!response) {
            devUtils.warn('Expected a mocking resolver function to return a mocked response Object, but got: %s. Original response is going to be used instead.', response);
            emitter.emit('request:end', request);
            (_c = handleRequestOptions === null || handleRequestOptions === void 0 ? void 0 : handleRequestOptions.onBypassResponse) === null || _c === void 0 ? void 0 : _c.call(handleRequestOptions, request);
            return;
        }
        // Store all the received response cookies in the virtual cookie store.
        readResponseCookies(request, response);
        emitter.emit('request:match', request);
        return new Promise((resolve) => {
            var _a, _b, _c;
            const requiredLookupResult = lookupResult;
            const transformedResponse = ((_a = handleRequestOptions === null || handleRequestOptions === void 0 ? void 0 : handleRequestOptions.transformResponse) === null || _a === void 0 ? void 0 : _a.call(handleRequestOptions, response)) ||
                response;
            (_b = handleRequestOptions === null || handleRequestOptions === void 0 ? void 0 : handleRequestOptions.onMockedResponse) === null || _b === void 0 ? void 0 : _b.call(handleRequestOptions, transformedResponse, requiredLookupResult);
            setTimeout(() => {
                var _a;
                (_a = handleRequestOptions === null || handleRequestOptions === void 0 ? void 0 : handleRequestOptions.onMockedResponseSent) === null || _a === void 0 ? void 0 : _a.call(handleRequestOptions, transformedResponse, requiredLookupResult);
                emitter.emit('request:end', request);
                resolve(transformedResponse);
            }, (_c = response.delay) !== null && _c !== void 0 ? _c : 0);
        });
    });
}

const createRequestListener = (context, options) => {
    return (event, message) => __awaiter$3(void 0, void 0, void 0, function* () {
        const channel = createBroadcastChannel(event);
        try {
            const request = parseWorkerRequest(message.payload);
            yield handleRequest(request, context.requestHandlers, options, context.emitter, {
                transformResponse(response) {
                    return Object.assign(Object.assign({}, response), { headers: response.headers.all() });
                },
                onBypassResponse() {
                    return channel.send({
                        type: 'MOCK_NOT_FOUND',
                    });
                },
                onMockedResponse(response) {
                    channel.send({
                        type: 'MOCK_SUCCESS',
                        payload: response,
                    });
                },
                onMockedResponseSent(response, { handler, publicRequest, parsedRequest }) {
                    if (!options.quiet) {
                        handler.log(publicRequest, response, handler, parsedRequest);
                    }
                },
            });
        }
        catch (error) {
            if (error instanceof NetworkError) {
                // Treat emulated network error differently,
                // as it is an intended exception in a request handler.
                return channel.send({
                    type: 'NETWORK_ERROR',
                    payload: {
                        name: error.name,
                        message: error.message,
                    },
                });
            }
            // Treat all the other exceptions in a request handler
            // as unintended, alerting that there is a problem needs fixing.
            channel.send({
                type: 'INTERNAL_ERROR',
                payload: {
                    status: 500,
                    body: JSON.stringify({
                        errorType: error.constructor.name,
                        message: error.message,
                        location: error.stack,
                    }),
                },
            });
        }
    });
};

function requestIntegrityCheck(context, serviceWorker) {
    return __awaiter$3(this, void 0, void 0, function* () {
        // Signal Service Worker to report back its integrity
        context.workerChannel.send('INTEGRITY_CHECK_REQUEST');
        const { payload: actualChecksum } = yield context.events.once('INTEGRITY_CHECK_RESPONSE');
        // Compare the response from the Service Worker and the
        // global variable set by Rollup during the build.
        if (actualChecksum !== "f0a916b13c8acc2b526a03a6d26df85f") {
            throw new Error(`Currently active Service Worker (${actualChecksum}) is behind the latest published one (${"f0a916b13c8acc2b526a03a6d26df85f"}).`);
        }
        return serviceWorker;
    });
}

/**
 * Intercepts and defers any requests on the page
 * until the Service Worker instance is ready.
 * Must only be used in a browser.
 */
function deferNetworkRequestsUntil(predicatePromise) {
    // Defer any `XMLHttpRequest` requests until the Service Worker is ready.
    const originalXhrSend = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function (...args) {
        // Keep this function synchronous to comply with `XMLHttpRequest.prototype.send`,
        // because that method is always synchronous.
        until(() => predicatePromise).then(() => {
            window.XMLHttpRequest.prototype.send = originalXhrSend;
            this.send(...args);
        });
    };
    // Defer any `fetch` requests until the Service Worker is ready.
    const originalFetch = window.fetch;
    window.fetch = (...args) => __awaiter$3(this, void 0, void 0, function* () {
        yield until(() => predicatePromise);
        window.fetch = originalFetch;
        return window.fetch(...args);
    });
}

function createResponseListener(context) {
    return (_, message) => {
        var _a;
        const { payload: responseJson } = message;
        /**
         * CORS requests with `mode: "no-cors"` result in "opaque" responses.
         * That kind of responses cannot be manipulated in JavaScript due
         * to the security considerations.
         * @see https://fetch.spec.whatwg.org/#concept-filtered-response-opaque
         * @see https://github.com/mswjs/msw/issues/529
         */
        if ((_a = responseJson.type) === null || _a === void 0 ? void 0 : _a.includes('opaque')) {
            return;
        }
        const response = new Response(responseJson.body || null, responseJson);
        const isMockedResponse = response.headers.get('x-powered-by') === 'msw';
        if (isMockedResponse) {
            context.emitter.emit('response:mocked', response, responseJson.requestId);
        }
        else {
            context.emitter.emit('response:bypass', response, responseJson.requestId);
        }
    };
}

function validateWorkerScope(registration, options) {
    if (!(options === null || options === void 0 ? void 0 : options.quiet) && !location.href.startsWith(registration.scope)) {
        devUtils.warn(`\
Cannot intercept requests on this page because it's outside of the worker's scope ("${registration.scope}"). If you wish to mock API requests on this page, you must resolve this scope issue.

- (Recommended) Register the worker at the root level ("/") of your application.
- Set the "Service-Worker-Allowed" response header to allow out-of-scope workers.\
`);
    }
}

const createStartHandler = (context) => {
    return function start(options, customOptions) {
        const startWorkerInstance = () => __awaiter$3(this, void 0, void 0, function* () {
            // Remove all previously existing event listeners.
            // This way none of the listeners persists between Fast refresh
            // of the application's code.
            context.events.removeAllListeners();
            // Handle requests signaled by the worker.
            context.workerChannel.on('REQUEST', createRequestListener(context, options));
            context.workerChannel.on('RESPONSE', createResponseListener(context));
            const instance = yield getWorkerInstance(options.serviceWorker.url, options.serviceWorker.options, options.findWorker);
            const [worker, registration] = instance;
            if (!worker) {
                const missingWorkerMessage = (customOptions === null || customOptions === void 0 ? void 0 : customOptions.findWorker)
                    ? devUtils.formatMessage(`Failed to locate the Service Worker registration using a custom "findWorker" predicate.

Please ensure that the custom predicate properly locates the Service Worker registration at "%s".
More details: https://mswjs.io/docs/api/setup-worker/start#findworker
`, options.serviceWorker.url)
                    : devUtils.formatMessage(`Failed to locate the Service Worker registration.

This most likely means that the worker script URL "%s" cannot resolve against the actual public hostname (%s). This may happen if your application runs behind a proxy, or has a dynamic hostname.

Please consider using a custom "serviceWorker.url" option to point to the actual worker script location, or a custom "findWorker" option to resolve the Service Worker registration manually. More details: https://mswjs.io/docs/api/setup-worker/start`, options.serviceWorker.url, location.host);
                throw new Error(missingWorkerMessage);
            }
            context.worker = worker;
            context.registration = registration;
            context.events.addListener(window, 'beforeunload', () => {
                if (worker.state !== 'redundant') {
                    // Notify the Service Worker that this client has closed.
                    // Internally, it's similar to disabling the mocking, only
                    // client close event has a handler that self-terminates
                    // the Service Worker when there are no open clients.
                    context.workerChannel.send('CLIENT_CLOSED');
                }
                // Make sure we're always clearing the interval - there are reports that not doing this can
                // cause memory leaks in headless browser environments.
                window.clearInterval(context.keepAliveInterval);
            });
            // Check if the active Service Worker is the latest published one
            const [integrityError] = yield until(() => requestIntegrityCheck(context, worker));
            if (integrityError) {
                devUtils.error(`\
Detected outdated Service Worker: ${integrityError.message}

The mocking is still enabled, but it's highly recommended that you update your Service Worker by running:

$ npx msw init <PUBLIC_DIR>

This is necessary to ensure that the Service Worker is in sync with the library to guarantee its stability.
If this message still persists after updating, please report an issue: https://github.com/open-draft/msw/issues\
      `);
            }
            yield enableMocking(context, options).catch((err) => {
                throw new Error(`Failed to enable mocking: ${err === null || err === void 0 ? void 0 : err.message}`);
            });
            context.keepAliveInterval = window.setInterval(() => context.workerChannel.send('KEEPALIVE_REQUEST'), 5000);
            // Warn the user when loading the page that lies outside
            // of the worker's scope.
            validateWorkerScope(registration, context.startOptions);
            return registration;
        });
        const workerRegistration = startWorkerInstance();
        // Defer any network requests until the Service Worker instance is ready.
        // This prevents a race condition between the Service Worker registration
        // and application's runtime requests (i.e. requests on mount).
        if (options.waitUntilReady) {
            deferNetworkRequestsUntil(workerRegistration);
        }
        return workerRegistration;
    };
};

function printStopMessage(args = {}) {
    if (args.quiet) {
        return;
    }
    console.log(`%c${devUtils.formatMessage('Mocking disabled.')}`, 'color:orangered;font-weight:bold;');
}

const createStop = (context) => {
    return function stop() {
        var _a;
        /**
         * Signal the Service Worker to disable mocking for this client.
         * Use this an an explicit way to stop the mocking, while preserving
         * the worker-client relation. Does not affect the worker's lifecycle.
         */
        context.workerChannel.send('MOCK_DEACTIVATE');
        window.clearInterval(context.keepAliveInterval);
        printStopMessage({ quiet: (_a = context.startOptions) === null || _a === void 0 ? void 0 : _a.quiet });
    };
};

function use(currentHandlers, ...handlers) {
    currentHandlers.unshift(...handlers);
}
function restoreHandlers(handlers) {
    handlers.forEach((handler) => {
        handler.markAsSkipped(false);
    });
}
function resetHandlers(initialHandlers, ...nextHandlers) {
    return nextHandlers.length > 0 ? [...nextHandlers] : [...initialHandlers];
}

const DEFAULT_START_OPTIONS = {
    serviceWorker: {
        url: '/mockServiceWorker.js',
        options: null,
    },
    quiet: false,
    waitUntilReady: true,
    onUnhandledRequest: 'warn',
    findWorker(scriptURL, mockServiceWorkerUrl) {
        return scriptURL === mockServiceWorkerUrl;
    },
};
/**
 * Returns resolved worker start options, merging the default options
 * with the given custom options.
 */
function resolveStartOptions(initialOptions) {
    return mergeRight(DEFAULT_START_OPTIONS, initialOptions || {});
}
function prepareStartHandler(handler, context) {
    return (initialOptions) => {
        context.startOptions = resolveStartOptions(initialOptions);
        return handler(context.startOptions, initialOptions || {});
    };
}

var lib = {};

var createInterceptor$1 = {};

Object.defineProperty(createInterceptor$1, "__esModule", { value: true });
createInterceptor$1.createInterceptor = void 0;
var strict_event_emitter_1$1 = lib$3;
function createInterceptor(options) {
    var observer = new strict_event_emitter_1$1.StrictEventEmitter();
    var cleanupFns = [];
    return {
        apply: function () {
            cleanupFns = options.modules.map(function (interceptor) {
                return interceptor(observer, options.resolver);
            });
        },
        on: function (event, listener) {
            observer.addListener(event, listener);
        },
        restore: function () {
            observer.removeAllListeners();
            if (cleanupFns.length === 0) {
                throw new Error("Failed to restore patched modules: no patches found. Did you forget to run \".apply()\"?");
            }
            cleanupFns.forEach(function (restore) { return restore(); });
        },
    };
}
createInterceptor$1.createInterceptor = createInterceptor;

var remote = {};

var toIsoResponse$1 = {};

Object.defineProperty(toIsoResponse$1, "__esModule", { value: true });
toIsoResponse$1.toIsoResponse = void 0;
var headers_utils_1$3 = lib$4;
/**
 * Converts a given mocked response object into an isomorphic response.
 */
function toIsoResponse(response) {
    return {
        status: response.status || 200,
        statusText: response.statusText || 'OK',
        headers: headers_utils_1$3.objectToHeaders(response.headers || {}),
        body: response.body,
    };
}
toIsoResponse$1.toIsoResponse = toIsoResponse;

var __assign$1 = (commonjsGlobal && commonjsGlobal.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
var __awaiter$2 = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$2 = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read$1 = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(remote, "__esModule", { value: true });
remote.createRemoteResolver = remote.createRemoteInterceptor = void 0;
var headers_utils_1$2 = lib$4;
var outvariant_1 = lib$5;
var strict_event_emitter_1 = lib$3;
var createInterceptor_1 = createInterceptor$1;
var toIsoResponse_1$2 = toIsoResponse$1;
function requestReviver(key, value) {
    switch (key) {
        case 'url':
            return new URL(value);
        case 'headers':
            return new headers_utils_1$2.Headers(value);
        default:
            return value;
    }
}
/**
 * Creates a remote request interceptor that delegates
 * the mocked response resolution to the parent process.
 * The parent process must establish a remote resolver
 * by calling `createRemoteResolver` function.
 */
function createRemoteInterceptor(options) {
    outvariant_1.invariant(process.connected, "Failed to create a remote interceptor: the current process (%s) does not have a parent. Please make sure you're spawning this process as a child process in order to use remote request interception.", process.pid);
    if (typeof process.send === 'undefined') {
        throw new Error("Failed to create a remote interceptor: the current process (" + process.pid + ") does not have the IPC enabled. Please make sure you're spawning this process with the \"ipc\" stdio value set:\n\nspawn('node', ['module.js'], { stdio: ['ipc'] })");
    }
    var handleParentMessage;
    var interceptor = createInterceptor_1.createInterceptor(__assign$1(__assign$1({}, options), { resolver: function (request) {
            var _a;
            var serializedRequest = JSON.stringify(request);
            (_a = process.send) === null || _a === void 0 ? void 0 : _a.call(process, "request:" + serializedRequest);
            return new Promise(function (resolve) {
                handleParentMessage = function (message) {
                    if (typeof message !== 'string') {
                        return;
                    }
                    if (message.startsWith("response:" + request.id)) {
                        var _a = __read$1(message.match(/^response:.+?:(.+)$/) || [], 2), responseString = _a[1];
                        if (!responseString) {
                            return resolve();
                        }
                        var mockedResponse = JSON.parse(responseString);
                        return resolve(mockedResponse);
                    }
                };
                process.addListener('message', handleParentMessage);
            });
        } }));
    return __assign$1(__assign$1({}, interceptor), { restore: function () {
            interceptor.restore();
            process.removeListener('message', handleParentMessage);
        } });
}
remote.createRemoteInterceptor = createRemoteInterceptor;
/**
 * Creates a response resolver function attached to the given `ChildProcess`.
 * The child process must establish a remote interceptor by calling `createRemoteInterceptor` function.
 */
function createRemoteResolver(options) {
    var _this = this;
    var observer = new strict_event_emitter_1.StrictEventEmitter();
    var handleChildMessage = function (message) { return __awaiter$2(_this, void 0, void 0, function () {
        var _a, requestString, isoRequest_1, mockedResponse_1, serializedResponse;
        return __generator$2(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (typeof message !== 'string') {
                        return [2 /*return*/];
                    }
                    if (!message.startsWith('request:')) return [3 /*break*/, 2];
                    _a = __read$1(message.match(/^request:(.+)$/) || [], 2), requestString = _a[1];
                    if (!requestString) {
                        return [2 /*return*/];
                    }
                    isoRequest_1 = JSON.parse(requestString, requestReviver);
                    observer.emit('request', isoRequest_1);
                    return [4 /*yield*/, options.resolver(isoRequest_1, undefined)
                        // Send the mocked response to the child process.
                    ];
                case 1:
                    mockedResponse_1 = _b.sent();
                    serializedResponse = JSON.stringify(mockedResponse_1);
                    options.process.send("response:" + isoRequest_1.id + ":" + serializedResponse, function (error) {
                        if (error) {
                            return;
                        }
                        if (mockedResponse_1) {
                            // Emit an optimisting "response" event at this point,
                            // not to rely on the back-and-forth signaling for the sake of the event.
                            observer.emit('response', isoRequest_1, toIsoResponse_1$2.toIsoResponse(mockedResponse_1));
                        }
                    });
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var cleanup = function () {
        options.process.removeListener('message', handleChildMessage);
    };
    options.process.addListener('message', handleChildMessage);
    options.process.addListener('disconnect', cleanup);
    options.process.addListener('error', cleanup);
    options.process.addListener('exit', cleanup);
    return {
        on: function (event, listener) {
            observer.addListener(event, listener);
        },
    };
}
remote.createRemoteResolver = createRemoteResolver;

(function (exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCleanUrl = void 0;
__exportStar(createInterceptor$1, exports);
__exportStar(remote, exports);
/* Utils */
var getCleanUrl_1 = getCleanUrl;
Object.defineProperty(exports, "getCleanUrl", { enumerable: true, get: function () { return getCleanUrl_1.getCleanUrl; } });

}(lib));

var fetch = {};

var uuid = {};

Object.defineProperty(uuid, "__esModule", { value: true });
uuid.uuidv4 = void 0;
function uuidv4$1() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
uuid.uuidv4 = uuidv4$1;

var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter$1 = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$1 = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(fetch, "__esModule", { value: true });
var interceptFetch_1 = fetch.interceptFetch = void 0;
var headers_utils_1$1 = lib$4;
var toIsoResponse_1$1 = toIsoResponse$1;
var uuid_1$1 = uuid;
var debug$1 = require$$3('fetch');
var interceptFetch = function (observer, resolver) {
    var pureFetch = window.fetch;
    debug$1('replacing "window.fetch"...');
    window.fetch = function (input, init) { return __awaiter$1(void 0, void 0, void 0, function () {
        var ref, url, method, isoRequest, response, isomorphicResponse;
        var _a;
        return __generator$1(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ref = new Request(input, init);
                    url = typeof input === 'string' ? input : input.url;
                    method = (init === null || init === void 0 ? void 0 : init.method) || 'GET';
                    debug$1('[%s] %s', method, url);
                    _a = {
                        id: uuid_1$1.uuidv4(),
                        url: new URL(url, location.origin),
                        method: method,
                        headers: new headers_utils_1$1.Headers((init === null || init === void 0 ? void 0 : init.headers) || {})
                    };
                    return [4 /*yield*/, ref.text()];
                case 1:
                    isoRequest = (_a.body = _b.sent(),
                        _a);
                    debug$1('isomorphic request', isoRequest);
                    observer.emit('request', isoRequest);
                    debug$1('awaiting for the mocked response...');
                    return [4 /*yield*/, resolver(isoRequest, ref)];
                case 2:
                    response = _b.sent();
                    debug$1('mocked response', response);
                    if (response) {
                        isomorphicResponse = toIsoResponse_1$1.toIsoResponse(response);
                        debug$1('derived isomorphic response', isomorphicResponse);
                        observer.emit('response', isoRequest, isomorphicResponse);
                        return [2 /*return*/, new Response(response.body, __assign(__assign({}, isomorphicResponse), { 
                                // `Response.headers` cannot be instantiated with the `Headers` polyfill.
                                // Apparently, it halts if the `Headers` class contains unknown properties
                                // (i.e. the internal `Headers.map`).
                                headers: headers_utils_1$1.flattenHeadersObject(response.headers || {}) }))];
                    }
                    debug$1('no mocked response found, bypassing...');
                    return [2 /*return*/, pureFetch(input, init).then(function (response) { return __awaiter$1(void 0, void 0, void 0, function () {
                            var _a, _b, _c;
                            return __generator$1(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        debug$1('original fetch performed', response);
                                        _b = (_a = observer).emit;
                                        _c = ['response',
                                            isoRequest];
                                        return [4 /*yield*/, normalizeFetchResponse(response)];
                                    case 1:
                                        _b.apply(_a, _c.concat([_d.sent()]));
                                        return [2 /*return*/, response];
                                }
                            });
                        }); })];
            }
        });
    }); };
    return function () {
        debug$1('restoring modules...');
        window.fetch = pureFetch;
    };
};
interceptFetch_1 = fetch.interceptFetch = interceptFetch;
function normalizeFetchResponse(response) {
    return __awaiter$1(this, void 0, void 0, function () {
        var _a;
        return __generator$1(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {
                        status: response.status,
                        statusText: response.statusText,
                        headers: headers_utils_1$1.objectToHeaders(headers_utils_1$1.headersToObject(response.headers))
                    };
                    return [4 /*yield*/, response.text()];
                case 1: return [2 /*return*/, (_a.body = _b.sent(),
                        _a)];
            }
        });
    });
}

var XMLHttpRequest = {};

var XMLHttpRequestOverride = {};

var domParser = {};

var conventions$2 = {};

/**
 * "Shallow freezes" an object to render it immutable.
 * Uses `Object.freeze` if available,
 * otherwise the immutability is only in the type.
 *
 * Is used to create "enum like" objects.
 *
 * @template T
 * @param {T} object the object to freeze
 * @param {Pick<ObjectConstructor, 'freeze'> = Object} oc `Object` by default,
 * 				allows to inject custom object constructor for tests
 * @returns {Readonly<T>}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
function freeze(object, oc) {
	if (oc === undefined) {
		oc = Object;
	}
	return oc && typeof oc.freeze === 'function' ? oc.freeze(object) : object
}

/**
 * All mime types that are allowed as input to `DOMParser.parseFromString`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#Argument02 MDN
 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparsersupportedtype WHATWG HTML Spec
 * @see DOMParser.prototype.parseFromString
 */
var MIME_TYPE = freeze({
	/**
	 * `text/html`, the only mime type that triggers treating an XML document as HTML.
	 *
	 * @see DOMParser.SupportedType.isHTML
	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
	 */
	HTML: 'text/html',

	/**
	 * Helper method to check a mime type if it indicates an HTML document
	 *
	 * @param {string} [value]
	 * @returns {boolean}
	 *
	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring 	 */
	isHTML: function (value) {
		return value === MIME_TYPE.HTML
	},

	/**
	 * `application/xml`, the standard mime type for XML documents.
	 *
	 * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
	 * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
	 */
	XML_APPLICATION: 'application/xml',

	/**
	 * `text/html`, an alias for `application/xml`.
	 *
	 * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
	 * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
	 */
	XML_TEXT: 'text/xml',

	/**
	 * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
	 * but is parsed as an XML document.
	 *
	 * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
	 * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
	 */
	XML_XHTML_APPLICATION: 'application/xhtml+xml',

	/**
	 * `image/svg+xml`,
	 *
	 * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
	 * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
	 * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
	 */
	XML_SVG_IMAGE: 'image/svg+xml',
});

/**
 * Namespaces that are used in this code base.
 *
 * @see http://www.w3.org/TR/REC-xml-names
 */
var NAMESPACE$3 = freeze({
	/**
	 * The XHTML namespace.
	 *
	 * @see http://www.w3.org/1999/xhtml
	 */
	HTML: 'http://www.w3.org/1999/xhtml',

	/**
	 * Checks if `uri` equals `NAMESPACE.HTML`.
	 *
	 * @param {string} [uri]
	 *
	 * @see NAMESPACE.HTML
	 */
	isHTML: function (uri) {
		return uri === NAMESPACE$3.HTML
	},

	/**
	 * The SVG namespace.
	 *
	 * @see http://www.w3.org/2000/svg
	 */
	SVG: 'http://www.w3.org/2000/svg',

	/**
	 * The `xml:` namespace.
	 *
	 * @see http://www.w3.org/XML/1998/namespace
	 */
	XML: 'http://www.w3.org/XML/1998/namespace',

	/**
	 * The `xmlns:` namespace
	 *
	 * @see https://www.w3.org/2000/xmlns/
	 */
	XMLNS: 'http://www.w3.org/2000/xmlns/',
});

conventions$2.freeze = freeze;
conventions$2.MIME_TYPE = MIME_TYPE;
conventions$2.NAMESPACE = NAMESPACE$3;

var entities$1 = {};

(function (exports) {
var freeze = conventions$2.freeze;

/**
 * The entities that are predefined in every XML document.
 *
 * @see https://www.w3.org/TR/2006/REC-xml11-20060816/#sec-predefined-ent W3C XML 1.1
 * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-predefined-ent W3C XML 1.0
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML Wikipedia
 */
exports.XML_ENTITIES = freeze({amp:'&', apos:"'", gt:'>', lt:'<', quot:'"'});

/**
 * A map of currently 241 entities that are detected in an HTML document.
 * They contain all entries from `XML_ENTITIES`.
 *
 * @see XML_ENTITIES
 * @see DOMParser.parseFromString
 * @see DOMImplementation.prototype.createHTMLDocument
 * @see https://html.spec.whatwg.org/#named-character-references WHATWG HTML(5) Spec
 * @see https://www.w3.org/TR/xml-entity-names/ W3C XML Entity Names
 * @see https://www.w3.org/TR/html4/sgml/entities.html W3C HTML4/SGML
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Character_entity_references_in_HTML Wikipedia (HTML)
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Entities_representing_special_characters_in_XHTML Wikpedia (XHTML)
 */
exports.HTML_ENTITIES = freeze({
       lt: '<',
       gt: '>',
       amp: '&',
       quot: '"',
       apos: "'",
       Agrave: "À",
       Aacute: "Á",
       Acirc: "Â",
       Atilde: "Ã",
       Auml: "Ä",
       Aring: "Å",
       AElig: "Æ",
       Ccedil: "Ç",
       Egrave: "È",
       Eacute: "É",
       Ecirc: "Ê",
       Euml: "Ë",
       Igrave: "Ì",
       Iacute: "Í",
       Icirc: "Î",
       Iuml: "Ï",
       ETH: "Ð",
       Ntilde: "Ñ",
       Ograve: "Ò",
       Oacute: "Ó",
       Ocirc: "Ô",
       Otilde: "Õ",
       Ouml: "Ö",
       Oslash: "Ø",
       Ugrave: "Ù",
       Uacute: "Ú",
       Ucirc: "Û",
       Uuml: "Ü",
       Yacute: "Ý",
       THORN: "Þ",
       szlig: "ß",
       agrave: "à",
       aacute: "á",
       acirc: "â",
       atilde: "ã",
       auml: "ä",
       aring: "å",
       aelig: "æ",
       ccedil: "ç",
       egrave: "è",
       eacute: "é",
       ecirc: "ê",
       euml: "ë",
       igrave: "ì",
       iacute: "í",
       icirc: "î",
       iuml: "ï",
       eth: "ð",
       ntilde: "ñ",
       ograve: "ò",
       oacute: "ó",
       ocirc: "ô",
       otilde: "õ",
       ouml: "ö",
       oslash: "ø",
       ugrave: "ù",
       uacute: "ú",
       ucirc: "û",
       uuml: "ü",
       yacute: "ý",
       thorn: "þ",
       yuml: "ÿ",
       nbsp: "\u00a0",
       iexcl: "¡",
       cent: "¢",
       pound: "£",
       curren: "¤",
       yen: "¥",
       brvbar: "¦",
       sect: "§",
       uml: "¨",
       copy: "©",
       ordf: "ª",
       laquo: "«",
       not: "¬",
       shy: "­­",
       reg: "®",
       macr: "¯",
       deg: "°",
       plusmn: "±",
       sup2: "²",
       sup3: "³",
       acute: "´",
       micro: "µ",
       para: "¶",
       middot: "·",
       cedil: "¸",
       sup1: "¹",
       ordm: "º",
       raquo: "»",
       frac14: "¼",
       frac12: "½",
       frac34: "¾",
       iquest: "¿",
       times: "×",
       divide: "÷",
       forall: "∀",
       part: "∂",
       exist: "∃",
       empty: "∅",
       nabla: "∇",
       isin: "∈",
       notin: "∉",
       ni: "∋",
       prod: "∏",
       sum: "∑",
       minus: "−",
       lowast: "∗",
       radic: "√",
       prop: "∝",
       infin: "∞",
       ang: "∠",
       and: "∧",
       or: "∨",
       cap: "∩",
       cup: "∪",
       'int': "∫",
       there4: "∴",
       sim: "∼",
       cong: "≅",
       asymp: "≈",
       ne: "≠",
       equiv: "≡",
       le: "≤",
       ge: "≥",
       sub: "⊂",
       sup: "⊃",
       nsub: "⊄",
       sube: "⊆",
       supe: "⊇",
       oplus: "⊕",
       otimes: "⊗",
       perp: "⊥",
       sdot: "⋅",
       Alpha: "Α",
       Beta: "Β",
       Gamma: "Γ",
       Delta: "Δ",
       Epsilon: "Ε",
       Zeta: "Ζ",
       Eta: "Η",
       Theta: "Θ",
       Iota: "Ι",
       Kappa: "Κ",
       Lambda: "Λ",
       Mu: "Μ",
       Nu: "Ν",
       Xi: "Ξ",
       Omicron: "Ο",
       Pi: "Π",
       Rho: "Ρ",
       Sigma: "Σ",
       Tau: "Τ",
       Upsilon: "Υ",
       Phi: "Φ",
       Chi: "Χ",
       Psi: "Ψ",
       Omega: "Ω",
       alpha: "α",
       beta: "β",
       gamma: "γ",
       delta: "δ",
       epsilon: "ε",
       zeta: "ζ",
       eta: "η",
       theta: "θ",
       iota: "ι",
       kappa: "κ",
       lambda: "λ",
       mu: "μ",
       nu: "ν",
       xi: "ξ",
       omicron: "ο",
       pi: "π",
       rho: "ρ",
       sigmaf: "ς",
       sigma: "σ",
       tau: "τ",
       upsilon: "υ",
       phi: "φ",
       chi: "χ",
       psi: "ψ",
       omega: "ω",
       thetasym: "ϑ",
       upsih: "ϒ",
       piv: "ϖ",
       OElig: "Œ",
       oelig: "œ",
       Scaron: "Š",
       scaron: "š",
       Yuml: "Ÿ",
       fnof: "ƒ",
       circ: "ˆ",
       tilde: "˜",
       ensp: " ",
       emsp: " ",
       thinsp: " ",
       zwnj: "‌",
       zwj: "‍",
       lrm: "‎",
       rlm: "‏",
       ndash: "–",
       mdash: "—",
       lsquo: "‘",
       rsquo: "’",
       sbquo: "‚",
       ldquo: "“",
       rdquo: "”",
       bdquo: "„",
       dagger: "†",
       Dagger: "‡",
       bull: "•",
       hellip: "…",
       permil: "‰",
       prime: "′",
       Prime: "″",
       lsaquo: "‹",
       rsaquo: "›",
       oline: "‾",
       euro: "€",
       trade: "™",
       larr: "←",
       uarr: "↑",
       rarr: "→",
       darr: "↓",
       harr: "↔",
       crarr: "↵",
       lceil: "⌈",
       rceil: "⌉",
       lfloor: "⌊",
       rfloor: "⌋",
       loz: "◊",
       spades: "♠",
       clubs: "♣",
       hearts: "♥",
       diams: "♦"
});

/**
 * @deprecated use `HTML_ENTITIES` instead
 * @see HTML_ENTITIES
 */
exports.entityMap = exports.HTML_ENTITIES;
}(entities$1));

var sax$1 = {};

var NAMESPACE$2 = conventions$2.NAMESPACE;

//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;//\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring 
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

/**
 * Creates an error that will not be caught by XMLReader aka the SAX parser.
 *
 * @param {string} message
 * @param {any?} locator Optional, can provide details about the location in the source
 * @constructor
 */
function ParseError$1(message, locator) {
	this.message = message;
	this.locator = locator;
	if(Error.captureStackTrace) Error.captureStackTrace(this, ParseError$1);
}
ParseError$1.prototype = new Error();
ParseError$1.prototype.name = ParseError$1.name;

function XMLReader$1(){
	
}

XMLReader$1.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {});
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
};
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k]; 
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else {
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end;
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g;
	var locator = domBuilder.locator;
	
	var parseStack = [{currentNSMap:defaultNSMapCopy}];
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, '');
				var config = parseStack.pop();
				if(end<0){
					
	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase();
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for(var prefix in localNSMap){
							domBuilder.endPrefixMapping(prefix) ;
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName ); // No known test case
					}
		        }else {
		        	parseStack.push(config);
		        }
				
				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;
				
				
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					domBuilder.locator = locator2;
					if(appendElement$1(el,domBuilder,currentNSMap)){
						parseStack.push(el);
					}
					domBuilder.locator = locator;
				}else {
					if(appendElement$1(el,domBuilder,currentNSMap)){
						parseStack.push(el);
					}
				}

				if (NAMESPACE$2.isHTML(el.uri) && !el.closed) {
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder);
				} else {
					end++;
				}
			}
		}catch(e){
			if (e instanceof ParseError$1) {
				throw e;
			}
			errorHandler.error('element parse error: '+e);
			end = -1;
		}
		if(end>start){
			start = end;
		}else {
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){

	/**
	 * @param {string} qname
	 * @param {string} value
	 * @param {number} startIndex
	 */
	function addAttribute(qname, value, startIndex) {
		if (qname in el.attributeNames) errorHandler.fatalError('Attribute ' + qname + ' redefined');
		el.addValue(qname, value, startIndex);
	}
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else {
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName'); // No known test case
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="');
					attrName = source.slice(start,p);
				}
				start = p+1;
				p = source.indexOf(c,start);
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					addAttribute(attrName, value, start-1);
					s = S_ATTR_END;
				}else {
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				addAttribute(attrName, value, start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END;
			}else {
				//fatalError: no equal before
				throw new Error('attribute value must after "="'); // No known test case
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
			case S_ATTR_SPACE:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')") // No known test case
			}
			break;
		case ''://end document
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1);
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!');
					addAttribute(attrName, value.replace(/&#?\w+;/g,entityReplacer), start);
				}else {
					if(!NAMESPACE$2.isHTML(currentNSMap['']) || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!');
					}
					addAttribute(value, value, start);
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p);
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					addAttribute(attrName, value, start);
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else {//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					el.tagName;
					if (!NAMESPACE$2.isHTML(currentNSMap['']) || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!');
					}
					addAttribute(attrName, attrName, start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!');
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement$1(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName;
		}else {
			localName = qName;
			prefix = null;
			nsPrefix = qName === 'xmlns' && '';
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute 
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {};
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={});
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = NAMESPACE$2.XMLNS;
			domBuilder.startPrefixMapping(nsPrefix, value); 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = NAMESPACE$2.XML;
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || ''];
				
				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else {
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix); 
			}
		}
	}else {
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}
			
		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>');
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName);
		}
		closeMap[tagName] =pos;
	}
	return pos<elStartEnd;
	//} 
}
function _copy(source,target){
	for(var n in source){target[n] = source[n];}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2);
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else {
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else {
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA(); 
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = false;
			var sysid = false;
			if(len>3){
				if(/^public$/i.test(matchs[2][0])){
					pubid = matchs[3][0];
					sysid = len>4 && matchs[4][0];
				}else if(/^system$/i.test(matchs[2][0])){
					sysid = matchs[3][0];
				}
			}
			var lastMatch = matchs[len-1];
			domBuilder.startDTD(name, pubid, sysid);
			domBuilder.endDTD();
			
			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else {//error
			return -1;
		}
	}
	return -1;
}

function ElementAttributes(){
	this.attributeNames = {};
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName;
	},
	addValue:function(qName, value, offset) {
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this.attributeNames[qName] = this.length;
		this[this.length++] = {qName:qName,value:value,offset:offset};
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//			
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
};



function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

sax$1.XMLReader = XMLReader$1;
sax$1.ParseError = ParseError$1;

var dom = {};

var conventions$1 = conventions$2;

var NAMESPACE$1 = conventions$1.NAMESPACE;

/**
 * A prerequisite for `[].filter`, to drop elements that are empty
 * @param {string} input
 * @returns {boolean}
 */
function notEmptyString (input) {
	return input !== ''
}
/**
 * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
 * @see https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * @param {string} input
 * @returns {string[]} (can be empty)
 */
function splitOnASCIIWhitespace(input) {
	// U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, U+0020 SPACE
	return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : []
}

/**
 * Adds element as a key to current if it is not already present.
 *
 * @param {Record<string, boolean | undefined>} current
 * @param {string} element
 * @returns {Record<string, boolean | undefined>}
 */
function orderedSetReducer (current, element) {
	if (!current.hasOwnProperty(element)) {
		current[element] = true;
	}
	return current;
}

/**
 * @see https://infra.spec.whatwg.org/#ordered-set
 * @param {string} input
 * @returns {string[]}
 */
function toOrderedSet(input) {
	if (!input) return [];
	var list = splitOnASCIIWhitespace(input);
	return Object.keys(list.reduce(orderedSetReducer, {}))
}

/**
 * Uses `list.indexOf` to implement something like `Array.prototype.includes`,
 * which we can not rely on being available.
 *
 * @param {any[]} list
 * @returns {function(any): boolean}
 */
function arrayIncludes (list) {
	return function(element) {
		return list && list.indexOf(element) !== -1;
	}
}

function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}

/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(!(pt instanceof Super)){
		function t(){}		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknow Class:"+Class);
		}
		pt.constructor = Class;
	}
}

// Node Types
var NodeType = {};
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {};
var ExceptionMessage = {};
ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);

/**
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 */
function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else {
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
}DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException);

/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
}NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	}
};

function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh;
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
};

_extends(LiveNodeList,NodeList);

/**
 * Objects implementing the NamedNodeMap interface are used
 * to represent collections of nodes that can be accessed by name.
 * Note that NamedNodeMap does not inherit from NodeList;
 * NamedNodeMaps are not maintained in any particular order.
 * Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index,
 * but this is simply to allow convenient enumeration of the contents of a NamedNodeMap,
 * and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
}
function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else {
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1;
		while(i<lastIndex){
			list[i] = list[++i];
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else {
		throw DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};

/**
 * The DOMImplementation interface represents an object providing methods
 * which are not dependent on any particular document.
 * Such an object is returned by the `Document.implementation` property.
 *
 * __The individual methods describe the differences compared to the specs.__
 *
 * @constructor
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation MDN
 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490 DOM Level 1 Core (Initial)
 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-102161490 DOM Level 2 Core
 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-102161490 DOM Level 3 Core
 * @see https://dom.spec.whatwg.org/#domimplementation DOM Living Standard
 */
function DOMImplementation$1() {
}

DOMImplementation$1.prototype = {
	/**
	 * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
	 * The different implementations fairly diverged in what kind of features were reported.
	 * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
	 *
	 * @deprecated It is deprecated and modern browsers return true in all cases.
	 *
	 * @param {string} feature
	 * @param {string} [version]
	 * @returns {boolean} always true
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
	 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
	 */
	hasFeature: function(feature, version) {
			return true;
	},
	/**
	 * Creates an XML Document object of the specified type with its document element.
	 *
	 * __It behaves slightly different from the description in the living standard__:
	 * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
	 * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
	 * - this implementation is not validating names or qualified names
	 *   (when parsing XML strings, the SAX parser takes care of that)
	 *
	 * @param {string|null} namespaceURI
	 * @param {string} qualifiedName
	 * @param {DocumentType=null} doctype
	 * @returns {Document}
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
	 *
	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
	 */
	createDocument: function(namespaceURI,  qualifiedName, doctype){
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype || null;
		if (doctype){
			doc.appendChild(doctype);
		}
		if (qualifiedName){
			var root = doc.createElementNS(namespaceURI, qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	/**
	 * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
	 *
	 * __This behavior is slightly different from the in the specs__:
	 * - this implementation is not validating names or qualified names
	 *   (when parsing XML strings, the SAX parser takes care of that)
	 *
	 * @param {string} qualifiedName
	 * @param {string} [publicId]
	 * @param {string} [systemId]
	 * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
	 * 				  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
	 *
	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
	 */
	createDocumentType: function(qualifiedName, publicId, systemId){
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId || '';
		node.systemId = systemId || '';

		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
}
Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else {
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}

function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns === NAMESPACE$1.XMLNS){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value;
	}
}

function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns === NAMESPACE$1.XMLNS){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:''];
	}
}

function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else {
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else {
		parentNode.firstChild = next;
	}
	if(next){
		next.previousSibling = previous;
	}else {
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else {
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else {
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else {
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else {
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	doctype :  null,
	documentElement :  null,
	_inc : 1,

	insertBefore :  function(newChild, refChild){//raises
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == ELEMENT_NODE){
			this.documentElement = newChild;
		}

		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		});
		return rtv;
	},

	/**
	 * The `getElementsByClassName` method of `Document` interface returns an array-like object
	 * of all child elements which have **all** of the given class name(s).
	 *
	 * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
	 *
	 *
	 * Warning: This is a live LiveNodeList.
	 * Changes in the DOM will reflect in the array as the changes occur.
	 * If an element selected by this array no longer qualifies for the selector,
	 * it will automatically be removed. Be aware of this for iteration purposes.
	 *
	 * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
	 * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
	 */
	getElementsByClassName: function(classNames) {
		var classNamesSet = toOrderedSet(classNames);
		return new LiveNodeList(this, function(base) {
			var ls = [];
			if (classNamesSet.length > 0) {
				_visitNode(base.documentElement, function(node) {
					if(node !== base && node.nodeType === ELEMENT_NODE) {
						var nodeClassNames = node.getAttribute('class');
						// can be null if the attribute does not exist
						if (nodeClassNames) {
							// before splitting and iterating just compare them for the most common case
							var matches = classNames === nodeClassNames;
							if (!matches) {
								var nodeClassNamesSet = toOrderedSet(nodeClassNames);
								matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet));
							}
							if(matches) {
								ls.push(node);
							}
						}
					}
				});
			}
			return ls;
		});
	},

	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.localName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data);
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data);
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data);
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else {
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else {
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
}Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr);
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name);
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else {
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr);
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
			
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
}Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
}CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
};
_extends(CharacterData,Node);
function Text() {
}Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
};
_extends(Text,CharacterData);
function Comment() {
}Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
};
_extends(Comment,CharacterData);

function CDATASection() {
}CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
};
_extends(CDATASection,CharacterData);


function DocumentType() {
}DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
}Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
}Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
}EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
}DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
};
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9 && this.documentElement || this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;
	
	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			];
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}

function needNamespaceDefine(node, isHTML, visibleNamespaces) {
	var prefix = node.prefix || '';
	var uri = node.namespaceURI;
	// According to [Namespaces in XML 1.0](https://www.w3.org/TR/REC-xml-names/#ns-using) ,
	// and more specifically https://www.w3.org/TR/REC-xml-names/#nsc-NoPrefixUndecl :
	// > In a namespace declaration for a prefix [...], the attribute value MUST NOT be empty.
	// in a similar manner [Namespaces in XML 1.1](https://www.w3.org/TR/xml-names11/#ns-using)
	// and more specifically https://www.w3.org/TR/xml-names11/#nsc-NSDeclared :
	// > [...] Furthermore, the attribute value [...] must not be an empty string.
	// so serializing empty namespace value like xmlns:ds="" would produce an invalid XML document.
	if (!uri) {
		return false;
	}
	if (prefix === "xml" && uri === NAMESPACE$1.XML || uri === NAMESPACE$1.XMLNS) {
		return false;
	}
	
	var i = visibleNamespaces.length; 
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		if (ns.prefix === prefix) {
			return ns.namespace !== uri;
		}
	}
	return true;
}
/**
 * Well-formed constraint: No < in Attribute Values
 * The replacement text of any entity referred to directly or indirectly in an attribute value must not contain a <.
 * @see https://www.w3.org/TR/xml/#CleanAttrVals
 * @see https://www.w3.org/TR/xml/#NT-AttValue
 */
function addSerializedAttribute(buf, qualifiedName, value) {
	buf.push(' ', qualifiedName, '="', value.replace(/[<&"]/g,_xmlEncoder), '"');
}

function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if (!visibleNamespaces) {
		visibleNamespaces = [];
	}

	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else {
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}

	switch(node.nodeType){
	case ELEMENT_NODE:
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		
		isHTML = NAMESPACE$1.isHTML(node.namespaceURI) || isHTML;

		var prefixedNodeName = nodeName;
		if (!isHTML && !node.prefix && node.namespaceURI) {
			var defaultNS;
			for (var ai = 0; ai < attrs.length; ai++) {
				if (attrs.item(ai).name === 'xmlns') {
					defaultNS = attrs.item(ai).value;
					break
				}
			}
			if (defaultNS !== node.namespaceURI) {
				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
					var namespace = visibleNamespaces[nsi];
					if (namespace.namespace === node.namespaceURI) {
						if (namespace.prefix) {
							prefixedNodeName = namespace.prefix + ':' + nodeName;
						}
						break
					}
				}
			}
		}

		buf.push('<', prefixedNodeName);

		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}

		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}

		// add namespace for current node		
		if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
			visibleNamespaces.push({ prefix: prefix, namespace:uri });
		}
		
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else {
						serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					child = child.nextSibling;
				}
			}
			buf.push('</',prefixedNodeName,'>');
		}else {
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return addSerializedAttribute(buf, node.name, node.value);
	case TEXT_NODE:
		/**
		 * The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
		 * except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
		 * If they are needed elsewhere, they must be escaped using either numeric character references or the strings
		 * `&amp;` and `&lt;` respectively.
		 * The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
		 * be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
		 * when that string is not marking the end of a CDATA section.
		 *
		 * In the content of elements, character data is any string of characters
		 * which does not contain the start-delimiter of any markup
		 * and does not include the CDATA-section-close delimiter, `]]>`.
		 *
		 * @see https://www.w3.org/TR/xml/#NT-CharData
		 */
		return buf.push(node.data
			.replace(/[<&]/g,_xmlEncoder)
			.replace(/]]>/g, ']]&gt;')
		);
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC ', pubid);
			if (sysid && sysid!='.') {
				buf.push(' ', sysid);
			}
			buf.push('>');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM ', sysid, '>');
		}else {
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length;
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value;
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});

		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},

			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;

				default:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		});
		
		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}

		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value;
		};
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	dom.DocumentType = DocumentType;
	dom.DOMException = DOMException;
	dom.DOMImplementation = DOMImplementation$1;
	dom.Element = Element;
	dom.Node = Node;
	dom.NodeList = NodeList;
	dom.XMLSerializer = XMLSerializer;

var conventions = conventions$2;
var entities = entities$1;

var NAMESPACE = conventions.NAMESPACE;

function DOMParser(options){
	this.options = options ||{locator:{}};
}

DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var isHTML = /\/x?html?$/.test(mimeType);//mimeType.toLowerCase().indexOf('html') > -1;
  	var entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES;
	if(locator){
		domBuilder.setDocumentLocator(locator);
	}

	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(isHTML){
		defaultNSMap[''] = NAMESPACE.HTML;
	}
	defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
	if(source && typeof source === 'string'){
		sax.parse(source,defaultNSMap,entityMap);
	}else {
		sax.errorHandler.error("invalid doc source");
	}
	return domBuilder.doc;
};
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {};
	var isCallback = errorImpl instanceof Function;
	locator = locator||{};
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg);}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler
 *
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;

		this.locator && position(this.locator,el);
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr);
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement;
		current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins);
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments);
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode);
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments);
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm);
	    appendElement(this, comm);
	},

	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},

	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt);
	        appendElement(this, dt);
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		throw new ParseError(error, this.locator);
	}
};
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else {//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null};
});

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

//if(typeof require == 'function'){
var sax = sax$1;
var XMLReader = sax.XMLReader;
var ParseError = sax.ParseError;
var DOMImplementation = domParser.DOMImplementation = dom.DOMImplementation;
domParser.XMLSerializer = dom.XMLSerializer ;
domParser.DOMParser = DOMParser;
domParser.__DOMHandler = DOMHandler;

var parseJson$1 = {};

Object.defineProperty(parseJson$1, "__esModule", { value: true });
parseJson$1.parseJson = void 0;
/**
 * Parses a given string into JSON.
 * Gracefully handles invalid JSON by returning `null`.
 */
function parseJson(data) {
    try {
        var json = JSON.parse(data);
        return json;
    }
    catch (_) {
        return null;
    }
}
parseJson$1.parseJson = parseJson;

var bufferFrom$1 = {};

Object.defineProperty(bufferFrom$1, "__esModule", { value: true });
bufferFrom$1.bufferFrom = void 0;
/**
 * Convert a given string into a `Uint8Array`.
 * We don't use `TextEncoder` because it's unavailable in some environments.
 */
function bufferFrom(init) {
    var encodedString = encodeURIComponent(init);
    var binaryString = encodedString.replace(/%([0-9A-F]{2})/g, function (_, char) {
        return String.fromCharCode(('0x' + char));
    });
    var buffer = new Uint8Array(binaryString.length);
    Array.prototype.forEach.call(binaryString, function (char, index) {
        buffer[index] = char.charCodeAt(0);
    });
    return buffer;
}
bufferFrom$1.bufferFrom = bufferFrom;

var createEvent$1 = {};

var EventPolyfill$1 = {};

Object.defineProperty(EventPolyfill$1, "__esModule", { value: true });
EventPolyfill$1.EventPolyfill = void 0;
var EventPolyfill = /** @class */ (function () {
    function EventPolyfill(type, options) {
        this.AT_TARGET = 0;
        this.BUBBLING_PHASE = 0;
        this.CAPTURING_PHASE = 0;
        this.NONE = 0;
        this.type = '';
        this.srcElement = null;
        this.currentTarget = null;
        this.eventPhase = 0;
        this.isTrusted = true;
        this.composed = false;
        this.cancelable = true;
        this.defaultPrevented = false;
        this.bubbles = true;
        this.lengthComputable = true;
        this.loaded = 0;
        this.total = 0;
        this.cancelBubble = false;
        this.returnValue = true;
        this.type = type;
        this.target = (options === null || options === void 0 ? void 0 : options.target) || null;
        this.currentTarget = (options === null || options === void 0 ? void 0 : options.currentTarget) || null;
        this.timeStamp = Date.now();
    }
    EventPolyfill.prototype.composedPath = function () {
        return [];
    };
    EventPolyfill.prototype.initEvent = function (type, bubbles, cancelable) {
        this.type = type;
        this.bubbles = !!bubbles;
        this.cancelable = !!cancelable;
    };
    EventPolyfill.prototype.preventDefault = function () {
        this.defaultPrevented = true;
    };
    EventPolyfill.prototype.stopPropagation = function () { };
    EventPolyfill.prototype.stopImmediatePropagation = function () { };
    return EventPolyfill;
}());
EventPolyfill$1.EventPolyfill = EventPolyfill;

var ProgressEventPolyfill$1 = {};

var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(ProgressEventPolyfill$1, "__esModule", { value: true });
ProgressEventPolyfill$1.ProgressEventPolyfill = void 0;
var EventPolyfill_1$1 = EventPolyfill$1;
var ProgressEventPolyfill = /** @class */ (function (_super) {
    __extends(ProgressEventPolyfill, _super);
    function ProgressEventPolyfill(type, init) {
        var _this = _super.call(this, type) || this;
        _this.lengthComputable = (init === null || init === void 0 ? void 0 : init.lengthComputable) || false;
        _this.composed = (init === null || init === void 0 ? void 0 : init.composed) || false;
        _this.loaded = (init === null || init === void 0 ? void 0 : init.loaded) || 0;
        _this.total = (init === null || init === void 0 ? void 0 : init.total) || 0;
        return _this;
    }
    return ProgressEventPolyfill;
}(EventPolyfill_1$1.EventPolyfill));
ProgressEventPolyfill$1.ProgressEventPolyfill = ProgressEventPolyfill;

Object.defineProperty(createEvent$1, "__esModule", { value: true });
createEvent$1.createEvent = void 0;
var EventPolyfill_1 = EventPolyfill$1;
var ProgressEventPolyfill_1 = ProgressEventPolyfill$1;
var SUPPORTS_PROGRESS_EVENT = typeof ProgressEvent !== 'undefined';
function createEvent(target, type, init) {
    var progressEvents = [
        'error',
        'progress',
        'loadstart',
        'loadend',
        'load',
        'timeout',
        'abort',
    ];
    /**
     * `ProgressEvent` is not supported in React Native.
     * @see https://github.com/mswjs/interceptors/issues/40
     */
    var ProgressEventClass = SUPPORTS_PROGRESS_EVENT
        ? ProgressEvent
        : ProgressEventPolyfill_1.ProgressEventPolyfill;
    var event = progressEvents.includes(type)
        ? new ProgressEventClass(type, {
            lengthComputable: true,
            loaded: (init === null || init === void 0 ? void 0 : init.loaded) || 0,
            total: (init === null || init === void 0 ? void 0 : init.total) || 0,
        })
        : new EventPolyfill_1.EventPolyfill(type, {
            target: target,
            currentTarget: target,
        });
    return event;
}
createEvent$1.createEvent = createEvent;

var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (commonjsGlobal && commonjsGlobal.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(XMLHttpRequestOverride, "__esModule", { value: true });
XMLHttpRequestOverride.createXMLHttpRequestOverride = void 0;
/**
 * XMLHttpRequest override class.
 * Inspired by https://github.com/marvinhagemeister/xhr-mocklet.
 */
var until_1 = lib$2;
var headers_utils_1 = lib$4;
var xmldom_1 = domParser;
var parseJson_1 = parseJson$1;
var toIsoResponse_1 = toIsoResponse$1;
var uuid_1 = uuid;
var bufferFrom_1 = bufferFrom$1;
var createEvent_1 = createEvent$1;
var createDebug = require$$3;
var createXMLHttpRequestOverride = function (options) {
    var _a;
    var pureXMLHttpRequest = options.pureXMLHttpRequest, observer = options.observer, resolver = options.resolver;
    var debug = createDebug('XHR');
    return _a = /** @class */ (function () {
            function XMLHttpRequestOverride() {
                // Collection of events modified by `addEventListener`/`removeEventListener` calls.
                this._events = [];
                this.UNSENT = 0;
                this.OPENED = 1;
                this.HEADERS_RECEIVED = 2;
                this.LOADING = 3;
                this.DONE = 4;
                this.onreadystatechange = null;
                /* Events */
                this.onabort = null;
                this.onerror = null;
                this.onload = null;
                this.onloadend = null;
                this.onloadstart = null;
                this.onprogress = null;
                this.ontimeout = null;
                this.url = '';
                this.method = 'GET';
                this.readyState = this.UNSENT;
                this.withCredentials = false;
                this.status = 200;
                this.statusText = 'OK';
                this.data = '';
                this.response = '';
                this.responseType = 'text';
                this.responseText = '';
                this.responseXML = null;
                this.responseURL = '';
                this.upload = null;
                this.timeout = 0;
                this._requestHeaders = new headers_utils_1.Headers();
                this._responseHeaders = new headers_utils_1.Headers();
            }
            XMLHttpRequestOverride.prototype.setReadyState = function (nextState) {
                if (nextState === this.readyState) {
                    return;
                }
                debug('readyState change %d -> %d', this.readyState, nextState);
                this.readyState = nextState;
                if (nextState !== this.UNSENT) {
                    debug('triggerring readystate change...');
                    this.trigger('readystatechange');
                }
            };
            /**
             * Triggers both direct callback and attached event listeners
             * for the given event.
             */
            XMLHttpRequestOverride.prototype.trigger = function (eventName, options) {
                var e_1, _a;
                debug('trigger "%s" (%d)', eventName, this.readyState);
                debug('resolve listener for event "%s"', eventName);
                // @ts-expect-error XMLHttpRequest class has no index signature.
                var callback = this["on" + eventName];
                callback === null || callback === void 0 ? void 0 : callback.call(this, createEvent_1.createEvent(this, eventName, options));
                try {
                    for (var _b = __values(this._events), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var event_1 = _c.value;
                        if (event_1.name === eventName) {
                            debug('calling mock event listener "%s" (%d)', eventName, this.readyState);
                            event_1.listener.call(this, createEvent_1.createEvent(this, eventName, options));
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return this;
            };
            XMLHttpRequestOverride.prototype.reset = function () {
                debug('reset');
                this.setReadyState(this.UNSENT);
                this.status = 200;
                this.statusText = 'OK';
                this.data = '';
                this.response = null;
                this.responseText = null;
                this.responseXML = null;
                this._requestHeaders = new headers_utils_1.Headers();
                this._responseHeaders = new headers_utils_1.Headers();
            };
            XMLHttpRequestOverride.prototype.open = function (method, url, async, user, password) {
                if (async === void 0) { async = true; }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        debug = createDebug("XHR " + method + " " + url);
                        debug('open', { method: method, url: url, async: async, user: user, password: password });
                        this.reset();
                        this.setReadyState(this.OPENED);
                        if (typeof url === 'undefined') {
                            this.url = method;
                            this.method = 'GET';
                        }
                        else {
                            this.url = url;
                            this.method = method;
                            this.async = async;
                            this.user = user;
                            this.password = password;
                        }
                        return [2 /*return*/];
                    });
                });
            };
            XMLHttpRequestOverride.prototype.send = function (data) {
                var _this = this;
                debug('send %s %s', this.method, this.url);
                this.data = data || '';
                var url;
                try {
                    url = new URL(this.url);
                }
                catch (error) {
                    // Assume a relative URL, if construction of a new `URL` instance fails.
                    // Since `XMLHttpRequest` always executed in a DOM-like environment,
                    // resolve the relative request URL against the current window location.
                    url = new URL(this.url, window.location.href);
                }
                debug('request headers', this._requestHeaders);
                // Create an intercepted request instance exposed to the request intercepting middleware.
                var isoRequest = {
                    id: uuid_1.uuidv4(),
                    url: url,
                    method: this.method,
                    body: this.data,
                    headers: this._requestHeaders,
                };
                observer.emit('request', isoRequest);
                debug('awaiting mocked response...');
                Promise.resolve(until_1.until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, resolver(isoRequest, this)];
                }); }); })).then(function (_a) {
                    var _b;
                    var _c = __read(_a, 2), middlewareException = _c[0], mockedResponse = _c[1];
                    // When the request middleware throws an exception, error the request.
                    // This cancels the request and is similar to a network error.
                    if (middlewareException) {
                        debug('middleware function threw an exception!', middlewareException);
                        // No way to propagate the actual error message.
                        _this.trigger('error');
                        _this.abort();
                        return;
                    }
                    // Return a mocked response, if provided in the middleware.
                    if (mockedResponse) {
                        debug('received mocked response', mockedResponse);
                        // Trigger a loadstart event to indicate the initialization of the fetch.
                        _this.trigger('loadstart');
                        _this.status = mockedResponse.status || 200;
                        _this.statusText = mockedResponse.statusText || 'OK';
                        _this._responseHeaders = mockedResponse.headers
                            ? headers_utils_1.objectToHeaders(mockedResponse.headers)
                            : new headers_utils_1.Headers();
                        debug('set response status', _this.status, _this.statusText);
                        debug('set response headers', _this._responseHeaders);
                        // Mark that response headers has been received
                        // and trigger a ready state event to reflect received headers
                        // in a custom `onreadystatechange` callback.
                        _this.setReadyState(_this.HEADERS_RECEIVED);
                        debug('response type', _this.responseType);
                        _this.response = _this.getResponseBody(mockedResponse.body);
                        _this.responseText = mockedResponse.body || '';
                        _this.responseXML = _this.getResponseXML();
                        debug('set response body', _this.response);
                        if (mockedResponse.body && _this.response) {
                            _this.setReadyState(_this.LOADING);
                            // Presense of the mocked response implies a response body (not null).
                            // Presense of the coerced `this.response` implies the mocked body is valid.
                            var bodyBuffer = bufferFrom_1.bufferFrom(mockedResponse.body);
                            // Trigger a progress event based on the mocked response body.
                            _this.trigger('progress', {
                                loaded: bodyBuffer.length,
                                total: bodyBuffer.length,
                            });
                        }
                        /**
                         * Explicitly mark the request as done so its response never hangs.
                         * @see https://github.com/mswjs/interceptors/issues/13
                         */
                        _this.setReadyState(_this.DONE);
                        // Trigger a load event to indicate the fetch has succeeded.
                        _this.trigger('load');
                        // Trigger a loadend event to indicate the fetch has completed.
                        _this.trigger('loadend');
                        observer.emit('response', isoRequest, toIsoResponse_1.toIsoResponse(mockedResponse));
                    }
                    else {
                        debug('no mocked response received!');
                        // Perform an original request, when the request middleware returned no mocked response.
                        var originalRequest_1 = new pureXMLHttpRequest();
                        debug('opening an original request %s %s', _this.method, _this.url);
                        originalRequest_1.open(_this.method, _this.url, (_b = _this.async) !== null && _b !== void 0 ? _b : true, _this.user, _this.password);
                        // Reflect a successful state of the original request
                        // on the patched instance.
                        originalRequest_1.addEventListener('load', function () {
                            debug('original "onload"');
                            _this.status = originalRequest_1.status;
                            _this.statusText = originalRequest_1.statusText;
                            _this.responseURL = originalRequest_1.responseURL;
                            _this.responseType = originalRequest_1.responseType;
                            _this.response = originalRequest_1.response;
                            _this.responseText = originalRequest_1.responseText;
                            _this.responseXML = originalRequest_1.responseXML;
                            debug('set mock request readyState to DONE');
                            // Explicitly mark the mocked request instance as done
                            // so the response never hangs.
                            /**
                             * @note `readystatechange` listener is called TWICE
                             * in the case of unhandled request.
                             */
                            _this.setReadyState(_this.DONE);
                            debug('received original response', _this.status, _this.statusText);
                            debug('original response body:', _this.response);
                            var responseHeaders = originalRequest_1.getAllResponseHeaders();
                            debug('original response headers:\n', responseHeaders);
                            _this._responseHeaders = headers_utils_1.stringToHeaders(responseHeaders);
                            debug('original response headers (normalized)', _this._responseHeaders);
                            debug('original response finished');
                            observer.emit('response', isoRequest, {
                                status: originalRequest_1.status,
                                statusText: originalRequest_1.statusText,
                                headers: _this._responseHeaders,
                                body: originalRequest_1.response,
                            });
                        });
                        // Assign callbacks and event listeners from the intercepted XHR instance
                        // to the original XHR instance.
                        _this.propagateCallbacks(originalRequest_1);
                        _this.propagateListeners(originalRequest_1);
                        _this.propagateHeaders(originalRequest_1, _this._requestHeaders);
                        if (_this.async) {
                            originalRequest_1.timeout = _this.timeout;
                        }
                        debug('send', _this.data);
                        originalRequest_1.send(_this.data);
                    }
                });
            };
            XMLHttpRequestOverride.prototype.abort = function () {
                debug('abort');
                if (this.readyState > this.UNSENT && this.readyState < this.DONE) {
                    this.setReadyState(this.UNSENT);
                    this.trigger('abort');
                }
            };
            XMLHttpRequestOverride.prototype.dispatchEvent = function () {
                return false;
            };
            XMLHttpRequestOverride.prototype.setRequestHeader = function (name, value) {
                debug('set request header "%s" to "%s"', name, value);
                this._requestHeaders.append(name, value);
            };
            XMLHttpRequestOverride.prototype.getResponseHeader = function (name) {
                debug('get response header "%s"', name);
                if (this.readyState < this.HEADERS_RECEIVED) {
                    debug('cannot return a header: headers not received (state: %s)', this.readyState);
                    return null;
                }
                var headerValue = this._responseHeaders.get(name);
                debug('resolved response header "%s" to "%s"', name, headerValue, this._responseHeaders);
                return headerValue;
            };
            XMLHttpRequestOverride.prototype.getAllResponseHeaders = function () {
                debug('get all response headers');
                if (this.readyState < this.HEADERS_RECEIVED) {
                    debug('cannot return headers: headers not received (state: %s)', this.readyState);
                    return '';
                }
                return headers_utils_1.headersToString(this._responseHeaders);
            };
            XMLHttpRequestOverride.prototype.addEventListener = function (name, listener) {
                debug('addEventListener', name, listener);
                this._events.push({
                    name: name,
                    listener: listener,
                });
            };
            XMLHttpRequestOverride.prototype.removeEventListener = function (name, listener) {
                debug('removeEventListener', name, listener);
                this._events = this._events.filter(function (storedEvent) {
                    return storedEvent.name !== name && storedEvent.listener !== listener;
                });
            };
            XMLHttpRequestOverride.prototype.overrideMimeType = function () { };
            /**
             * Resolves the response based on the `responseType` value.
             */
            XMLHttpRequestOverride.prototype.getResponseBody = function (body) {
                // Handle an improperly set "null" value of the mocked response body.
                var textBody = body !== null && body !== void 0 ? body : '';
                debug('coerced response body to', textBody);
                switch (this.responseType) {
                    case 'json': {
                        debug('resolving response body as JSON');
                        return parseJson_1.parseJson(textBody);
                    }
                    case 'blob': {
                        var blobType = this.getResponseHeader('content-type') || 'text/plain';
                        debug('resolving response body as Blob', { type: blobType });
                        return new Blob([textBody], {
                            type: blobType,
                        });
                    }
                    case 'arraybuffer': {
                        debug('resolving response body as ArrayBuffer');
                        var arrayBuffer = bufferFrom_1.bufferFrom(textBody);
                        return arrayBuffer;
                    }
                    default:
                        return textBody;
                }
            };
            XMLHttpRequestOverride.prototype.getResponseXML = function () {
                var contentType = this.getResponseHeader('Content-Type');
                if (contentType === 'application/xml' || contentType === 'text/xml') {
                    return new xmldom_1.DOMParser().parseFromString(this.responseText, contentType);
                }
                return null;
            };
            /**
             * Propagates mock XMLHttpRequest instance callbacks
             * to the given XMLHttpRequest instance.
             */
            XMLHttpRequestOverride.prototype.propagateCallbacks = function (request) {
                request.onabort = this.abort;
                request.onerror = this.onerror;
                request.ontimeout = this.ontimeout;
                request.onload = this.onload;
                request.onloadstart = this.onloadstart;
                request.onloadend = this.onloadend;
                request.onprogress = this.onprogress;
                request.onreadystatechange = this.onreadystatechange;
            };
            /**
             * Propagates the mock XMLHttpRequest instance listeners
             * to the given XMLHttpRequest instance.
             */
            XMLHttpRequestOverride.prototype.propagateListeners = function (request) {
                debug('propagating request listeners (%d) to the original request', this._events.length, this._events);
                this._events.forEach(function (_a) {
                    var name = _a.name, listener = _a.listener;
                    request.addEventListener(name, listener);
                });
            };
            XMLHttpRequestOverride.prototype.propagateHeaders = function (request, headers) {
                debug('propagating request headers to the original request', headers);
                // Preserve the request headers casing.
                Object.entries(headers.raw()).forEach(function (_a) {
                    var _b = __read(_a, 2), name = _b[0], value = _b[1];
                    debug('setting "%s" (%s) header on the original request', name, value);
                    request.setRequestHeader(name, value);
                });
            };
            return XMLHttpRequestOverride;
        }()),
        /* Request state */
        _a.UNSENT = 0,
        _a.OPENED = 1,
        _a.HEADERS_RECEIVED = 2,
        _a.LOADING = 3,
        _a.DONE = 4,
        _a;
};
XMLHttpRequestOverride.createXMLHttpRequestOverride = createXMLHttpRequestOverride;

Object.defineProperty(XMLHttpRequest, "__esModule", { value: true });
var interceptXMLHttpRequest_1 = XMLHttpRequest.interceptXMLHttpRequest = void 0;
var XMLHttpRequestOverride_1 = XMLHttpRequestOverride;
var debug = require$$3('XHR');
var pureXMLHttpRequest = 
// Although executed in node, certain processes emulate the DOM-like environment
// (i.e. `js-dom` in Jest). The `window` object would be avilable in such environments.
typeof window === 'undefined' ? undefined : window.XMLHttpRequest;
/**
 * Intercepts requests issued via `XMLHttpRequest`.
 */
var interceptXMLHttpRequest = function (observer, resolver) {
    if (pureXMLHttpRequest) {
        debug('patching "XMLHttpRequest" module...');
        var XMLHttpRequestOverride = XMLHttpRequestOverride_1.createXMLHttpRequestOverride({
            pureXMLHttpRequest: pureXMLHttpRequest,
            observer: observer,
            resolver: resolver,
        });
        window.XMLHttpRequest = XMLHttpRequestOverride;
    }
    return function () {
        if (pureXMLHttpRequest) {
            debug('restoring modules...');
            window.XMLHttpRequest = pureXMLHttpRequest;
        }
    };
};
interceptXMLHttpRequest_1 = XMLHttpRequest.interceptXMLHttpRequest = interceptXMLHttpRequest;

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Converts a given isomorphic request to a `MockedRequest` instance.
 */
function parseIsomorphicRequest(request) {
    const requestId = uuidv4();
    request.headers.set('x-msw-request-id', requestId);
    const mockedRequest = {
        id: requestId,
        url: request.url,
        method: request.method,
        body: parseBody(request.body, request.headers),
        headers: request.headers,
        cookies: {},
        redirect: 'manual',
        referrer: '',
        keepalive: false,
        cache: 'default',
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        integrity: '',
        destination: 'document',
        bodyUsed: false,
        credentials: 'same-origin',
    };
    // Set mocked request cookies from the `cookie` header of the original request.
    // No need to take `credentials` into account, because in Node.js requests are intercepted
    // _after_ they happen. Request issuer should have already taken care of sending relevant cookies.
    // Unlike browser, where interception is on the worker level, _before_ the request happens.
    const requestCookiesString = request.headers.get('cookie');
    // Attach all the cookies from the virtual cookie store.
    setRequestCookies(mockedRequest);
    const requestCookies = requestCookiesString
        ? parse_1(requestCookiesString)
        : {};
    // Merge both direct request cookies and the cookies inherited
    // from other same-origin requests in the cookie store.
    mockedRequest.cookies = Object.assign(Object.assign({}, mockedRequest.cookies), requestCookies);
    return mockedRequest;
}

function createFallbackRequestListener(context, options) {
    const interceptor = lib.createInterceptor({
        modules: [interceptFetch_1, interceptXMLHttpRequest_1],
        resolver(request) {
            return __awaiter$3(this, void 0, void 0, function* () {
                const mockedRequest = parseIsomorphicRequest(request);
                return handleRequest(mockedRequest, context.requestHandlers, options, context.emitter, {
                    transformResponse(response) {
                        return {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers.all(),
                            body: response.body,
                        };
                    },
                    onMockedResponseSent(response, { handler, publicRequest, parsedRequest }) {
                        if (!options.quiet) {
                            handler.log(publicRequest, response, handler, parsedRequest);
                        }
                    },
                });
            });
        },
    });
    interceptor.apply();
    return interceptor;
}

function createFallbackStart(context) {
    return function start(options) {
        return __awaiter$3(this, void 0, void 0, function* () {
            context.fallbackInterceptor = createFallbackRequestListener(context, options);
            printStartMessage({
                message: 'Mocking enabled (fallback mode).',
                quiet: options.quiet,
            });
            return undefined;
        });
    };
}

function createFallbackStop(context) {
    return function stop() {
        var _a, _b;
        (_a = context.fallbackInterceptor) === null || _a === void 0 ? void 0 : _a.restore();
        printStopMessage({ quiet: (_b = context.startOptions) === null || _b === void 0 ? void 0 : _b.quiet });
    };
}

/**
 * Pipes all emitted events from one emitter to another.
 */
function pipeEvents(source, destination) {
    const rawEmit = source.emit;
    // @ts-ignore
    if (rawEmit._isPiped) {
        return;
    }
    source.emit = function (event, ...data) {
        destination.emit(event, ...data);
        return rawEmit.call(this, event, ...data);
    };
    // @ts-ignore
    source.emit._isPiped = true;
}

// Declare the list of event handlers on the module's scope
// so it persists between Fash refreshes of the application's code.
let listeners = [];
/**
 * Creates a new mock Service Worker registration
 * with the given request handlers.
 * @param {RequestHandler[]} requestHandlers List of request handlers
 * @see {@link https://mswjs.io/docs/api/setup-worker `setupWorker`}
 */
function setupWorker(...requestHandlers) {
    requestHandlers.forEach((handler) => {
        if (Array.isArray(handler))
            throw new Error(devUtils.formatMessage('Failed to call "setupWorker" given an Array of request handlers (setupWorker([a, b])), expected to receive each handler individually: setupWorker(a, b).'));
    });
    // Error when attempting to run this function in a Node.js environment.
    if (lib$6.exports.isNodeProcess()) {
        throw new Error(devUtils.formatMessage('Failed to execute `setupWorker` in a non-browser environment. Consider using `setupServer` for Node.js environment instead.'));
    }
    const emitter = new lib$3.StrictEventEmitter();
    const publicEmitter = new lib$3.StrictEventEmitter();
    pipeEvents(emitter, publicEmitter);
    const context = {
        startOptions: undefined,
        worker: null,
        registration: null,
        requestHandlers: [...requestHandlers],
        emitter,
        workerChannel: {
            on(eventType, callback) {
                context.events.addListener(navigator.serviceWorker, 'message', (event) => {
                    // Avoid messages broadcasted from unrelated workers.
                    if (event.source !== context.worker) {
                        return;
                    }
                    const message = jsonParse(event.data);
                    if (!message) {
                        return;
                    }
                    if (message.type === eventType) {
                        callback(event, message);
                    }
                });
            },
            send(type) {
                var _a;
                (_a = context.worker) === null || _a === void 0 ? void 0 : _a.postMessage(type);
            },
        },
        events: {
            addListener(target, eventType, callback) {
                target.addEventListener(eventType, callback);
                listeners.push({ eventType, target, callback });
                return () => {
                    target.removeEventListener(eventType, callback);
                };
            },
            removeAllListeners() {
                for (const { target, eventType, callback } of listeners) {
                    target.removeEventListener(eventType, callback);
                }
                listeners = [];
            },
            once(eventType) {
                const bindings = [];
                return new Promise((resolve, reject) => {
                    const handleIncomingMessage = (event) => {
                        try {
                            const message = JSON.parse(event.data);
                            if (message.type === eventType) {
                                resolve(message);
                            }
                        }
                        catch (error) {
                            reject(error);
                        }
                    };
                    bindings.push(context.events.addListener(navigator.serviceWorker, 'message', handleIncomingMessage), context.events.addListener(navigator.serviceWorker, 'messageerror', reject));
                }).finally(() => {
                    bindings.forEach((unbind) => unbind());
                });
            },
        },
        useFallbackMode: !('serviceWorker' in navigator) || location.protocol === 'file:',
    };
    const startHandler = context.useFallbackMode
        ? createFallbackStart(context)
        : createStartHandler(context);
    const stopHandler = context.useFallbackMode
        ? createFallbackStop(context)
        : createStop(context);
    return {
        start: prepareStartHandler(startHandler, context),
        stop() {
            context.events.removeAllListeners();
            context.emitter.removeAllListeners();
            publicEmitter.removeAllListeners();
            stopHandler();
        },
        use(...handlers) {
            use(context.requestHandlers, ...handlers);
        },
        restoreHandlers() {
            restoreHandlers(context.requestHandlers);
        },
        resetHandlers(...nextHandlers) {
            context.requestHandlers = resetHandlers(requestHandlers, ...nextHandlers);
        },
        printHandlers() {
            context.requestHandlers.forEach((handler) => {
                const { header, callFrame } = handler.info;
                const pragma = handler.info.hasOwnProperty('operationType')
                    ? '[graphql]'
                    : '[rest]';
                console.groupCollapsed(`${pragma} ${header}`);
                if (callFrame) {
                    console.log(`Declaration: ${callFrame}`);
                }
                console.log('Handler:', handler);
                if (handler instanceof RestHandler) {
                    console.log('Match:', `https://mswjs.io/repl?path=${handler.info.path}`);
                }
                console.groupEnd();
            });
        },
        events: {
            on(...args) {
                return publicEmitter.on(...args);
            },
            removeListener(...args) {
                return publicEmitter.removeListener(...args);
            },
            removeAllListeners(...args) {
                return publicEmitter.removeAllListeners(...args);
            },
        },
    };
}

export { handleRequest, parseIsomorphicRequest, setupWorker };
