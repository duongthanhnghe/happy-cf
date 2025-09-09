import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, createError, getQuery as getQuery$1, readBody, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, getRouterParam, getResponseStatusText } from 'file:///Users/mac/happy-coffee/node_modules/h3/dist/index.mjs';
import { Server } from 'node:http';
import path, { resolve, dirname, join } from 'node:path';
import nodeCrypto, { randomBytes } from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { escapeHtml } from 'file:///Users/mac/happy-coffee/node_modules/@vue/shared/dist/shared.cjs.js';
import express, { Router } from 'file:///Users/mac/happy-coffee/node_modules/express/index.js';
import mongoose, { model, Schema, Types } from 'file:///Users/mac/happy-coffee/node_modules/mongoose/index.js';
import bcrypt from 'file:///Users/mac/happy-coffee/node_modules/bcryptjs/index.js';
import jwt from 'file:///Users/mac/happy-coffee/node_modules/jsonwebtoken/index.js';
import bwipjs from 'file:///Users/mac/happy-coffee/node_modules/bwip-js/dist/bwip-js-node.mjs';
import fs, { promises } from 'node:fs';
import nodemailer from 'file:///Users/mac/happy-coffee/node_modules/nodemailer/lib/nodemailer.js';
import multer from 'file:///Users/mac/happy-coffee/node_modules/multer/index.js';
import { v2 } from 'file:///Users/mac/happy-coffee/node_modules/cloudinary/cloudinary.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file:///Users/mac/happy-coffee/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, joinRelativeURL } from 'file:///Users/mac/happy-coffee/node_modules/ufo/dist/index.mjs';
import { renderToString } from 'file:///Users/mac/happy-coffee/node_modules/vue/server-renderer/index.mjs';
import destr, { destr as destr$1 } from 'file:///Users/mac/happy-coffee/node_modules/destr/dist/index.mjs';
import { createHooks } from 'file:///Users/mac/happy-coffee/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file:///Users/mac/happy-coffee/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file:///Users/mac/happy-coffee/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file:///Users/mac/happy-coffee/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file:///Users/mac/happy-coffee/node_modules/unstorage/drivers/fs.mjs';
import { digest } from 'file:///Users/mac/happy-coffee/node_modules/ohash/dist/index.mjs';
import { klona } from 'file:///Users/mac/happy-coffee/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file:///Users/mac/happy-coffee/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file:///Users/mac/happy-coffee/node_modules/scule/dist/index.mjs';
import { getContext } from 'file:///Users/mac/happy-coffee/node_modules/unctx/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file:///Users/mac/happy-coffee/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file:///Users/mac/happy-coffee/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file:///Users/mac/happy-coffee/node_modules/youch-core/build/index.js';
import { Youch } from 'file:///Users/mac/happy-coffee/node_modules/nitropack/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file:///Users/mac/happy-coffee/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { stringify, uneval } from 'file:///Users/mac/happy-coffee/node_modules/devalue/index.js';
import { captureRawStackTrace, parseRawStackTrace } from 'file:///Users/mac/happy-coffee/node_modules/errx/dist/index.js';
import { isVNode, toValue, isRef } from 'file:///Users/mac/happy-coffee/node_modules/vue/index.mjs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file:///Users/mac/happy-coffee/node_modules/pathe/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file:///Users/mac/happy-coffee/node_modules/unhead/dist/server.mjs';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file:///Users/mac/happy-coffee/node_modules/unhead/dist/plugins.mjs';
import { walkResolver } from 'file:///Users/mac/happy-coffee/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"/Users/mac/happy-coffee/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/mac/happy-coffee","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/mac/happy-coffee/server","watchOptions":{"ignored":[null]}}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/mac/happy-coffee/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/mac/happy-coffee/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"/Users/mac/happy-coffee/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "cloudinaryCloudName": "dl8wwezqp"
  },
  "cloudinaryApiKey": "785428416695536",
  "cloudinaryApiSecret": "w2NE8N4tV-kouwXqO0QYZuF-YW8"
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
    defaultRes.body.stack = defaultRes.body.stack.join("\n");
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await Promise.resolve().then(function () { return errorDev; }) ;
    {
      errorObject.description = errorObject.message;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json || !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _Iy5esgeLoAxjrauMyKWVqYk1CX4hTYMbGYOo1jwFkv4 = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const rootDir = "/Users/mac/happy-coffee";

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"}],"link":[{"rel":"stylesheet","href":"https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght@100..700"}],"style":[],"script":[{"src":"https://cdn.ckeditor.com/ckeditor5/39.0.1/super-build/ckeditor.js","defer":true},{"innerHTML":"\n            document.addEventListener(\"DOMContentLoaded\", function() { \n              const div = document.createElement(\"div\"); \n              div.id = \"loader\"; \n              div.className = \"loader\"; \n              div.innerHTML = '<div class=\"loader-icon\"></div>'; \n              document.body.insertBefore(div, document.body.firstChild); \n            });\n          ","type":"text/javascript"}],"noscript":[]};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

const devReducers = {
  VNode: (data) => isVNode(data) ? { type: data.type, props: data.props } : void 0,
  URL: (data) => data instanceof URL ? data.toString() : void 0
};
const asyncContext = getContext("nuxt-dev", { asyncContext: true, AsyncLocalStorage });
const _93Qh8TLiNElUH4hzYVdd6cZcUacPe3q3b3pgOR4G4 = (nitroApp) => {
  const handler = nitroApp.h3App.handler;
  nitroApp.h3App.handler = (event) => {
    return asyncContext.callAsync({ logs: [], event }, () => handler(event));
  };
  onConsoleLog((_log) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    const rawStack = captureRawStackTrace();
    if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
      return;
    }
    const trace = [];
    let filename = "";
    for (const entry of parseRawStackTrace(rawStack)) {
      if (entry.source === globalThis._importMeta_.url) {
        continue;
      }
      if (EXCLUDE_TRACE_RE.test(entry.source)) {
        continue;
      }
      filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
      trace.push({
        ...entry,
        source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
      });
    }
    const log = {
      ..._log,
      // Pass along filename to allow the client to display more info about where log comes from
      filename,
      // Clean up file names in stack trace
      stack: trace
    };
    ctx.logs.push(log);
  });
  nitroApp.hooks.hook("afterResponse", () => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    return nitroApp.hooks.callHook("dev:ssr-logs", { logs: ctx.logs, path: ctx.event.path });
  });
  nitroApp.hooks.hook("render:html", (htmlContext) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    try {
      const reducers = Object.assign(/* @__PURE__ */ Object.create(null), devReducers, ctx.event.context._payloadReducers);
      htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
    } catch (e) {
      const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
      console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
    }
  });
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
  consola$1.addReporter({
    log(logObj) {
      callback(logObj);
    }
  });
  consola$1.wrapConsole();
}

const plugins = [
  _Iy5esgeLoAxjrauMyKWVqYk1CX4hTYMbGYOo1jwFkv4,
_93Qh8TLiNElUH4hzYVdd6cZcUacPe3q3b3pgOR4G4
];

const assets = {
  "/index.mjs": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"24c5d-6eEG+hol+uPFcvLcRSmHu8YEivQ\"",
    "mtime": "2025-09-09T07:53:36.527Z",
    "size": 150621,
    "path": "index.mjs"
  },
  "/index.mjs.map": {
    "type": "application/json",
    "etag": "\"8c13d-wXtQKHME+VwUJ9OzBt3RnArlYHo\"",
    "mtime": "2025-09-09T07:53:36.529Z",
    "size": 573757,
    "path": "index.mjs.map"
  }
};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _Wr4LdB = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
  disableCapoSorting: false,
  plugins: [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin],
};

function createSSRContext(event) {
  const ssrContext = {
    url: event.path,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: event.context.nuxt?.noSSR || (false),
    head: createHead(unheadOptions),
    error: false,
    nuxt: void 0,
    /* NuxtApp */
    payload: {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set()
  };
  return ssrContext;
}
function setSSRError(ssrContext, error) {
  ssrContext.error = true;
  ssrContext.payload = { error };
  ssrContext.url = error.url;
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => import('file:///Users/mac/happy-coffee/.nuxt//dist/server/server.mjs').then((r) => r.default || r);
const getClientManifest = () => import('file:///Users/mac/happy-coffee/.nuxt//dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRRenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  if (!manifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const options = {
    manifest,
    renderToString: renderToString$1,
    buildAssetsURL
  };
  const renderer = createRenderer(createSSRApp, options);
  async function renderToString$1(input, context) {
    const html = await renderToString(input, context);
    if (process.env.NUXT_VITE_NODE_OPTIONS) {
      renderer.rendererContext.updateManifest(await getClientManifest());
    }
    return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
    {
      return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
    }
  });
  const options = {
    manifest,
    renderToString: () => spaTemplate,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules ||= /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function getRenderer(ssrContext) {
  return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap && styleMap[mod]) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
function getServerComponentHTML(body) {
  const match = body.match(ROOT_NODE_REGEX);
  return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
    return void 0;
  }
  const response = {};
  for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
    response[name] = {
      ...slot,
      fallback: ssrContext.teleports?.[`island-fallback=${name}`]
    };
  }
  return response;
}
function getClientIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
    return void 0;
  }
  const response = {};
  for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
    const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
    response[clientUid] = {
      ...component,
      html,
      slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
    };
  }
  return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
  const entries = Object.entries(teleports);
  const slots = {};
  for (const [key, value] of entries) {
    const match = key.match(SSR_CLIENT_SLOT_MARKER);
    if (match) {
      const [, id, slot] = match;
      if (!slot || clientUid !== id) {
        continue;
      }
      slots[slot] = value;
    }
  }
  return slots;
}
function replaceIslandTeleports(ssrContext, html) {
  const { teleports, islandContext } = ssrContext;
  if (islandContext || !teleports) {
    return html;
  }
  for (const key in teleports) {
    const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
    if (matchClientComp) {
      const [, uid, clientId] = matchClientComp;
      if (!uid || !clientId) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
      continue;
    }
    const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
    if (matchSlot) {
      const [, uid, slot] = matchSlot;
      if (!uid || !slot) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
    }
  }
  return html;
}

