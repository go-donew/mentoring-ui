var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// node_modules/.pnpm/umbrellajs@3.3.1/node_modules/umbrellajs/umbrella.min.js
var require_umbrella_min = __commonJS({
  "node_modules/.pnpm/umbrellajs@3.3.1/node_modules/umbrellajs/umbrella.min.js"(exports, module) {
    var u = function(t, e) {
      return this instanceof u ? t instanceof u ? t : ((t = typeof t == "string" ? this.select(t, e) : t) && t.nodeName && (t = [t]), void (this.nodes = this.slice(t))) : new u(t, e);
    };
    u.prototype = { get length() {
      return this.nodes.length;
    } }, u.prototype.nodes = [], u.prototype.addClass = function() {
      return this.eacharg(arguments, function(t, e) {
        t.classList.add(e);
      });
    }, u.prototype.adjacent = function(o, t, i) {
      return typeof t == "number" && (t = t === 0 ? [] : new Array(t).join().split(",").map(Number.call, Number)), this.each(function(n, r) {
        var e = document.createDocumentFragment();
        u(t || {}).map(function(t2, e2) {
          e2 = typeof o == "function" ? o.call(this, t2, e2, n, r) : o;
          return typeof e2 == "string" ? this.generate(e2) : u(e2);
        }).each(function(t2) {
          this.isInPage(t2) ? e.appendChild(u(t2).clone().first()) : e.appendChild(t2);
        }), i.call(this, n, e);
      });
    }, u.prototype.after = function(t, e) {
      return this.adjacent(t, e, function(t2, e2) {
        t2.parentNode.insertBefore(e2, t2.nextSibling);
      });
    }, u.prototype.append = function(t, e) {
      return this.adjacent(t, e, function(t2, e2) {
        t2.appendChild(e2);
      });
    }, u.prototype.args = function(t, e, n) {
      return (t = typeof (t = typeof t == "function" ? t(e, n) : t) != "string" ? this.slice(t).map(this.str(e, n)) : t).toString().split(/[\s,]+/).filter(function(t2) {
        return t2.length;
      });
    }, u.prototype.array = function(o) {
      var i = this;
      return this.nodes.reduce(function(t, e, n) {
        var r;
        return o ? (r = typeof (r = (r = o.call(i, e, n)) || false) == "string" ? u(r) : r) instanceof u && (r = r.nodes) : r = e.innerHTML, t.concat(r !== false ? r : []);
      }, []);
    }, u.prototype.attr = function(t, e, r) {
      return r = r ? "data-" : "", this.pairs(t, e, function(t2, e2) {
        return t2.getAttribute(r + e2);
      }, function(t2, e2, n) {
        n ? t2.setAttribute(r + e2, n) : t2.removeAttribute(r + e2);
      });
    }, u.prototype.before = function(t, e) {
      return this.adjacent(t, e, function(t2, e2) {
        t2.parentNode.insertBefore(e2, t2);
      });
    }, u.prototype.children = function(t) {
      return this.map(function(t2) {
        return this.slice(t2.children);
      }).filter(t);
    }, u.prototype.clone = function() {
      return this.map(function(t, e) {
        var n = t.cloneNode(true), r = this.getAll(n);
        return this.getAll(t).each(function(t2, e2) {
          for (var n2 in this.mirror)
            this.mirror[n2] && this.mirror[n2](t2, r.nodes[e2]);
        }), n;
      });
    }, u.prototype.getAll = function(t) {
      return u([t].concat(u("*", t).nodes));
    }, u.prototype.mirror = {}, u.prototype.mirror.events = function(t, e) {
      if (t._e)
        for (var n in t._e)
          t._e[n].forEach(function(t2) {
            u(e).on(n, t2.callback);
          });
    }, u.prototype.mirror.select = function(t, e) {
      u(t).is("select") && (e.value = t.value);
    }, u.prototype.mirror.textarea = function(t, e) {
      u(t).is("textarea") && (e.value = t.value);
    }, u.prototype.closest = function(e) {
      return this.map(function(t) {
        do {
          if (u(t).is(e))
            return t;
        } while ((t = t.parentNode) && t !== document);
      });
    }, u.prototype.data = function(t, e) {
      return this.attr(t, e, true);
    }, u.prototype.each = function(t) {
      return this.nodes.forEach(t.bind(this)), this;
    }, u.prototype.eacharg = function(n, r) {
      return this.each(function(e, t) {
        this.args(n, e, t).forEach(function(t2) {
          r.call(this, e, t2);
        }, this);
      });
    }, u.prototype.empty = function() {
      return this.each(function(t) {
        for (; t.firstChild; )
          t.removeChild(t.firstChild);
      });
    }, u.prototype.filter = function(e) {
      var t = e instanceof u ? function(t2) {
        return e.nodes.indexOf(t2) !== -1;
      } : typeof e == "function" ? e : function(t2) {
        return t2.matches = t2.matches || t2.msMatchesSelector || t2.webkitMatchesSelector, t2.matches(e || "*");
      };
      return u(this.nodes.filter(t));
    }, u.prototype.find = function(e) {
      return this.map(function(t) {
        return u(e || "*", t);
      });
    }, u.prototype.first = function() {
      return this.nodes[0] || false;
    }, u.prototype.generate = function(t) {
      return /^\s*<tr[> ]/.test(t) ? u(document.createElement("table")).html(t).children().children().nodes : /^\s*<t(h|d)[> ]/.test(t) ? u(document.createElement("table")).html(t).children().children().children().nodes : /^\s*</.test(t) ? u(document.createElement("div")).html(t).children().nodes : document.createTextNode(t);
    }, u.prototype.handle = function() {
      var t = this.slice(arguments).map(function(e) {
        return typeof e == "function" ? function(t2) {
          t2.preventDefault(), e.apply(this, arguments);
        } : e;
      }, this);
      return this.on.apply(this, t);
    }, u.prototype.hasClass = function() {
      return this.is("." + this.args(arguments).join("."));
    }, u.prototype.html = function(e) {
      return e === void 0 ? this.first().innerHTML || "" : this.each(function(t) {
        t.innerHTML = e;
      });
    }, u.prototype.is = function(t) {
      return 0 < this.filter(t).length;
    }, u.prototype.isInPage = function(t) {
      return t !== document.body && document.body.contains(t);
    }, u.prototype.last = function() {
      return this.nodes[this.length - 1] || false;
    }, u.prototype.map = function(t) {
      return t ? u(this.array(t)).unique() : this;
    }, u.prototype.not = function(e) {
      return this.filter(function(t) {
        return !u(t).is(e || true);
      });
    }, u.prototype.off = function(t, e, n) {
      var r = e == null && n == null, o = null, i = e;
      return typeof e == "string" && (o = e, i = n), this.eacharg(t, function(e2, n2) {
        u(e2._e ? e2._e[n2] : []).each(function(t2) {
          (r || t2.orig_callback === i && t2.selector === o) && e2.removeEventListener(n2, t2.callback);
        });
      });
    }, u.prototype.on = function(t, e, o) {
      function i(t2, e2) {
        try {
          Object.defineProperty(t2, "currentTarget", { value: e2, configurable: true });
        } catch (t3) {
        }
      }
      var c = null, n = e;
      typeof e == "string" && (c = e, n = o, e = function(n2) {
        var r2 = arguments;
        u(n2.currentTarget).find(c).each(function(t2) {
          var e2;
          t2.contains(n2.target) && (e2 = n2.currentTarget, i(n2, t2), o.apply(t2, r2), i(n2, e2));
        });
      });
      function r(t2) {
        return e.apply(this, [t2].concat(t2.detail || []));
      }
      return this.eacharg(t, function(t2, e2) {
        t2.addEventListener(e2, r), t2._e = t2._e || {}, t2._e[e2] = t2._e[e2] || [], t2._e[e2].push({ callback: r, orig_callback: n, selector: c });
      });
    }, u.prototype.pairs = function(r, t, e, o) {
      var n;
      return t !== void 0 && (n = r, (r = {})[n] = t), typeof r == "object" ? this.each(function(t2, e2) {
        for (var n2 in r)
          typeof r[n2] == "function" ? o(t2, n2, r[n2](t2, e2)) : o(t2, n2, r[n2]);
      }) : this.length ? e(this.first(), r) : "";
    }, u.prototype.param = function(e) {
      return Object.keys(e).map(function(t) {
        return this.uri(t) + "=" + this.uri(e[t]);
      }.bind(this)).join("&");
    }, u.prototype.parent = function(t) {
      return this.map(function(t2) {
        return t2.parentNode;
      }).filter(t);
    }, u.prototype.prepend = function(t, e) {
      return this.adjacent(t, e, function(t2, e2) {
        t2.insertBefore(e2, t2.firstChild);
      });
    }, u.prototype.remove = function() {
      return this.each(function(t) {
        t.parentNode && t.parentNode.removeChild(t);
      });
    }, u.prototype.removeClass = function() {
      return this.eacharg(arguments, function(t, e) {
        t.classList.remove(e);
      });
    }, u.prototype.replace = function(t, e) {
      var n = [];
      return this.adjacent(t, e, function(t2, e2) {
        n = n.concat(this.slice(e2.children)), t2.parentNode.replaceChild(e2, t2);
      }), u(n);
    }, u.prototype.scroll = function() {
      return this.first().scrollIntoView({ behavior: "smooth" }), this;
    }, u.prototype.select = function(t, e) {
      return t = t.replace(/^\s*/, "").replace(/\s*$/, ""), /^</.test(t) ? u().generate(t) : (e || document).querySelectorAll(t);
    }, u.prototype.serialize = function() {
      var r = this;
      return this.slice(this.first().elements).reduce(function(e, n) {
        return !n.name || n.disabled || n.type === "file" || /(checkbox|radio)/.test(n.type) && !n.checked ? e : n.type === "select-multiple" ? (u(n.options).each(function(t) {
          t.selected && (e += "&" + r.uri(n.name) + "=" + r.uri(t.value));
        }), e) : e + "&" + r.uri(n.name) + "=" + r.uri(n.value);
      }, "").slice(1);
    }, u.prototype.siblings = function(t) {
      return this.parent().children(t).not(this);
    }, u.prototype.size = function() {
      return this.first().getBoundingClientRect();
    }, u.prototype.slice = function(t) {
      return t && t.length !== 0 && typeof t != "string" && t.toString() !== "[object Function]" ? t.length ? [].slice.call(t.nodes || t) : [t] : [];
    }, u.prototype.str = function(e, n) {
      return function(t) {
        return typeof t == "function" ? t.call(this, e, n) : t.toString();
      };
    }, u.prototype.text = function(e) {
      return e === void 0 ? this.first().textContent || "" : this.each(function(t) {
        t.textContent = e;
      });
    }, u.prototype.toggleClass = function(t, e) {
      return !!e === e ? this[e ? "addClass" : "removeClass"](t) : this.eacharg(t, function(t2, e2) {
        t2.classList.toggle(e2);
      });
    }, u.prototype.trigger = function(t) {
      var o = this.slice(arguments).slice(1);
      return this.eacharg(t, function(t2, e) {
        var n, r = { bubbles: true, cancelable: true, detail: o };
        try {
          n = new window.CustomEvent(e, r);
        } catch (t3) {
          (n = document.createEvent("CustomEvent")).initCustomEvent(e, true, true, o);
        }
        t2.dispatchEvent(n);
      });
    }, u.prototype.unique = function() {
      return u(this.nodes.reduce(function(t, e) {
        return e != null && e !== false && t.indexOf(e) === -1 ? t.concat(e) : t;
      }, []));
    }, u.prototype.uri = function(t) {
      return encodeURIComponent(t).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+");
    }, u.prototype.wrap = function(t) {
      return this.map(function(e) {
        return u(t).each(function(t2) {
          !function(t3) {
            for (; t3.firstElementChild; )
              t3 = t3.firstElementChild;
            return u(t3);
          }(t2).append(e.cloneNode(true)), e.parentNode.replaceChild(t2, e);
        });
      });
    }, typeof module == "object" && module.exports && (module.exports = u, module.exports.u = u);
  }
});

// source/actions/index.ts
var actions_exports = {};
__export(actions_exports, {
  authenticateUser: () => authenticateUser,
  createConversation: () => createConversation,
  createGroup: () => createGroup,
  createQuestion: () => createQuestion,
  createUser: () => createUser,
  deleteQuestion: () => deleteQuestion,
  fetchConversation: () => fetchConversation,
  fetchGroup: () => fetchGroup,
  listAttributes: () => listAttributes,
  listConversations: () => listConversations,
  listGroups: () => listGroups,
  listQuestions: () => listQuestions,
  listUsers: () => listUsers,
  updateConversation: () => updateConversation,
  updateGroup: () => updateGroup,
  updateQuestion: () => updateQuestion
});

// node_modules/.pnpm/ky@0.30.0/node_modules/ky/distribution/errors/HTTPError.js
var HTTPError = class extends Error {
  constructor(response, request, options) {
    const code = response.status || response.status === 0 ? response.status : "";
    const title = response.statusText || "";
    const status = `${code} ${title}`.trim();
    const reason = status ? `status code ${status}` : "an unknown error";
    super(`Request failed with ${reason}`);
    this.name = "HTTPError";
    this.response = response;
    this.request = request;
    this.options = options;
  }
};

// node_modules/.pnpm/ky@0.30.0/node_modules/ky/distribution/errors/TimeoutError.js
var TimeoutError = class extends Error {
  constructor(request) {
    super("Request timed out");
    this.name = "TimeoutError";
    this.request = request;
  }
};