const ISLAND_SUFFIX_RE = /\.json(\?.*)?$/;
const _SxA8c9 = defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();
  setResponseHeaders(event, {
    "content-type": "application/json;charset=utf-8",
    "x-powered-by": "Nuxt"
  });
  const islandContext = await getIslandContext(event);
  const ssrContext = {
    ...createSSRContext(event),
    islandContext,
    noSSR: false,
    url: islandContext.url
  };
  const renderer = await getSSRRenderer();
  const renderResult = await renderer.renderToString(ssrContext).catch(async (error) => {
    await ssrContext.nuxt?.hooks.callHook("app:error", error);
    throw error;
  });
  const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult });
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  {
    const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
    const link = [];
    for (const resource of Object.values(styles)) {
      if ("inline" in getQuery(resource.file)) {
        continue;
      }
      if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
        link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
      }
    }
    if (link.length) {
      ssrContext.head.push({ link }, { mode: "server" });
    }
  }
  const islandHead = {};
  for (const entry of ssrContext.head.entries.values()) {
    for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
      const currentValue = islandHead[key];
      if (Array.isArray(currentValue)) {
        currentValue.push(...value);
      }
      islandHead[key] = value;
    }
  }
  islandHead.link ||= [];
  islandHead.style ||= [];
  const islandResponse = {
    id: islandContext.id,
    head: islandHead,
    html: getServerComponentHTML(renderResult.html),
    components: getClientIslandResponse(ssrContext),
    slots: getSlotIslandResponse(ssrContext)
  };
  await nitroApp.hooks.callHook("render:island", islandResponse, { event, islandContext });
  return islandResponse;
});
async function getIslandContext(event) {
  let url = event.path || "";
  const componentParts = url.substring("/__nuxt_island".length + 1).replace(ISLAND_SUFFIX_RE, "").split("_");
  const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
  const componentName = componentParts.join("_");
  const context = event.method === "GET" ? getQuery$1(event) : await readBody(event);
  const ctx = {
    url: "/",
    ...context,
    id: hashId,
    name: componentName,
    props: destr$1(context.props) || {},
    slots: {},
    components: {}
  };
  return ctx;
}