// node_modules/.pnpm/ky@0.30.0/node_modules/ky/distribution/utils/is.js
var isObject = (value) => value !== null && typeof value === "object";

// node_modules/.pnpm/ky@0.30.0/node_modules/ky/distribution/utils/merge.js
var validateAndMerge = (...sources) => {
  for (const source of sources) {
    if ((!isObject(source) || Array.isArray(source)) && typeof source !== "undefined") {
      throw new TypeError("The `options` argument must be an object");
    }
  }
  return deepMerge({}, ...sources);
};
var mergeHeaders = (source1 = {}, source2 = {}) => {
  const result = new globalThis.Headers(source1);
  const isHeadersInstance = source2 instanceof globalThis.Headers;
  const source = new globalThis.Headers(source2);
  for (const [key, value] of source.entries()) {
    if (isHeadersInstance && value === "undefined" || value === void 0) {
      result.delete(key);
    } else {
      result.set(key, value);
    }
  }
  return result;
};
var deepMerge = (...sources) => {
  let returnValue = {};
  let headers = {};
  for (const source of sources) {
    if (Array.isArray(source)) {
      if (!Array.isArray(returnValue)) {
        returnValue = [];
      }
      returnValue = [...returnValue, ...source];
    } else if (isObject(source)) {
      for (let [key, value] of Object.entries(source)) {
        if (isObject(value) && key in returnValue) {
          value = deepMerge(returnValue[key], value);
        }
        returnValue = { ...returnValue, [key]: value };
      }
      if (isObject(source.headers)) {
        headers = mergeHeaders(headers, source.headers);
        returnValue.headers = headers;
      }
    }
  }
  return returnValue;
};