const _lazy_rtUb5z = () => Promise.resolve().then(function () { return aboutRouter; });
const _lazy_vhHHnZ = () => Promise.resolve().then(function () { return addressesRouter; });
const _lazy_dO56oY = () => Promise.resolve().then(function () { return authRouter; });
const _lazy_f3VTyF = () => Promise.resolve().then(function () { return bannerRouter; });
const _lazy_E6ks5a = () => Promise.resolve().then(function () { return categoriesNewsRouter; });
const _lazy_pqgcrd = () => Promise.resolve().then(function () { return categoriesProductRouter; });
const _lazy_NC4wll = () => Promise.resolve().then(function () { return fileManageRouter; });
const _lazy_pDFBy2 = () => Promise.resolve().then(function () { return orderManageRouter; });
const _lazy_FlpZsr = () => Promise.resolve().then(function () { return postsNewsRouter; });
const _lazy_AMn0Ft = () => Promise.resolve().then(function () { return productRouter; });
const _lazy_WjDJNS = () => Promise.resolve().then(function () { return settingRouter; });
const _lazy_vHw4MT = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '', handler: _Wr4LdB, lazy: false, middleware: true, method: undefined },
  { route: '/aboutRouter', handler: _lazy_rtUb5z, lazy: true, middleware: false, method: undefined },
  { route: '/addressesRouter', handler: _lazy_vhHHnZ, lazy: true, middleware: false, method: undefined },
  { route: '/authRouter', handler: _lazy_dO56oY, lazy: true, middleware: false, method: undefined },
  { route: '/bannerRouter', handler: _lazy_f3VTyF, lazy: true, middleware: false, method: undefined },
  { route: '/categoriesNewsRouter', handler: _lazy_E6ks5a, lazy: true, middleware: false, method: undefined },
  { route: '/categoriesProductRouter', handler: _lazy_pqgcrd, lazy: true, middleware: false, method: undefined },
  { route: '/fileManageRouter', handler: _lazy_NC4wll, lazy: true, middleware: false, method: undefined },
  { route: '/orderManageRouter', handler: _lazy_pDFBy2, lazy: true, middleware: false, method: undefined },
  { route: '/postsNewsRouter', handler: _lazy_FlpZsr, lazy: true, middleware: false, method: undefined },
  { route: '/productRouter', handler: _lazy_AMn0Ft, lazy: true, middleware: false, method: undefined },
  { route: '/settingRouter', handler: _lazy_WjDJNS, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_vHw4MT, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_vHw4MT, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = { "appName": "Nuxt", "version": "", "statusCode": 500, "statusMessage": "Server error", "description": "An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details.", "stack": "" };
const template$1 = (messages) => {
  messages = { ..._messages, ...messages };
  return '<!DOCTYPE html><html lang="en"><head><title>' + escapeHtml(messages.statusCode) + " - " + escapeHtml(messages.statusMessage || "Internal Server Error") + `</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0" name="viewport"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);bottom:-40vh;filter:blur(30vh);height:60vh;opacity:.8}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.pointer-events-none{pointer-events:none}.fixed{position:fixed}.left-0{left:0}.right-0{right:0}.z-10{z-index:10}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.h-auto{height:auto}.min-h-screen{min-height:100vh}.flex{display:flex}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.overflow-y-auto{overflow-y:auto}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.bg-black\\/5{background-color:#0000000d}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.p-8{padding:2rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.pt-14{padding-top:3.5rem}.text-6xl{font-size:3.75rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:bg-white\\/10{background-color:#ffffff1a}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (min-width:640px){.sm\\:text-2xl{font-size:1.5rem;line-height:2rem}.sm\\:text-8xl{font-size:6rem;line-height:1}}</style><script>!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver((e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)})).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();<\/script></head><body class="antialiased bg-white dark:bg-black dark:text-white flex flex-col font-sans min-h-screen pt-14 px-10 text-black"><div class="fixed left-0 pointer-events-none right-0 spotlight"></div><h1 class="font-medium mb-6 sm:text-8xl text-6xl">` + escapeHtml(messages.statusCode) + '</h1><p class="font-light leading-tight mb-8 sm:text-2xl text-xl">' + escapeHtml(messages.description) + '</p><div class="bg-black/5 bg-white dark:bg-white/10 flex-1 h-auto overflow-y-auto rounded-t-md"><div class="font-light leading-tight p-8 text-xl z-10">' + escapeHtml(messages.stack) + "</div></div></body></html>";
};

const errorDev = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

const ListImageSchema$1 = new Schema(
  {
    id: { type: String, required: true },
    src: { type: String, required: true }
  },
  { _id: false }
);
const AboutSchema = new Schema(
  {
    title: { type: String, required: true },
    summaryContent: { type: String },
    description: { type: String },
    image: { type: String, required: true },
    listImage: { type: [ListImageSchema$1], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);
const AboutEntity = model("About", AboutSchema, "about");

function toAboutDTO(entity) {
  return {
    id: entity._id.toString(),
    title: entity.title,
    description: entity.description,
    summaryContent: entity.summaryContent,
    image: entity.image,
    listImage: entity.listImage,
    order: entity.order,
    isActive: entity.isActive,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}
const toAboutListDTO = (about) => {
  return about.map(toAboutDTO);
};

const getAllAbout = async (_, res) => {
  try {
    const items = await AboutEntity.find().sort({ order: 1 });
    return res.json({ code: 0, data: toAboutListDTO(items) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getAboutById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await AboutEntity.findById(id);
    if (!item) {
      return res.status(404).json({ code: 1, message: "About kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toAboutDTO(item) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const createAbout = async (req, res) => {
  try {
    const { title, image } = req.body;
    if (!title || !image) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu title ho\u1EB7c image" });
    }
    const lastItem = await AboutEntity.findOne().sort({ order: -1 });
    const maxOrder = lastItem ? lastItem.order : 0;
    const newItem = new AboutEntity({
      ...req.body,
      order: maxOrder + 1
    });
    await newItem.save();
    return res.status(201).json({ code: 0, message: "T\u1EA1o th\xE0nh c\xF4ng", data: toAboutDTO(newItem) });
  } catch (err) {
    return res.status(400).json({ code: 1, message: err.message });
  }
};
const updateAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await AboutEntity.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ code: 1, message: "About kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng", data: toAboutDTO(updated) });
  } catch (err) {
    return res.status(400).json({ code: 1, message: err.message });
  }
};
const deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AboutEntity.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ code: 1, message: "About kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "Xo\xE1 th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const updateOrder$3 = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;
    const currentItem = await AboutEntity.findById(id);
    if (!currentItem) {
      return res.status(404).json({ code: 1, message: "Item kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const existingItem = await AboutEntity.findOne({ order });
    if (existingItem) {
      const oldOrder = currentItem.order;
      existingItem.order = oldOrder;
      await existingItem.save();
    }
    currentItem.order = order;
    await currentItem.save();
    return res.json({ code: 0, message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const toggleActive$6 = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await AboutEntity.findById(id);
    if (!item) {
      return res.status(404).json({ code: 1, message: "about kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    item.isActive = !item.isActive;
    await item.save();
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i th\xE0nh c\xF4ng",
      data: toAboutDTO(item)
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

const router$a = Router();
router$a.get("/", getAllAbout);
router$a.get("/:id", getAboutById);
router$a.post("/", createAbout);
router$a.put("/:id", updateAbout);
router$a.delete("/:id", deleteAbout);
router$a.patch("/updateOrder/:id", updateOrder$3);
router$a.patch("/toggleActive/:id", toggleActive$6);

const aboutRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$a
}, Symbol.toStringTag, { value: 'Module' }));

const AddressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String },
    tag: {
      type: String,
      enum: ["Nh\xE0", "C\xF4ng ty", "Tr\u01B0\u1EDDng h\u1ECDc", "Kh\xE1c"],
      default: "Kh\xE1c"
    },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);
const AddressModel = model("Address", AddressSchema, "addresses");

function toAddressDTO(doc) {
  return {
    id: doc._id ? doc._id.toString() : "",
    userId: doc.userId ? doc.userId.toString() : "",
    fullname: doc.fullname,
    phone: doc.phone,
    address: doc.address,
    note: doc.note,
    tag: doc.tag,
    isDefault: doc.isDefault,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}
function toAddressListDTO(docs) {
  return docs.map(toAddressDTO);
}

const getAllAddress = async (req, res) => {
  try {
    const { userId } = req.params || req.query;
    if (!userId) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu userId" });
    }
    const addresses = await AddressModel.find({ userId });
    return res.json({ code: 0, data: toAddressListDTO(addresses) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await AddressModel.findById(id);
    if (!address) {
      return res.status(404).json({ code: 1, message: "address kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toAddressDTO(address) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const createAddress = async (req, res) => {
  try {
    const dataBody = req.body;
    const newAddress = new AddressModel(dataBody);
    if (dataBody.isDefault) {
      await AddressModel.updateMany(
        { userId: dataBody.userId },
        { $set: { isDefault: false } }
      );
    }
    await newAddress.save();
    return res.status(201).json({ code: 0, message: "T\u1EA1o th\xE0nh c\xF4ng", data: toAddressDTO(newAddress) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const dataBody = req.body;
    const address = await AddressModel.findById(id);
    if (!address) {
      return res.status(404).json({ code: 1, message: "address kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    if (dataBody.isDefault === true) {
      await AddressModel.updateMany(
        { userId: address.userId, _id: { $ne: id } },
        { $set: { isDefault: false } }
      );
    }
    Object.assign(address, dataBody);
    await address.save();
    return res.json({ code: 0, message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng", data: toAddressDTO(address) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await AddressModel.findByIdAndDelete(id);
    if (!address) {
      return res.status(404).json({ code: 1, message: "address kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "Xo\xE1 th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 2, message: err.message });
  }
};
const setAddressDefault = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await AddressModel.findById(id);
    if (!address) {
      return res.status(404).json({ code: 1, message: "address kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    await AddressModel.updateMany(
      { userId: address.userId },
      { $set: { isDefault: false } }
    );
    address.isDefault = true;
    await address.save();
    return res.json({ code: 0, message: "\u0110\u1EB7t \u0111\u1ECBa ch\u1EC9 m\u1EB7c \u0111\u1ECBnh th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getDefaultAddressByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu userId" });
    }
    const defaultAddress = await AddressModel.findOne({ userId, isDefault: true });
    if (!defaultAddress) {
      return res.status(400).json({ code: 2, message: "Kh\xF4ng t\xECm th\u1EA5y \u0111\u1ECBa ch\u1EC9 m\u1EB7c \u0111\u1ECBnh" });
    }
    return res.json({ code: 0, data: toAddressDTO(defaultAddress) });
  } catch (err) {
    return res.status(500).json({ code: 3, message: err.message });
  }
};

const router$9 = Router();
router$9.get("/default/:userId", getDefaultAddressByUserId);
router$9.get("/:userId", getAllAddress);
router$9.get("/:id", getAddressById);
router$9.post("/", createAddress);
router$9.put("/:id", updateAddress);
router$9.delete("/:id", deleteAddress);
router$9.post("/:id/set-default", setAddressDefault);

const addressesRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$9
}, Symbol.toStringTag, { value: 'Module' }));

const MembershipSchema = new Schema(
  {
    level: { type: String, enum: ["Bronze", "Silver", "Gold", "Platinum"], required: true },
    point: { type: Number, default: 0 },
    discountRate: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    barcode: { type: String },
    code: { type: Number }
  },
  { _id: false }
);
const UserSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    phone: { type: String },
    birthday: { type: Date },
    avatar: { type: String },
    active: { type: Boolean, default: true },
    role: { type: Number, default: 0 },
    membership: { type: MembershipSchema, required: true },
    resetToken: { type: String },
    resetTokenExpire: { type: Date },
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  { timestamps: true }
);
const UserModel = model("User", UserSchema, "users");

const MembershipLevelSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    minPoint: { type: Number, required: true },
    icon: { type: String },
    image: { type: String }
  },
  { timestamps: false }
);
const MembershipLevelModel = model(
  "MembershipLevel",
  MembershipLevelSchema,
  "membership_levels"
);

function toUserDTO(entity) {
  var _a, _b, _c, _d, _e, _f;
  return {
    id: ((_a = entity._id) == null ? void 0 : _a.toString()) || "",
    fullname: entity.fullname,
    email: entity.email,
    gender: entity.gender,
    phone: entity.phone || "",
    birthday: ((_b = entity.birthday) == null ? void 0 : _b.toString()) || null,
    avatar: entity.avatar || "",
    active: entity.active,
    role: entity.role,
    membership: {
      level: entity.membership.level,
      point: entity.membership.point,
      discountRate: entity.membership.discountRate,
      joinedAt: (_c = entity.membership.joinedAt) == null ? void 0 : _c.toString(),
      barcode: entity.membership.barcode || "",
      code: (_d = entity.membership.code) != null ? _d : 0
    },
    createdAt: ((_e = entity.createdAt) == null ? void 0 : _e.toISOString()) || "",
    updatedAt: ((_f = entity.updatedAt) == null ? void 0 : _f.toISOString()) || ""
  };
}
const toUserListDTO = (users) => {
  return users.map(toUserDTO);
};

async function generateBarcode(code, filename) {
  const filepath = path.join(process.cwd(), "public", "barcodes", filename);
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer({
      bcid: "code128",
      text: code,
      scale: 3,
      height: 10,
      includetext: false
    }, (err, png) => {
      if (err) return reject(err);
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      fs.writeFileSync(filepath, png);
      resolve("/barcodes/" + filename);
    });
  });
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "duongthanhnghe12071996@gmail.com",
    pass: "ehoegyzdvuexthep"
  }
});
const sendResetPasswordEmail = async (to, resetLink) => {
  const mailOptions = {
    from: "duongthanhnghe12071996@gmail.com",
    to,
    subject: "Kh\xF4i ph\u1EE5c m\u1EADt kh\u1EA9u",
    html: `
      <p>Ch\xE0o b\u1EA1n,</p>
      <p>Nh\u1EA5n v\xE0o li\xEAn k\u1EBFt d\u01B0\u1EDBi \u0111\xE2y \u0111\u1EC3 \u0111\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>N\u1EBFu b\u1EA1n kh\xF4ng y\xEAu c\u1EA7u, vui l\xF2ng b\u1ECF qua email n\xE0y.</p>
    `
  };
  await transporter.sendMail(mailOptions);
};

const SearchKeywordSchema = new Schema(
  {
    keyword: { type: String, required: true, trim: true, index: true },
    totalCount: { type: Number, default: 0 },
    lastSearchTime: { type: Date, default: Date.now }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);
const SearchKeywordModel = model("SearchKeyword", SearchKeywordSchema, "search_keywords");

function toSearchKeywordDTO(entity) {
  return {
    id: entity._id.toString(),
    keyword: entity.keyword,
    totalCount: entity.totalCount,
    lastSearchTime: entity.lastSearchTime,
    createdAt: entity.createdAt.toISOString()
  };
}
const toSearchKeywordListDTO = (keywords) => {
  return keywords.map(toSearchKeywordDTO);
};

function toMembershipLevelDTO(entity) {
  return {
    id: entity._id.toString(),
    name: entity.name,
    minPoint: entity.minPoint,
    icon: entity.icon,
    image: entity.image
  };
}
const toMembershipLevelListDTO = (items) => {
  return items.map(toMembershipLevelDTO);
};

const register = async (req, res) => {
  try {
    const { fullname, email, password, gender } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ code: 1, message: "Email \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u0103ng k\xFD" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const barcode = Date.now().toString();
    const barcodeFilename = `barcode-${barcode}.png`;
    const barcodePath = await generateBarcode(barcode, barcodeFilename);
    const user = await UserModel.create({
      fullname,
      email,
      password: hashedPassword,
      gender,
      phone: "",
      birthday: (/* @__PURE__ */ new Date()).toISOString(),
      avatar: process.env.IMAGE_AVATAR_DEFAULT || "",
      active: true,
      role: 1,
      membership: {
        level: "Bronze",
        point: 0,
        discountRate: 0,
        joinedAt: /* @__PURE__ */ new Date(),
        code: Date.now(),
        barcode: barcodePath || ""
      }
    });
    res.status(200).json({ code: 0, message: "Register success", data: toUserDTO(user) });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ code: 2, message: "Register failed", error: err.message || err });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ code: 2, message: "Email khong dung, vui long nhap lai!" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ code: 1, message: "Mat khau khong dung, vui long nhap lai!" });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.status(200).json({ code: 0, message: "\u0110\u0103ng nh\u1EADp th\xE0nh c\xF4ng", data: { token, user: toUserDTO(user) } });
  } catch (err) {
    res.status(500).json({ code: 500, message: "\u0110\u0103ng nh\u1EADp th\u1EA5t b\u1EA1i, vui l\xF2ng th\u1EED l\u1EA1i", error: err });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu email" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ code: 2, message: "Email kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const token = randomBytes(20).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1e3;
    await user.save();
    const resetLink = `${process.env.DOMAIN}/reset-password?email=${email}&token=${token}`;
    await sendResetPasswordEmail(email, resetLink);
    return res.status(200).json({
      code: 0,
      message: "\u0110\xE3 g\u1EEDi email \u0111\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u"
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({
      code: 500,
      message: "C\xF3 l\u1ED7i x\u1EA3y ra khi x\u1EED l\xFD y\xEAu c\u1EA7u",
      error: err
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.json({ code: 2, message: "Thi\u1EBFu d\u1EEF li\u1EC7u" });
    }
    const user = await UserModel.findOne({
      email,
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({
        code: 1,
        message: "Token kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n"
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = void 0;
    user.resetTokenExpire = void 0;
    await user.save();
    return res.status(200).json({
      code: 0,
      message: "\u0110\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u th\xE0nh c\xF4ng"
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({
      code: 500,
      message: "C\xF3 l\u1ED7i x\u1EA3y ra khi x\u1EED l\xFD y\xEAu c\u1EA7u",
      error: err
    });
  }
};
const updateAccount = async (req, res) => {
  const userId = req.user.id;
  const updated = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
  if (!updated) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ code: 200, message: "Update success", data: toUserDTO(updated) });
};
const deleteUsers = async (req, res) => {
  const { id } = req.params;
  await UserModel.findByIdAndDelete(id);
  res.json({ code: 200, message: "Delete success" });
};
const getAllUsers = async (_, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json({
      code: 0,
      data: toUserListDTO(users)
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message
    });
  }
};
const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) return res.status(404).json({ code: 404, message: "Not found" });
  res.json({ code: 0, data: toUserDTO(user) });
};
const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  const user = await UserModel.findById(userId);
  if (!user) return res.status(404).json({ code: 404, message: "User not found" });
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(401).json({ code: 401, message: "Wrong old password" });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ code: 200, message: "Password updated" });
};
const getAllMembershipLevel = async (_, res) => {
  try {
    const data = await MembershipLevelModel.find();
    return res.status(200).json({
      code: 0,
      data: toMembershipLevelListDTO(data)
    });
  } catch (error) {
    console.error("getAllMembershipLevel error:", error);
    return res.status(500).json({
      code: 1,
      message: "Internal server error",
      error: error.message
    });
  }
};
const setPoint = async (req, res) => {
  const { userId, point } = req.body;
  const user = await UserModel.findById(userId);
  if (!user) return res.status(404).json({ code: 1, message: "Kh\xF4ng t\xECm th\u1EA5y ng\u01B0\u1EDDi d\xF9ng" });
  user.membership.point = point;
  await user.save();
  res.json({ code: 0, message: "T\xEDch \u0111i\u1EC3m th\xE0nh c\xF4ng", data: toUserDTO(user) });
};
const getTopSearchKeyword = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const keywords = await SearchKeywordModel.find().sort({ totalCount: -1 }).limit(limit);
    return res.json({
      code: 0,
      data: toSearchKeywordListDTO(keywords)
    });
  } catch (error) {
    console.error("getTopSearchKeyword error:", error);
    return res.status(500).json({ code: 1, message: "Internal server error" });
  }
};
const logSearchKeyword = async (req, res) => {
  var _a;
  try {
    const keyword = (_a = req.body.keyword) == null ? void 0 : _a.trim().toLowerCase();
    if (!keyword) return res.status(400).json({ code: 1, message: "Keyword required" });
    const now = /* @__PURE__ */ new Date();
    const existing = await SearchKeywordModel.findOne({ keyword });
    if (existing) {
      existing.totalCount += 1;
      existing.lastSearchTime = now;
      await existing.save();
    } else {
      await SearchKeywordModel.create({
        keyword,
        totalCount: 1,
        lastSearchTime: now
      });
    }
    return res.status(200).json({ code: 0, message: "OK" });
  } catch (error) {
    console.error("logSearchKeyword error:", error);
    return res.status(500).json({ code: 1, message: "Internal server error" });
  }
};
const toggleActive$5 = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await UserModel.findById(id);
    if (!item) {
      return res.status(404).json({ code: 1, message: "User kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    item.active = !item.active;
    await item.save();
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i th\xE0nh c\xF4ng",
      data: toUserDTO(item)
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Thi\u1EBFu token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    console.log("decoded");
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token kh\xF4ng h\u1EE3p l\u1EC7" });
  }
};

const router$8 = express.Router();
router$8.get("/users", getAllUsers);
router$8.put("/users/me", authenticate, updateAccount);
router$8.get("/users/:id", getUserById);
router$8.patch("/users/toggleActive/:id", toggleActive$5);
router$8.post("/register", register);
router$8.post("/login", login);
router$8.post("/forgot-password", forgotPassword);
router$8.post("/reset-password", resetPassword);
router$8.post("/change-password", changePassword);
router$8.get("/membership-level", getAllMembershipLevel);
router$8.post("/set-point", setPoint);
router$8.post("/search-keywords/log", logSearchKeyword);
router$8.get("/search-keywords/list", getTopSearchKeyword);
router$8.delete("/:id", deleteUsers);

const authRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$8
}, Symbol.toStringTag, { value: 'Module' }));

const BannerSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);
const BannerEntity = model("Banner", BannerSchema, "banners");

function toBannerDTO(entity) {
  return {
    id: entity._id.toString(),
    title: entity.title,
    description: entity.description,
    image: entity.image,
    order: entity.order,
    isActive: entity.isActive,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}
const toBannerListDTO = (banners) => {
  return banners.map(toBannerDTO);
};

const getAllBanners = async (_, res) => {
  try {
    const banners = await BannerEntity.find().sort({ order: 1 });
    return res.json({ code: 0, data: toBannerListDTO(banners) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await BannerEntity.findById(id);
    if (!banner) {
      return res.status(404).json({ code: 1, message: "Banner kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toBannerDTO(banner) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const createBanner = async (req, res) => {
  try {
    const { title, description, image, isActive } = req.body;
    if (!title || !image) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu title ho\u1EB7c image" });
    }
    const lastItem = await BannerEntity.findOne().sort({ order: -1 });
    const maxOrder = lastItem ? lastItem.order : 0;
    const newItem = new BannerEntity({
      ...req.body,
      order: maxOrder + 1
    });
    await newItem.save();
    return res.status(201).json({ code: 0, message: "T\u1EA1o th\xE0nh c\xF4ng", data: toBannerDTO(newItem) });
  } catch (err) {
    return res.status(400).json({ code: 1, message: err.message });
  }
};
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await BannerEntity.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ code: 1, message: "Banner kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng", data: toBannerDTO(updated) });
  } catch (err) {
    return res.status(400).json({ code: 1, message: err.message });
  }
};
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BannerEntity.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ code: 1, message: "Banner kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "Xo\xE1 th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const updateOrder$2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;
    const currentItem = await BannerEntity.findById(id);
    if (!currentItem) {
      return res.status(404).json({ code: 1, message: "Item kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const existingItem = await BannerEntity.findOne({ order });
    if (existingItem) {
      const oldOrder = currentItem.order;
      existingItem.order = oldOrder;
      await existingItem.save();
    }
    currentItem.order = order;
    await currentItem.save();
    return res.json({ code: 0, message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const toggleActive$4 = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await BannerEntity.findById(id);
    if (!item) {
      return res.status(404).json({ code: 1, message: "Banner kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    item.isActive = !item.isActive;
    await item.save();
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i th\xE0nh c\xF4ng",
      data: toBannerDTO(item)
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

const router$7 = Router();
router$7.get("/", getAllBanners);
router$7.get("/:id", getBannerById);
router$7.post("/", createBanner);
router$7.put("/:id", updateBanner);
router$7.delete("/:id", deleteBanner);
router$7.patch("/updateOrder/:id", updateOrder$2);
router$7.patch("/toggleActive/:id", toggleActive$4);

const bannerRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$7
}, Symbol.toStringTag, { value: 'Module' }));

function generateSlug(text) {
  return text.toLowerCase().replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a").replace(/[èéẹẻẽêềếệểễ]/g, "e").replace(/[ìíịỉĩ]/g, "i").replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o").replace(/[ùúụủũưừứựửữ]/g, "u").replace(/[ỳýỵỷỹ]/g, "y").replace(/đ/g, "d").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const PostNewsSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    summaryContent: { type: String },
    isActive: { type: Boolean, default: true },
    categoryId: { type: Types.ObjectId, ref: "CategoryNews", required: true },
    views: { type: Number, default: 0 },
    author: { type: String },
    titleSEO: {
      type: String,
      trim: true
    },
    descriptionSEO: {
      type: String,
      maxlength: 160,
      trim: true,
      required: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug ch\u1EC9 \u0111\u01B0\u1EE3c ch\u1EE9a ch\u1EEF th\u01B0\u1EDDng, s\u1ED1 v\xE0 d\u1EA5u g\u1EA1ch ngang"]
    },
    keywords: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);
PostNewsSchema.index({ slug: 1 }, { unique: true });
PostNewsSchema.index({ isActive: 1, createdAt: -1 });
PostNewsSchema.index({ categoryId: 1, isActive: 1 });
PostNewsSchema.pre("save", function(next) {
  if (!this.slug && this.titleSEO) {
    this.slug = generateSlug(this.titleSEO);
  }
  next();
});
const PostNewsModel = model("Post", PostNewsSchema, "posts");
const CategoryNewsSchema = new Schema(
  {
    categoryName: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    summaryContent: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    titleSEO: {
      type: String,
      trim: true,
      required: true
    },
    descriptionSEO: {
      type: String,
      maxlength: 160,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug ch\u1EC9 \u0111\u01B0\u1EE3c ch\u1EE9a ch\u1EEF th\u01B0\u1EDDng, s\u1ED1 v\xE0 d\u1EA5u g\u1EA1ch ngang"]
    },
    keywords: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);
CategoryNewsSchema.index({ slug: 1 }, { unique: true });
CategoryNewsSchema.index({ isActive: 1, order: 1 });
CategoryNewsSchema.pre("save", function(next) {
  if (!this.slug && this.titleSEO) {
    this.slug = generateSlug(this.titleSEO);
  }
  next();
});
const CategoryNewsModel = model("CategoryNews", CategoryNewsSchema, "post_categories");

function toPostNewsDTO(entity) {
  return {
    id: entity._id.toString(),
    title: entity.title,
    summaryContent: entity.summaryContent,
    description: entity.description,
    image: entity.image,
    isActive: entity.isActive,
    categoryId: entity.categoryId.toString(),
    views: entity.views,
    author: entity.author,
    // SEO
    titleSEO: entity.titleSEO,
    descriptionSEO: entity.descriptionSEO,
    slug: entity.slug,
    keywords: entity.keywords,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}
const toPostNewsListDTO = (items) => {
  return items.map(toPostNewsDTO);
};
function toCategoryNewsDTO(entity) {
  return {
    id: entity._id.toString(),
    categoryName: entity.categoryName,
    summaryContent: entity.summaryContent,
    description: entity.description,
    image: entity.image,
    order: entity.order,
    isActive: entity.isActive,
    // SEO
    titleSEO: entity.titleSEO,
    descriptionSEO: entity.descriptionSEO,
    slug: entity.slug,
    keywords: entity.keywords,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}
const toCategoryNewsListDTO = (items) => {
  return items.map(toCategoryNewsDTO);
};

const getAllCategories$1 = async (_, res) => {
  try {
    const categories = await CategoryNewsModel.find().sort({ order: 1 });
    return res.json({
      code: 0,
      data: toCategoryNewsListDTO(categories)
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getCategoriesById$1 = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryNewsModel.findById(id);
    if (!category) {
      return res.status(404).json({ code: 1, message: "Category kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({
      code: 0,
      data: toCategoryNewsDTO(category)
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const createCategories$1 = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu categoryName" });
    }
    const lastItem = await CategoryNewsModel.findOne().sort({ order: -1 });
    const maxOrder = lastItem ? lastItem.order : 0;
    const newItem = new CategoryNewsModel({
      ...req.body,
      order: maxOrder + 1
    });
    await newItem.save();
    return res.status(201).json({
      code: 0,
      message: "T\u1EA1o th\xE0nh c\xF4ng",
      data: toCategoryNewsDTO(newItem)
    });
  } catch (err) {
    return res.status(400).json({ code: 1, message: err.message });
  }
};
const updateCategories$1 = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await CategoryNewsModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ code: 1, message: "Category kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng",
      data: toCategoryNewsDTO(updated)
    });
  } catch (err) {
    return res.status(400).json({ code: 1, message: err.message });
  }
};
const deleteCategories$1 = async (req, res) => {
  try {
    const { id } = req.params;
    const newsCount = await PostNewsModel.countDocuments({ categoryId: id });
    if (newsCount > 0) {
      return res.status(400).json({
        code: 1,
        message: "Kh\xF4ng th\u1EC3 xo\xE1, v\u1EABn c\xF2n b\xE0i vi\u1EBFt thu\u1ED9c nh\xF3m n\xE0y"
      });
    }
    const deleted = await CategoryNewsModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ code: 1, message: "Category kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "Xo\xE1 th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const updateOrder$1 = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;
    const currentItem = await CategoryNewsModel.findById(id);
    if (!currentItem) {
      return res.status(404).json({ code: 1, message: "Item kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const existingItem = await CategoryNewsModel.findOne({ order });
    if (existingItem) {
      const oldOrder = currentItem.order;
      existingItem.order = oldOrder;
      await existingItem.save();
    }
    currentItem.order = order;
    await currentItem.save();
    return res.json({ code: 0, message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const toggleActive$3 = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CategoryNewsModel.findById(id);
    if (!item) {
      return res.status(404).json({ code: 1, message: "category kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    item.isActive = !item.isActive;
    await item.save();
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i th\xE0nh c\xF4ng",
      data: toCategoryNewsDTO(item)
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await CategoryNewsModel.findOne({ slug });
    if (!category) {
      return res.status(404).json({ code: 1, message: "Category not found" });
    }
    res.json({ code: 0, data: category });
  } catch (err) {
    res.status(500).json({ code: 1, message: "Server error" });
  }
};

const router$6 = Router();
router$6.get("/", getAllCategories$1);
router$6.get("/slug/:slug", getCategoryBySlug);
router$6.get("/:id", getCategoriesById$1);
router$6.post("/", createCategories$1);
router$6.put("/:id", updateCategories$1);
router$6.delete("/:id", deleteCategories$1);
router$6.patch("/toggleActive/:id", toggleActive$3);
router$6.patch("/updateOrder/:id", updateOrder$1);

const categoriesNewsRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$6
}, Symbol.toStringTag, { value: 'Module' }));

const VariantSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    priceModifier: { type: Number, default: null },
    inStock: { type: Boolean, default: true }
  },
  { _id: false }
);
const OptionSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    required: { type: Boolean, default: false },
    variants: { type: [VariantSchema], default: [] }
  },
  { _id: false }
);
const ListImageSchema = new Schema(
  {
    id: { type: String, required: true },
    src: { type: String, required: true }
  },
  { _id: false }
);
const ProductSchema = new Schema(
  {
    productName: { type: String, required: true, trim: true },
    description: { type: String },
    summaryContent: { type: String },
    price: { type: Number, default: null },
    priceDiscounts: { type: Number, default: null },
    amount: { type: Number, default: null },
    amountOrder: { type: Number, default: 0 },
    image: { type: String, required: true },
    listImage: { type: [ListImageSchema], default: [] },
    options: { type: [OptionSchema], default: [] },
    categoryId: { type: Schema.Types.ObjectId, ref: "CategoryProduct", required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);
const CategoryProductSchema = new Schema(
  {
    categoryName: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);
const ProductEntity = model("Product", ProductSchema, "products");
const CategoryProductEntity = model("CategoryProduct", CategoryProductSchema, "product_categories");

function toVariantDTO(entity) {
  return {
    id: entity.id,
    name: entity.name,
    priceModifier: entity.priceModifier,
    inStock: entity.inStock
  };
}
function toOptionDTO(entity) {
  return {
    id: entity.id,
    name: entity.name,
    required: entity.required,
    variants: entity.variants.map(toVariantDTO)
  };
}
function toProductDTO(entity) {
  var _a, _b, _c;
  return {
    id: ((_a = entity._id) == null ? void 0 : _a.toString()) || "",
    productName: entity.productName,
    description: entity.description || "",
    summaryContent: entity.summaryContent || "",
    price: entity.price,
    priceDiscounts: entity.priceDiscounts,
    amount: entity.amount,
    amountOrder: entity.amountOrder,
    image: entity.image,
    listImage: entity.listImage,
    options: entity.options.map(toOptionDTO),
    categoryId: entity.categoryId ? entity.categoryId.toString() : "",
    isActive: entity.isActive,
    createdAt: ((_b = entity.createdAt) == null ? void 0 : _b.toISOString()) || "",
    updatedAt: ((_c = entity.updatedAt) == null ? void 0 : _c.toISOString()) || ""
  };
}
const toProductListDTO = (list) => list.map(toProductDTO);
function toCategoryProductDTO(entity) {
  var _a, _b, _c;
  return {
    id: ((_a = entity._id) == null ? void 0 : _a.toString()) || "",
    categoryName: entity.categoryName,
    description: entity.description || "",
    image: entity.image,
    order: entity.order,
    isActive: entity.isActive,
    createdAt: ((_b = entity.createdAt) == null ? void 0 : _b.toISOString()) || "",
    updatedAt: ((_c = entity.updatedAt) == null ? void 0 : _c.toISOString()) || ""
  };
}
const toCategoryProductListDTO = (list) => list.map(toCategoryProductDTO);

const getAllCategories = async (_, res) => {
  try {
    const categories = await CategoryProductEntity.find().lean().sort({ order: 1 });
    return res.json({ code: 0, data: toCategoryProductListDTO(categories) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getCategoriesById = async (req, res) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID kh\xF4ng h\u1EE3p l\u1EC7" });
    }
    const category = await CategoryProductEntity.findById(req.params.id).lean();
    if (!category) {
      return res.status(404).json({ code: 1, message: "Danh m\u1EE5c kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toCategoryProductDTO(category) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const createCategories = async (req, res) => {
  try {
    const { categoryName, image } = req.body;
    if (!categoryName || !image) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu categoryName ho\u1EB7c image" });
    }
    const existed = await CategoryProductEntity.findOne({ categoryName });
    if (existed) {
      return res.status(400).json({ code: 1, message: "Danh m\u1EE5c \u0111\xE3 t\u1ED3n t\u1EA1i" });
    }
    const lastItem = await CategoryProductEntity.findOne().sort({ order: -1 });
    const maxOrder = lastItem ? lastItem.order : 0;
    const newItem = new CategoryProductEntity({
      ...req.body,
      order: maxOrder + 1
    });
    await newItem.save();
    return res.status(201).json({ code: 0, message: "T\u1EA1o th\xE0nh c\xF4ng", data: toCategoryProductDTO(newItem) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const updateCategories = async (req, res) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID kh\xF4ng h\u1EE3p l\u1EC7" });
    }
    const updatedCategory = await CategoryProductEntity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();
    if (!updatedCategory) {
      return res.status(404).json({ code: 1, message: "Danh m\u1EE5c kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng", data: toCategoryProductDTO(updatedCategory) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const deleteCategories = async (req, res) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID kh\xF4ng h\u1EE3p l\u1EC7" });
    }
    const categoryId = new Types.ObjectId(req.params.id);
    const hasProducts = await ProductEntity.exists({ categoryId });
    if (hasProducts) {
      return res.json({
        code: 1,
        message: "Kh\xF4ng th\u1EC3 x\xF3a danh m\u1EE5c v\xEC v\u1EABn c\xF2n s\u1EA3n ph\u1EA9m trong danh m\u1EE5c n\xE0y"
      });
    }
    const deletedCategory = await CategoryProductEntity.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ code: 1, message: "Danh m\u1EE5c kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "Xo\xE1 th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getProductsByCategory = async (req, res) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID kh\xF4ng h\u1EE3p l\u1EC7" });
    }
    const categoryId = new Types.ObjectId(req.params.id);
    const products = await ProductEntity.find({ categoryId }).lean();
    return res.json({ code: 0, data: toProductListDTO(products) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;
    const currentItem = await CategoryProductEntity.findById(id);
    if (!currentItem) {
      return res.status(404).json({ code: 1, message: "Item kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const existingItem = await CategoryProductEntity.findOne({ order });
    if (existingItem) {
      const oldOrder = currentItem.order;
      existingItem.order = oldOrder;
      await existingItem.save();
    }
    currentItem.order = order;
    await currentItem.save();
    return res.json({ code: 0, message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const toggleActive$2 = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CategoryProductEntity.findById(id);
    if (!item) {
      return res.status(404).json({ code: 1, message: "Banner kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    item.isActive = !item.isActive;
    await item.save();
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i th\xE0nh c\xF4ng",
      data: toCategoryProductDTO(item)
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

const router$5 = Router();
router$5.get("/", getAllCategories);
router$5.get("/:id", getCategoriesById);
router$5.post("/", createCategories);
router$5.put("/:id", updateCategories);
router$5.delete("/:id", deleteCategories);
router$5.get("/:id/products", getProductsByCategory);
router$5.patch("/toggleActive/:id", toggleActive$2);
router$5.patch("/updateOrder/:id", updateOrder);

const categoriesProductRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$5
}, Symbol.toStringTag, { value: 'Module' }));

const uploadImageMulter = multer({ dest: "uploads/" });
multer({ dest: "uploads/" });

const getImages = async (req, res) => {
  try {
    const { folder, max_results = 10, next_cursor } = req.query;
    if (!folder) {
      return res.status(400).json({
        success: false,
        message: "Missing folder name"
      });
    }
    const search = v2.search.expression(`folder:${folder}`).sort_by("created_at", "desc").max_results(Number(max_results) || 10);
    if (next_cursor) {
      search.next_cursor(next_cursor);
    }
    const result = await search.execute();
    return res.status(200).json({
      success: true,
      images: result.resources.map((item) => ({
        url: item.secure_url,
        public_id: item.public_id,
        format: item.format,
        created_at: item.created_at,
        bytes: item.bytes,
        width: item.width,
        height: item.height
      })),
      next_cursor: result.next_cursor || null
    });
  } catch (err) {
    console.error("Get images error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to get images"
    });
  }
};
const getSubFolders = async (folderPath = "") => {
  let result;
  if (!folderPath) {
    result = await v2.api.root_folders();
  } else {
    result = await v2.api.sub_folders(folderPath);
  }
  const folders = result.folders || [];
  const tree = await Promise.all(
    folders.map(async (f) => {
      const fullPath = folderPath ? `${folderPath}/${f.name}` : f.name;
      const id = f.external_id || fullPath;
      const segments = fullPath.split("/");
      const children = await getSubFolders(fullPath);
      return {
        id,
        title: f.name,
        path: fullPath,
        segments,
        children
      };
    })
  );
  return tree;
};
const getFolders = async (_req, res) => {
  try {
    const tree = await getSubFolders();
    return res.status(200).json({
      success: true,
      data: tree
    });
  } catch (err) {
    console.error("Get folders tree error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.query;
    if (!publicId) {
      return res.status(400).json({ success: false, message: "publicId is required" });
    }
    const decodedId = decodeURIComponent(publicId);
    const result = await v2.uploader.destroy(decodedId);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Delete image error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
const searchImage = async (req, res) => {
  try {
    const { url, folder } = req.query;
    if (!url) {
      return res.status(400).json({ success: false, message: "url (keyQuery) is required" });
    }
    const keyQuery = decodeURIComponent(url);
    const folderPath = folder ? decodeURIComponent(folder) : void 0;
    const result = await v2.api.resources({
      type: "upload",
      prefix: folderPath,
      max_results: 500
    });
    const filtered = result.resources.filter(
      (item) => item.secure_url.includes(keyQuery)
    );
    return res.status(200).json({ success: true, data: filtered });
  } catch (err) {
    console.error("Search image error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
const uploadImage = async (req, res) => {
  var _a;
  let userId = (_a = req.body) == null ? void 0 : _a.userId;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const folder = userId ? `Member/member${userId}` : req.body.folder || "Default";
    const originalName = path.parse(req.file.originalname).name;
    let publicId = originalName;
    let attempt = 0;
    while (true) {
      const exists = await v2.api.resource(`${folder}/${publicId}`).then(() => true).catch(() => false);
      if (!exists) break;
      attempt++;
      publicId = `${originalName}(${attempt})`;
    }
    const uploaded = await v2.uploader.upload(req.file.path, {
      folder,
      use_filename: false,
      unique_filename: false,
      resource_type: "image",
      public_id: publicId
    });
    fs.unlinkSync(req.file.path);
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
      folder
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Upload failed"
    });
  }
};

const router$4 = express.Router();
router$4.get("/images", getImages);
router$4.get("/images/folders", getFolders);
router$4.delete("/images/delete", deleteImage);
router$4.get("/images/search", searchImage);
router$4.post("/images/upload", uploadImageMulter.single("file"), uploadImage);

const fileManageRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$4
}, Symbol.toStringTag, { value: 'Module' }));

const SelectedOptionsPushSchema = new Schema(
  {
    optionName: { type: String, required: true },
    variantName: { type: String, required: true },
    variantPrice: { type: Number, required: true }
  },
  { _id: false }
);
const CartItemsSchema = new Schema(
  {
    idProduct: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    priceDiscounts: { type: Number, required: true },
    quantity: { type: Number, required: true },
    note: { type: String },
    selectedOptionsPush: { type: [SelectedOptionsPushSchema], default: [] },
    finalPriceDiscounts: { type: Number }
  },
  { _id: false }
);
const PaymentSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);
const OrderStatusSchema = new Schema(
  {
    name: { type: String, required: true },
    status: { type: String, required: true },
    icon: { type: String }
  },
  { timestamps: true }
);
const OrderSchema = new Schema(
  {
    code: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    cartItems: { type: [CartItemsSchema], required: true },
    totalPrice: { type: Number, required: true },
    totalPriceSave: { type: Number, required: true },
    totalPriceCurrent: { type: Number, required: true },
    point: { type: Number, default: 0 },
    status: { type: Schema.Types.ObjectId, ref: "OrderStatus", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);
const PaymentEntity = model("Payment", PaymentSchema, "payments");
const OrderStatusEntity = model("OrderStatus", OrderStatusSchema, "order_status");
const OrderEntity = model("Order", OrderSchema, "orders");

function toPaymentDTO(entity) {
  var _a;
  return {
    id: ((_a = entity._id) == null ? void 0 : _a.toString()) || "",
    name: entity.name,
    description: entity.description || "",
    image: entity.image || ""
  };
}
const toPaymentListDTO = (payments) => payments.map(toPaymentDTO);
function toOrderStatusDTO(entity) {
  var _a;
  return {
    id: ((_a = entity._id) == null ? void 0 : _a.toString()) || "",
    name: entity.name,
    status: entity.status,
    icon: entity.icon || "",
    index: entity.index
  };
}
const toOrderStatusListDTO = (list) => list.map(toOrderStatusDTO);
function toOrderDTO(entity) {
  var _a, _b, _c;
  return {
    id: ((_a = entity._id) == null ? void 0 : _a.toString()) || "",
    code: entity.code,
    time: entity.time,
    address: entity.address,
    fullname: entity.fullname,
    phone: entity.phone,
    note: entity.note || "",
    // paymentId: entity.paymentId ? entity.paymentId.toString() : "",
    paymentId: toPaymentDTO(entity.paymentId),
    cartItems: Array.isArray(entity.cartItems) ? entity.cartItems.map(toCartItemDTO) : [],
    totalPrice: entity.totalPrice,
    totalPriceSave: entity.totalPriceSave,
    totalPriceCurrent: entity.totalPriceCurrent,
    point: entity.point || 0,
    // status: entity.status ? entity.status.toString() : "",
    status: toOrderStatusDTO(entity.status),
    userId: entity.userId ? entity.userId.toString() : null,
    createdAt: ((_b = entity.createdAt) == null ? void 0 : _b.toISOString()) || "",
    updatedAt: ((_c = entity.updatedAt) == null ? void 0 : _c.toISOString()) || ""
  };
}
const toOrderListDTO = (orders) => orders.map(toOrderDTO);
function toCartItemDTO(entity) {
  return {
    idProduct: entity.idProduct ? new Types.ObjectId(entity.idProduct) : new Types.ObjectId(),
    priceDiscounts: entity.priceDiscounts,
    quantity: entity.quantity,
    note: entity.note || "",
    selectedOptionsPush: Array.isArray(entity.selectedOptionsPush) ? entity.selectedOptionsPush.map(toSelectedOptionDTO) : [],
    finalPriceDiscounts: entity.finalPriceDiscounts
  };
}
function toSelectedOptionDTO(entity) {
  return {
    optionName: entity.optionName,
    variantName: entity.variantName,
    variantPrice: entity.variantPrice
  };
}

const getAllOrder = async (_, res) => {
  try {
    const orders = await OrderEntity.find().populate("cartItems.idProduct").populate("paymentId").populate("status").sort({ createdAt: -1 });
    return res.json({ code: 0, data: toOrderListDTO(orders) });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({
      code: 1,
      message: err.message || "Internal Server Error",
      data: []
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    const order = await OrderEntity.findById(req.params.id).populate("paymentId").populate("status");
    if (!order) {
      return res.status(404).json({ code: 1, message: "Order kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toOrderDTO(order) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const createOrder = async (req, res) => {
  try {
    const { data, userId, point } = req.body;
    if (!(data == null ? void 0 : data.fullname) || !(data == null ? void 0 : data.phone) || !(data == null ? void 0 : data.paymentId) || !(data == null ? void 0 : data.cartItems)) {
      return res.status(400).json({ code: 1, message: "D\u1EEF li\u1EC7u \u0111\u01A1n h\xE0ng kh\xF4ng h\u1EE3p l\u1EC7" });
    }
    const newOrder = await OrderEntity.create({ ...data, userId });
    let membershipUpdate = null;
    if (userId && typeof point === "number" && point > 0) {
      membershipUpdate = await setPointAndUpgrade(userId, point);
    }
    return res.status(201).json({
      code: 0,
      message: "\u0110\u1EB7t h\xE0ng th\xE0nh c\xF4ng",
      data: toOrderDTO(newOrder),
      membership: membershipUpdate
    });
  } catch (err) {
    console.error("L\u1ED7i createOrder:", err);
    return res.status(500).json({ code: 2, message: "L\u1ED7i server" });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const deleted = await OrderEntity.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ code: 1, message: "Order kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "Xo\xE1 th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await OrderEntity.find({ userId: req.params.userId }).populate("paymentId").populate("status").sort({ createdAt: -1 });
    return res.json({ code: 0, data: orders.map(toOrderDTO) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getAllStatus = async (_, res) => {
  try {
    const status = await OrderStatusEntity.find().sort({ index: 1 });
    return res.json({ code: 0, data: toOrderStatusListDTO(status) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getAllPayment = async (_, res) => {
  try {
    const payments = await PaymentEntity.find();
    return res.json({ code: 0, data: toPaymentListDTO(payments) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const setPointAndUpgrade = async (userId, point) => {
  var _a, _b;
  const user = await UserModel.findById(userId);
  if (!user) return null;
  const levels = await MembershipLevelModel.find();
  const newPoint = (((_a = user.membership) == null ? void 0 : _a.point) || 0) + point;
  const newLevel = levels.filter((level) => newPoint >= level.minPoint).sort((a, b) => b.minPoint - a.minPoint)[0];
  const levelChanged = newLevel && ((_b = user.membership) == null ? void 0 : _b.level) !== newLevel.name;
  if (newLevel) user.membership.level = newLevel.name;
  user.membership.point = newPoint;
  await user.save();
  return {
    level: user.membership.level,
    point: user.membership.point,
    levelChanged
  };
};

const router$3 = Router();
router$3.get("/", getAllOrder);
router$3.get("/status", getAllStatus);
router$3.get("/payments", getAllPayment);
router$3.get("/:id", getOrderById);
router$3.post("/", createOrder);
router$3.delete("/:id", deleteOrder);
router$3.get("/users/:userId/orders", getOrdersByUserId);

const orderManageRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$3
}, Symbol.toStringTag, { value: 'Module' }));

const getAllPosts = async (_, res) => {
  try {
    const posts = await PostNewsModel.find();
    return res.json({ code: 0, data: toPostNewsListDTO(posts) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getPostsById = async (req, res) => {
  try {
    const post = await PostNewsModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ code: 1, message: "Kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toPostNewsDTO(post) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const createPosts = async (req, res) => {
  try {
    const newPost = new PostNewsModel(req.body);
    await newPost.save();
    return res.status(201).json({ code: 0, message: "T\u1EA1o th\xE0nh c\xF4ng", data: toPostNewsDTO(newPost) });
  } catch (err) {
    return res.status(400).json({ code: 1, message: err.message });
  }
};
const updatePosts = async (req, res) => {
  try {
    const updated = await PostNewsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ code: 1, message: "Kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng", data: toPostNewsDTO(updated) });
  } catch (err) {
    return res.status(400).json({ code: 1, message: err.message });
  }
};
const deletePosts = async (req, res) => {
  try {
    const deleted = await PostNewsModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ code: 1, message: "Kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "Xo\xE1 th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getPostsLatest = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const posts = await PostNewsModel.find().sort({ createdAt: -1 }).limit(limit);
    return res.json({ code: 0, data: toPostNewsListDTO(posts) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const toggleActive$1 = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await PostNewsModel.findById(id);
    if (!item) {
      return res.status(404).json({ code: 1, message: "item kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    item.isActive = !item.isActive;
    await item.save();
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i th\xE0nh c\xF4ng",
      data: toPostNewsDTO(item)
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

const router$2 = Router();
router$2.get("/", getAllPosts);
router$2.get("/latest", getPostsLatest);
router$2.get("/:id", getPostsById);
router$2.post("/", createPosts);
router$2.put("/:id", updatePosts);
router$2.delete("/:id", deletePosts);
router$2.patch("/toggleActive/:id", toggleActive$1);

const postsNewsRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$2
}, Symbol.toStringTag, { value: 'Module' }));

const WishlistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);
const WishlistModel = model("Wishlist", WishlistSchema, "wishlists");

const getAllProduct = async (_, res) => {
  try {
    const products = await ProductEntity.find();
    return res.json({ code: 0, data: toProductListDTO(products) });
  } catch (err) {
    console.error("Get all product error:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getProductById = async (req, res) => {
  try {
    const product = await ProductEntity.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ code: 1, message: "Product kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toProductDTO(product) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const createProduct = async (req, res) => {
  try {
    const data = req.body;
    if (!(data == null ? void 0 : data.productName) || !(data == null ? void 0 : data.image) || !(data == null ? void 0 : data.categoryId) || !(data == null ? void 0 : data.price)) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu d\u1EEF li\u1EC7u" });
    }
    const categoryExists = await CategoryProductEntity.findById(data.categoryId);
    if (!categoryExists) {
      return res.status(400).json({ code: 1, message: "Category kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const newProduct = await ProductEntity.create({
      ...data,
      categoryId: new mongoose.Types.ObjectId(data.categoryId)
    });
    return res.status(201).json({
      code: 0,
      message: "T\u1EA1o th\xE0nh c\xF4ng",
      data: toProductDTO(newProduct)
    });
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.categoryId) {
      data.categoryId = new mongoose.Types.ObjectId(data.categoryId);
    }
    const updated = await ProductEntity.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return res.status(404).json({ code: 1, message: "Product kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng",
      data: toProductDTO(updated)
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const deleted = await ProductEntity.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ code: 1, message: "Product kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "Xo\xE1 th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getWishlistByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await WishlistModel.find({
      userId: new mongoose.Types.ObjectId(userId)
    }).populate("productId");
    return res.json({ code: 0, data: items });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const addWishlistItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ code: 1, message: "productId is required" });
    const existed = await WishlistModel.findOne({ userId, productId });
    if (existed) return res.status(409).json({ code: 1, message: "Already in wishlist" });
    const newItem = await WishlistModel.create({ userId, productId });
    return res.status(201).json({ code: 0, data: newItem });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const deleteWishlistItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const deleted = await WishlistModel.findOneAndDelete({ userId, productId });
    if (!deleted) return res.status(404).json({ code: 1, message: "Not found" });
    return res.json({ code: 0, message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getMostOrderedProduct = async (req, res) => {
  var _a;
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const orders = await OrderEntity.find().lean();
    const products = await ProductEntity.find().lean();
    const productMap = {};
    for (const order of orders) {
      for (const item of order.cartItems) {
        const id = (_a = item.idProduct) == null ? void 0 : _a.toString();
        if (!id) continue;
        if (!productMap[id]) {
          const productInfo = products.find(
            (p) => p._id.toString() === id
          );
          if (!productInfo) continue;
          productMap[id] = { product: productInfo, quantity: 0 };
        }
        productMap[id].quantity += item.quantity || 1;
      }
    }
    const topProducts = Object.values(productMap).sort((a, b) => b.quantity - a.quantity).slice(0, limit);
    res.json({
      code: 0,
      data: toProductListDTO(topProducts.map(
        (p) => ({
          ...p.product,
          totalOrdered: p.quantity
        })
      ))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 1, message: "Server error" });
  }
};
const toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ProductEntity.findById(id);
    if (!item) {
      return res.status(404).json({ code: 1, message: "product kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    item.isActive = !item.isActive;
    await item.save();
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i th\xE0nh c\xF4ng",
      data: toProductDTO(item)
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

const router$1 = Router();
router$1.get("/", getAllProduct);
router$1.get("/most-order", getMostOrderedProduct);
router$1.post("/", createProduct);
router$1.get("/:id", getProductById);
router$1.put("/:id", updateProduct);
router$1.delete("/:id", deleteProduct);
router$1.patch("/toggleActive/:id", toggleActive);
router$1.get("/users/:userId/wishlist", getWishlistByUserId);
router$1.post("/users/:userId/wishlist", addWishlistItem);
router$1.delete("/users/:userId/wishlist/:productId", deleteWishlistItem);

const productRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$1
}, Symbol.toStringTag, { value: 'Module' }));

const updateSettings = async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "public/data/settings.json");
    const oldData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const newData = { ...oldData, ...req.body || {} };
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), "utf8");
    return res.json({ code: 0, message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng", data: newData });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

const router = Router();
router.put("/update", updateSettings);

const settingRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
  return {
    body: stringify(splitPayload(ssrContext).payload, ssrContext._payloadReducers) ,
    statusCode: getResponseStatus(ssrContext.event),
    statusMessage: getResponseStatusText(ssrContext.event),
    headers: {
      "content-type": "application/json;charset=utf-8" ,
      "x-powered-by": "Nuxt"
    }
  };
}
function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    "type": "application/json",
    "innerHTML": contents,
    "data-nuxt-data": appId,
    "data-ssr": !(opts.ssrContext.noSSR)
  };
  {
    payload.id = "__NUXT_DATA__";
  }
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  const config = uneval(opts.ssrContext.config);
  return [
    payload,
    {
      innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}`
    }
  ];
}
function splitPayload(ssrContext) {
  const { data, prerenderedAt, ...initial } = ssrContext.payload;
  return {
    initial: { ...initial, prerenderedAt },
    payload: { data, prerenderedAt }
  };
}

const renderSSRHeadOptions = {"omitLineBreaks":false};

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const ssrContext = createSSRContext(event);
  const headEntryOptions = { mode: "server" };
  ssrContext.head.push(appHead, headEntryOptions);
  if (ssrError) {
    ssrError.statusCode &&= Number.parseInt(ssrError.statusCode);
    setSSRError(ssrContext, ssrError);
  }
  const isRenderingPayload = PAYLOAD_URL_RE.test(ssrContext.url);
  if (isRenderingPayload) {
    const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
    ssrContext.url = url;
    event._path = event.node.req.url = url;
  }
  const routeOptions = getRouteRules(event);
  if (routeOptions.ssr === false) {
    ssrContext.noSSR = true;
  }
  const renderer = await getRenderer(ssrContext);
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  const inlinedStyles = [];
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  if (isRenderingPayload) {
    const response = renderPayloadResponse(ssrContext);
    return response;
  }
  const NO_SCRIPTS = routeOptions.noScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  if (ssrContext._preloadManifest && !NO_SCRIPTS) {
    ssrContext.head.push({
      link: [
        { rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`) }
      ]
    }, { ...headEntryOptions, tagPriority: "low" });
  }
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  const link = [];
  for (const resource of Object.values(styles)) {
    if ("inline" in getQuery(resource.file)) {
      continue;
    }
    link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
  }
  if (link.length) {
    ssrContext.head.push({ link }, headEntryOptions);
  }
  if (!NO_SCRIPTS) {
    ssrContext.head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      script: renderPayloadJsonScript({ ssrContext, data: ssrContext.payload }) 
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.noScripts) {
    const tagPosition = "head";
    ssrContext.head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        // if we are rendering script tag payloads that import an async payload
        // we need to ensure this resolves before executing the Nuxt entry
        tagPosition,
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
  const htmlContext = {
    htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
    head: normalizeChunks([headTags]),
    bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [
      replaceIslandTeleports(ssrContext, _rendered.html) ,
      APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG
    ],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  return {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
});
function normalizeChunks(chunks) {
  return chunks.filter(Boolean).map((i) => i.trim());
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  if (chunks.length === 0) {
    return "";
  }
  return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}

const renderer$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: renderer
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