// node_modules/.pnpm/ky@0.30.0/node_modules/ky/distribution/core/constants.js
var supportsAbortController = typeof globalThis.AbortController === "function";
var supportsStreams = typeof globalThis.ReadableStream === "function";
var supportsFormData = typeof globalThis.FormData === "function";
var requestMethods = ["get", "post", "put", "patch", "head", "delete"];
var validate = () => void 0;
validate();
var responseTypes = {
  json: "application/json",
  text: "text/*",
  formData: "multipart/form-data",
  arrayBuffer: "*/*",
  blob: "*/*"
};
var maxSafeTimeout = 2147483647;
var stop = Symbol("stop");

// node_modules/.pnpm/ky@0.30.0/node_modules/ky/distribution/utils/normalize.js
var normalizeRequestMethod = (input) => requestMethods.includes(input) ? input.toUpperCase() : input;
var retryMethods = ["get", "put", "head", "delete", "options", "trace"];
var retryStatusCodes = [408, 413, 429, 500, 502, 503, 504];
var retryAfterStatusCodes = [413, 429, 503];
var defaultRetryOptions = {
  limit: 2,
  methods: retryMethods,
  statusCodes: retryStatusCodes,
  afterStatusCodes: retryAfterStatusCodes,
  maxRetryAfter: Number.POSITIVE_INFINITY
};
var normalizeRetryOptions = (retry = {}) => {
  if (typeof retry === "number") {
    return {
      ...defaultRetryOptions,
      limit: retry
    };
  }
  if (retry.methods && !Array.isArray(retry.methods)) {
    throw new Error("retry.methods must be an array");
  }
  if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
    throw new Error("retry.statusCodes must be an array");
  }
  return {
    ...defaultRetryOptions,
    ...retry,
    afterStatusCodes: retryAfterStatusCodes
  };
};

// node_modules/.pnpm/ky@0.30.0/node_modules/ky/distribution/utils/time.js
var timeout = async (request, abortController, options) => new Promise((resolve, reject) => {
  const timeoutId = setTimeout(() => {
    if (abortController) {
      abortController.abort();
    }
    reject(new TimeoutError(request));
  }, options.timeout);
  void options.fetch(request).then(resolve).catch(reject).then(() => {
    clearTimeout(timeoutId);
  });
});
var delay = async (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

// node_modules/.pnpm/ky@0.30.0/node_modules/ky/distribution/core/Ky.js
var Ky = class {
  constructor(input, options = {}) {
    var _a, _b, _c;
    this._retryCount = 0;
    this._input = input;
    this._options = {
      credentials: this._input.credentials || "same-origin",
      ...options,
      headers: mergeHeaders(this._input.headers, options.headers),
      hooks: deepMerge({
        beforeRequest: [],
        beforeRetry: [],
        beforeError: [],
        afterResponse: []
      }, options.hooks),
      method: normalizeRequestMethod((_a = options.method) !== null && _a !== void 0 ? _a : this._input.method),
      prefixUrl: String(options.prefixUrl || ""),
      retry: normalizeRetryOptions(options.retry),
      throwHttpErrors: options.throwHttpErrors !== false,
      timeout: typeof options.timeout === "undefined" ? 1e4 : options.timeout,
      fetch: (_b = options.fetch) !== null && _b !== void 0 ? _b : globalThis.fetch.bind(globalThis)
    };
    if (typeof this._input !== "string" && !(this._input instanceof URL || this._input instanceof globalThis.Request)) {
      throw new TypeError("`input` must be a string, URL, or Request");
    }
    if (this._options.prefixUrl && typeof this._input === "string") {
      if (this._input.startsWith("/")) {
        throw new Error("`input` must not begin with a slash when using `prefixUrl`");
      }
      if (!this._options.prefixUrl.endsWith("/")) {
        this._options.prefixUrl += "/";
      }
      this._input = this._options.prefixUrl + this._input;
    }
    if (supportsAbortController) {
      this.abortController = new globalThis.AbortController();
      if (this._options.signal) {
        this._options.signal.addEventListener("abort", () => {
          this.abortController.abort();
        });
      }
      this._options.signal = this.abortController.signal;
    }
    this.request = new globalThis.Request(this._input, this._options);
    if (this._options.searchParams) {
      const textSearchParams = typeof this._options.searchParams === "string" ? this._options.searchParams.replace(/^\?/, "") : new URLSearchParams(this._options.searchParams).toString();
      const searchParams = "?" + textSearchParams;
      const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);
      if ((supportsFormData && this._options.body instanceof globalThis.FormData || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers["content-type"])) {
        this.request.headers.delete("content-type");
      }
      this.request = new globalThis.Request(new globalThis.Request(url, this.request), this._options);
    }
    if (this._options.json !== void 0) {
      this._options.body = JSON.stringify(this._options.json);
      this.request.headers.set("content-type", (_c = this._options.headers.get("content-type")) !== null && _c !== void 0 ? _c : "application/json");
      this.request = new globalThis.Request(this.request, { body: this._options.body });
    }
  }
  static create(input, options) {
    const ky2 = new Ky(input, options);
    const fn = async () => {
      if (ky2._options.timeout > maxSafeTimeout) {
        throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
      }
      await Promise.resolve();
      let response = await ky2._fetch();
      for (const hook of ky2._options.hooks.afterResponse) {
        const modifiedResponse = await hook(ky2.request, ky2._options, ky2._decorateResponse(response.clone()));
        if (modifiedResponse instanceof globalThis.Response) {
          response = modifiedResponse;
        }
      }
      ky2._decorateResponse(response);
      if (!response.ok && ky2._options.throwHttpErrors) {
        let error = new HTTPError(response, ky2.request, ky2._options);
        for (const hook of ky2._options.hooks.beforeError) {
          error = await hook(error);
        }
        throw error;
      }
      if (ky2._options.onDownloadProgress) {
        if (typeof ky2._options.onDownloadProgress !== "function") {
          throw new TypeError("The `onDownloadProgress` option must be a function");
        }
        if (!supportsStreams) {
          throw new Error("Streams are not supported in your environment. `ReadableStream` is missing.");
        }
        return ky2._stream(response.clone(), ky2._options.onDownloadProgress);
      }
      return response;
    };
    const isRetriableMethod = ky2._options.retry.methods.includes(ky2.request.method.toLowerCase());
    const result = isRetriableMethod ? ky2._retry(fn) : fn();
    for (const [type, mimeType] of Object.entries(responseTypes)) {
      result[type] = async () => {
        ky2.request.headers.set("accept", ky2.request.headers.get("accept") || mimeType);
        const awaitedResult = await result;
        const response = awaitedResult.clone();
        if (type === "json") {
          if (response.status === 204) {
            return "";
          }
          if (options.parseJson) {
            return options.parseJson(await response.text());
          }
        }
        return response[type]();
      };
    }
    return result;
  }
  _calculateRetryDelay(error) {
    this._retryCount++;
    if (this._retryCount < this._options.retry.limit && !(error instanceof TimeoutError)) {
      if (error instanceof HTTPError) {
        if (!this._options.retry.statusCodes.includes(error.response.status)) {
          return 0;
        }
        const retryAfter = error.response.headers.get("Retry-After");
        if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
          let after = Number(retryAfter);
          if (Number.isNaN(after)) {
            after = Date.parse(retryAfter) - Date.now();
          } else {
            after *= 1e3;
          }
          if (typeof this._options.retry.maxRetryAfter !== "undefined" && after > this._options.retry.maxRetryAfter) {
            return 0;
          }
          return after;
        }
        if (error.response.status === 413) {
          return 0;
        }
      }
      const BACKOFF_FACTOR = 0.3;
      return BACKOFF_FACTOR * 2 ** (this._retryCount - 1) * 1e3;
    }
    return 0;
  }
  _decorateResponse(response) {
    if (this._options.parseJson) {
      response.json = async () => this._options.parseJson(await response.text());
    }
    return response;
  }
  async _retry(fn) {
    try {
      return await fn();
    } catch (error) {
      const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
      if (ms !== 0 && this._retryCount > 0) {
        await delay(ms);
        for (const hook of this._options.hooks.beforeRetry) {
          const hookResult = await hook({
            request: this.request,
            options: this._options,
            error,
            retryCount: this._retryCount
          });
          if (hookResult === stop) {
            return;
          }
        }
        return this._retry(fn);
      }
      throw error;
    }
  }
  async _fetch() {
    for (const hook of this._options.hooks.beforeRequest) {
      const result = await hook(this.request, this._options);
      if (result instanceof Request) {
        this.request = result;
        break;
      }
      if (result instanceof Response) {
        return result;
      }
    }
    if (this._options.timeout === false) {
      return this._options.fetch(this.request.clone());
    }
    return timeout(this.request.clone(), this.abortController, this._options);
  }
  _stream(response, onDownloadProgress) {
    const totalBytes = Number(response.headers.get("content-length")) || 0;
    let transferredBytes = 0;
    return new globalThis.Response(new globalThis.ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        if (onDownloadProgress) {
          onDownloadProgress({ percent: 0, transferredBytes: 0, totalBytes }, new Uint8Array());
        }
        async function read() {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          if (onDownloadProgress) {
            transferredBytes += value.byteLength;
            const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
            onDownloadProgress({ percent, transferredBytes, totalBytes }, value);
          }
          controller.enqueue(value);
          await read();
        }
        await read();
      }
    }));
  }
};

// node_modules/.pnpm/ky@0.30.0/node_modules/ky/distribution/index.js
var createInstance = (defaults) => {
  const ky2 = (input, options) => Ky.create(input, validateAndMerge(defaults, options));
  for (const method of requestMethods) {
    ky2[method] = (input, options) => Ky.create(input, validateAndMerge(defaults, options, { method }));
  }
  ky2.create = (newDefaults) => createInstance(validateAndMerge(newDefaults));
  ky2.extend = (newDefaults) => createInstance(validateAndMerge(defaults, newDefaults));
  ky2.stop = stop;
  return ky2;
};
var ky = createInstance();
var distribution_default = ky;

// source/utilities/storage.ts
var json = JSON;
var storage = {
  exists(key) {
    const serializedData = localStorage.getItem(`data:${key}`);
    return serializedData !== null;
  },
  set(key, data) {
    const serializedData = json.stringify(data);
    localStorage.setItem(`data:${key}`, serializedData);
    return data;
  },
  get(key) {
    const serializedData = localStorage.getItem(`data:${key}`);
    if (serializedData === null)
      return void 0;
    return json.parse(serializedData);
  },
  delete: (key) => localStorage.removeItem(`data:${key}`)
};
var cache = {
  exists(key) {
    const serializedData = localStorage.getItem(`cache:${key}`);
    return serializedData !== null && json.parse(serializedData).expiry < Date.now();
  },
  set(key, data, expiry) {
    const serializedData = json.stringify({
      expiry: Date.now() + expiry * 1e3,
      value: data
    });
    localStorage.setItem(`cache:${key}`, serializedData);
    return data;
  },
  get(key) {
    const serializedData = json.parse(localStorage.getItem(`cache:${key}`) ?? "null");
    if (serializedData === null)
      return void 0;
    if (serializedData.expiry < Date.now()) {
      this.delete(key);
      return void 0;
    }
    return serializedData.value;
  },
  delete: (key) => localStorage.removeItem(`cache:${key}`)
};

// source/utilities/dom.ts
var import_umbrellajs = __toESM(require_umbrella_min(), 1);

// node_modules/.pnpm/select-dom@7.1.1/node_modules/select-dom/index.js
function isQueryable(object) {
  return typeof object.querySelectorAll === "function";
}
function select(selectors, baseElement) {
  var _a;
  if (arguments.length === 2 && !baseElement) {
    return;
  }
  return (_a = (baseElement !== null && baseElement !== void 0 ? baseElement : document).querySelector(String(selectors))) !== null && _a !== void 0 ? _a : void 0;
}
function selectLast(selectors, baseElement) {
  if (arguments.length === 2 && !baseElement) {
    return void 0;
  }
  const all = (baseElement !== null && baseElement !== void 0 ? baseElement : document).querySelectorAll(String(selectors));
  return all[all.length - 1];
}
function selectExists(selectors, baseElement) {
  if (arguments.length === 2 && !baseElement) {
    return false;
  }
  return Boolean((baseElement !== null && baseElement !== void 0 ? baseElement : document).querySelector(String(selectors)));
}
function selectAll(selectors, baseElements) {
  if (arguments.length === 2 && !baseElements) {
    return [];
  }
  if (!baseElements || isQueryable(baseElements)) {
    const elements = (baseElements !== null && baseElements !== void 0 ? baseElements : document).querySelectorAll(String(selectors));
    return [...elements];
  }
  const queried = /* @__PURE__ */ new Set();
  for (const baseElement of baseElements) {
    for (const element of baseElement.querySelectorAll(String(selectors))) {
      queried.add(element);
    }
  }
  return [...queried];
}
select.last = selectLast;
select.exists = selectExists;
select.all = selectAll;
var select_dom_default = select;

// source/utilities/dom.ts
var import_umbrellajs2 = __toESM(require_umbrella_min(), 1);
var navigate = (location, query) => {
  window.location.href = location + (query ? `?${new URLSearchParams(query)}` : "");
};
if (typeof window.mentoring === "undefined")
  window.mentoring = { page: { data: {} }, actions: {}, hooks: {} };

// source/utilities/messages.ts
var errorsAndMessages = {
  error: {
    "invalid-email-address": "Please enter a valid email and try again.",
    "weak-password": "The password you entered was too weak. Please try again with a longer (> 6 letters) password.",
    "incorrect-credentials": "The email/password entered was incorrect. Please try again with valid credentials.",
    "user-already-exists": "A user with the same email address already exists. Perhaps you meant to sign in?",
    "expired-credentials": "Please sign in to view this page.",
    "server-crash": "An unexpected error occurred. Please try again in a few seconds or report this issue.",
    "network-error": "A network error occurred while signing in. Please check your internet connectivity and try again."
  },
  info: {
    "signing-in": "Signing you in...",
    "signed-in": "Successfully signed you in!",
    "signing-up": "Creating your account...",
    "signed-up": "Welcome to the DoNew Mentoring Platform!",
    "saved-conversation": "Successfully saved the conversation and all its questions!"
  }
};
var get = (category, name) => {
  return errorsAndMessages[category][name];
};
var errors = {
  get: (name) => get("error", name)
};

// source/utilities/http.ts
var json2 = JSON;
var _fetch = distribution_default.create({
  prefixUrl: window.location.href.startsWith("https://mentoring.godonew.com") ? "https://mentoring.godonew.com/api" : window.location.href.startsWith("https://mentoring-sandbox.godonew.com") ? "https://mentoring-sandbox.godonew.com/api" : "http://localhost:5000/api",
  throwHttpErrors: false,
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        const { status } = response;
        const body = await response.json();
        if (status === 401 && body?.error?.code === "invalid-token") {
          const tokenResponse = await fetch({
            method: "post",
            url: "auth/refresh-token",
            json: {
              refreshToken: storage.get("tokens.refresh")
            }
          });
          if (isErrorResponse(tokenResponse)) {
            storage.delete("tokens.bearer");
            storage.delete("tokens.refresh");
            navigate("/app/signin", {
              redirect: window.location.pathname,
              error: "expired-credentials"
            });
            return;
          }
          storage.set("tokens.bearer", tokenResponse.tokens.bearer);
          storage.set("tokens.refresh", tokenResponse.tokens.refresh);
          request.headers.set("authorization", tokenResponse.tokens.bearer);
          return distribution_default(request);
        }
      }
    ]
  }
});
var fetch = async (passedOptions) => {
  const options = passedOptions;
  options.cache = {
    use: true,
    store: true,
    expiresIn: 20,
    ...options.cache
  };
  options.headers = {
    authorization: storage.get("tokens.bearer"),
    ...options.headers
  };
  try {
    const requestIdentifier = "http:" + btoa([
      options.method,
      options.url,
      json2.stringify(options.json ?? null),
      json2.stringify(options.query ?? null)
    ].join("."));
    if (options.cache.use && options.method === "get") {
      const cachedResponse = cache.get(requestIdentifier);
      if (typeof cachedResponse !== "undefined") {
        return cachedResponse;
      }
    }
    const response = await _fetch(options.url.replace(/^\/+/g, ""), {
      method: options.method,
      json: options.json,
      searchParams: options.query,
      headers: options.headers
    }).json();
    if (options.cache.store && options.method === "get" && !isErrorResponse(response)) {
      cache.set(requestIdentifier, response, options.cache.expiresIn);
    }
    return response;
  } catch (error) {
    if (error.message?.includes("NetworkError")) {
      return {
        error: {
          status: 503,
          code: "network-error",
          message: errors.get("network-error")
        }
      };
    }
    if (error.message?.includes("401 Unauthorized")) {
      storage.delete("tokens.bearer");
      storage.delete("tokens.refresh");
      return fetch(passedOptions);
    }
    console.log("An unexpected error occurred while signing in:", error);
    return {
      error: {
        status: 500,
        code: "server-crash",
        message: errors.get("server-crash")
      }
    };
  }
};
var isErrorResponse = (response) => {
  return typeof response.error !== "undefined";
};

// source/actions/index.ts
var createUser = async (name, email, password) => {
  const response = await fetch({
    url: "/auth/signup",
    method: "post",
    json: { name, email, password }
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "improper-payload":
        message = error.message.includes("password") ? errors.get("weak-password") : errors.get("invalid-email-address");
        break;
      case "entity-already-exists":
        message = errors.get("user-already-exists");
        break;
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response;
};
var authenticateUser = async (email, password) => {
  const response = await fetch({
    url: "/auth/signin",
    method: "post",
    json: { email, password }
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "improper-payload":
        message = errors.get("invalid-email-address");
        break;
      case "incorrect-credentials":
      case "entity-not-found":
        message = errors.get("incorrect-credentials");
        break;
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response;
};
var listUsers = async () => {
  const response = await fetch({
    url: "/users",
    method: "get"
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.users;
};
var listGroups = async () => {
  const response = await fetch({
    url: "/groups",
    method: "get"
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.groups;
};
var fetchGroup = async (groupId) => {
  const response = await fetch({
    url: `/groups/${groupId}`,
    method: "get"
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.group;
};
var createGroup = async (group) => {
  const response = await fetch({
    url: `/groups`,
    method: "post",
    json: group
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.group;
};
var updateGroup = async (group) => {
  const response = await fetch({
    url: `/groups/${group.id}`,
    method: "put",
    json: group
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.group;
};
var listAttributes = async () => {
  const response = await fetch({
    url: "/attributes",
    method: "get"
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.attributes;
};
var listConversations = async () => {
  const response = await fetch({
    url: "/conversations",
    method: "get"
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.conversations;
};
var fetchConversation = async (conversationId) => {
  const response = await fetch({
    url: `/conversations/${conversationId}`,
    method: "get"
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.conversation;
};
var createConversation = async (conversation) => {
  const response = await fetch({
    url: `/conversations`,
    method: "post",
    json: conversation
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.conversation;
};
var updateConversation = async (conversation) => {
  const response = await fetch({
    url: `/conversations/${conversation.id}`,
    method: "put",
    json: conversation
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.conversation;
};
var listQuestions = async (conversationId) => {
  const response = await fetch({
    url: `/conversations/${conversationId}/questions`,
    method: "get"
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.questions;
};
var createQuestion = async (conversationId, question) => {
  const response = await fetch({
    url: `/conversations/${conversationId}/questions`,
    method: "post",
    json: question
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.question;
};
var updateQuestion = async (conversationId, question) => {
  const response = await fetch({
    url: `/conversations/${conversationId}/questions/${question.id}`,
    method: "put",
    json: question
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
  return response.question;
};
var deleteQuestion = async (conversationId, questionId) => {
  const response = await fetch({
    url: `/conversations/${conversationId}/questions/${questionId}`,
    method: "delete"
  });
  if (isErrorResponse(response)) {
    const { error } = response;
    let { message } = error;
    switch (error.code) {
      case "network-error":
        message = errors.get("network-error");
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
};

// source/hooks/auth.ts
var checkAuth = () => storage.exists("user") && storage.exists("tokens.bearer") && storage.exists("tokens.refresh");

// source/hooks/nav.ts
var renderNavbar = () => {
  if (!select_dom_default("nav"))
    return;
  (0, import_umbrellajs2.default)("nav").addClass("bg-teal-900");
  (0, import_umbrellajs2.default)("nav").append(`
		<div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
			<div class="relative flex items-center justify-between h-16">
				<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
					<!-- Mobile menu buttons (only shown on mobile) -->
					<button
						class="inline-flex items-center justify-center p-2 rounded-md text-teal-400 hover:text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
						aria-controls="mobile-menu"
						aria-expanded="false"
						data-ref="mobile-menu-btn"
					>
						<span class="sr-only">Open main menu</span>
						<svg
							class="block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
							data-ref="mobile-menu-open-btn"
							onclick="window.mentoring.page.openMobileMenu()"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
						<svg
							class="hidden block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
							data-ref="mobile-menu-close-btn"
							onclick="window.mentoring.page.closeMobileMenu()"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<!-- Normal menu -->
				<div
					class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
					data-ref="normal-menu"
				>
					<span class="text-white flex-shrink-0 flex items-center">DoNew</span>

					<!-- List of pages -->
					<div class="hidden sm:block sm:ml-6">
						<div class="flex space-x-4" data-ref="nav-pages-list"></div>
					</div>
				</div>

				<!-- Settings button -->
				<div
					class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
				>
					<div class="ml-3 relative">
						<div>
							<button
								class="inline-flex items-center justify-center p-2 rounded-md text-teal-400 hover:text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
								aria-controls="mobile-menu"
								aria-expanded="false"
								data-ref="settings-btn"
								onclick="window.location.href = '/app/settings'"
							>
								<span class="sr-only">Open settings</span>
								<svg
									class="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									data-ref="settings-btn"
								>
									<line x1="4" y1="21" x2="4" y2="14"></line>
									<line x1="4" y1="10" x2="4" y2="3"></line>
									<line x1="12" y1="21" x2="12" y2="12"></line>
									<line x1="12" y1="8" x2="12" y2="3"></line>
									<line x1="20" y1="21" x2="20" y2="16"></line>
									<line x1="20" y1="12" x2="20" y2="3"></line>
									<line x1="1" y1="14" x2="7" y2="14"></line>
									<line x1="9" y1="8" x2="15" y2="8"></line>
									<line x1="17" y1="16" x2="23" y2="16"></line>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Mobile menu items -->
		<div class="sm:hidden hidden" data-ref="mobile-menu">
			<div class="px-2 pt-2 pb-3 space-y-1" data-ref="nav-pages-list" />
		</div>
	`);
  const pages = [
    { name: "Home", link: "/app/home" },
    { name: "Groups", link: "/app/groups" },
    { name: "Conversations", link: "/app/conversations" }
  ];
  const focusedItem = `
		<a
			href="{link}"
			class="bg-teal-800 text-white px-3 py-2 rounded-md block text-sm font-medium"
		>
			{name}
		</a>
	`;
  const otherItem = `
		<a
			href="{link}"
			class="text-teal-500 hover:bg-teal-800 hover:text-white px-3 py-2 rounded-md block text-sm font-medium"
		>
			{name}
		</a>
	`;
  for (const page of pages) {
    if (window.location.pathname.startsWith(page.link)) {
      (0, import_umbrellajs2.default)("[data-ref=nav-pages-list]").append(focusedItem.replace("{link}", page.link).replace("{name}", page.name));
    } else {
      (0, import_umbrellajs2.default)("[data-ref=nav-pages-list]").append(otherItem.replace("{link}", page.link).replace("{name}", page.name));
    }
  }
  window.mentoring.page.openMobileMenu = () => {
    (0, import_umbrellajs2.default)("[data-ref=mobile-menu]").first().classList.remove("hidden");
    (0, import_umbrellajs2.default)("[data-ref=mobile-menu-close-btn]").first().classList.remove("hidden");
    (0, import_umbrellajs2.default)("[data-ref=mobile-menu-open-btn]").first().classList.add("hidden");
  };
  window.mentoring.page.closeMobileMenu = () => {
    (0, import_umbrellajs2.default)("[data-ref=mobile-menu]").first().classList.add("hidden");
    (0, import_umbrellajs2.default)("[data-ref=mobile-menu-close-btn]").first().classList.add("hidden");
    (0, import_umbrellajs2.default)("[data-ref=mobile-menu-open-btn]").first().classList.remove("hidden");
  };
};

// source/hooks/index.ts
var init = (options) => {
  if (options.requireAuth && !checkAuth()) {
    navigate("/app/signin", {
      redirect: window.location.pathname,
      error: "expired-credentials"
    });
    return;
  }
  renderNavbar();
  if (typeof window.mentoring?.page?.init === "function")
    void window.mentoring.page.init();
};
window.mentoring = {
  ...window.mentoring,
  hooks: { init },
  actions: actions_exports
};
/*! MIT License © Sindre Sorhus */
