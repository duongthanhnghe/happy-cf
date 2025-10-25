import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, createError, getQuery as getQuery$1, readBody, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, getRouterParam, getResponseStatusText } from 'file:///Users/ttcenter/happy-cf/node_modules/h3/dist/index.mjs';
import { Server } from 'node:http';
import path, { resolve, dirname, join } from 'node:path';
import nodeCrypto, { randomBytes } from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { escapeHtml } from 'file:///Users/ttcenter/happy-cf/node_modules/@vue/shared/dist/shared.cjs.js';
import express, { Router } from 'file:///Users/ttcenter/happy-cf/node_modules/express/index.js';
import fs, { promises } from 'node:fs';
import jwt from 'file:///Users/ttcenter/happy-cf/node_modules/jsonwebtoken/index.js';
import mongoose, { model, Schema, Types } from 'file:///Users/ttcenter/happy-cf/node_modules/mongoose/index.js';
import mongoosePaginate from 'file:///Users/ttcenter/happy-cf/node_modules/mongoose-paginate-v2/dist/index.js';
import multer from 'file:///Users/ttcenter/happy-cf/node_modules/multer/index.js';
import { v2 } from 'file:///Users/ttcenter/happy-cf/node_modules/cloudinary/cloudinary.js';
import bcrypt from 'file:///Users/ttcenter/happy-cf/node_modules/bcryptjs/index.js';
import bwipjs from 'file:///Users/ttcenter/happy-cf/node_modules/bwip-js/dist/bwip-js-node.mjs';
import nodemailer from 'file:///Users/ttcenter/happy-cf/node_modules/nodemailer/lib/nodemailer.js';
import { OAuth2Client } from 'file:///Users/ttcenter/happy-cf/node_modules/google-auth-library/build/src/index.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file:///Users/ttcenter/happy-cf/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, joinRelativeURL } from 'file:///Users/ttcenter/happy-cf/node_modules/ufo/dist/index.mjs';
import { renderToString } from 'file:///Users/ttcenter/happy-cf/node_modules/vue/server-renderer/index.mjs';
import destr, { destr as destr$1 } from 'file:///Users/ttcenter/happy-cf/node_modules/destr/dist/index.mjs';
import { createHooks } from 'file:///Users/ttcenter/happy-cf/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file:///Users/ttcenter/happy-cf/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file:///Users/ttcenter/happy-cf/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file:///Users/ttcenter/happy-cf/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file:///Users/ttcenter/happy-cf/node_modules/unstorage/drivers/fs.mjs';
import { digest } from 'file:///Users/ttcenter/happy-cf/node_modules/ohash/dist/index.mjs';
import { klona } from 'file:///Users/ttcenter/happy-cf/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file:///Users/ttcenter/happy-cf/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file:///Users/ttcenter/happy-cf/node_modules/scule/dist/index.mjs';
import { getContext } from 'file:///Users/ttcenter/happy-cf/node_modules/unctx/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file:///Users/ttcenter/happy-cf/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file:///Users/ttcenter/happy-cf/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file:///Users/ttcenter/happy-cf/node_modules/youch-core/build/index.js';
import { Youch } from 'file:///Users/ttcenter/happy-cf/node_modules/nitropack/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file:///Users/ttcenter/happy-cf/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { stringify, uneval } from 'file:///Users/ttcenter/happy-cf/node_modules/devalue/index.js';
import { captureRawStackTrace, parseRawStackTrace } from 'file:///Users/ttcenter/happy-cf/node_modules/errx/dist/index.js';
import { isVNode, toValue, isRef } from 'file:///Users/ttcenter/happy-cf/node_modules/vue/index.mjs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file:///Users/ttcenter/happy-cf/node_modules/pathe/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file:///Users/ttcenter/happy-cf/node_modules/unhead/dist/server.mjs';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file:///Users/ttcenter/happy-cf/node_modules/unhead/dist/plugins.mjs';
import { walkResolver } from 'file:///Users/ttcenter/happy-cf/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"/Users/ttcenter/happy-cf/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/ttcenter/happy-cf","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/ttcenter/happy-cf/server","watchOptions":{"ignored":[null]}}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/ttcenter/happy-cf/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/ttcenter/happy-cf/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"/Users/ttcenter/happy-cf/.data/kv"}));

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
      "/**": {
        "headers": {
          "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
          "Cross-Origin-Embedder-Policy": "unsafe-none"
        }
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
    "siteUrl": "http://localhost:3000",
    "siteName": "Happy Coffee",
    "siteDescription": "Mô tả website",
    "siteImage": "/assets/logo.png",
    "cloudinaryCloudName": "dl8wwezqp",
    "GOOGLE_CLIENT_ID": "1036928626180-p62cm07r5mtp5gisv2jd433eskrismq6.apps.googleusercontent.com",
    "sepayAccountNo": "04430890101",
    "sepayBankId": "970423",
    "sepayAccountName": "DUONG THANH NGHE"
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

const _MRDWUy9DsFcnizuzTLbV6XRfpVRJgrhF9AE4NuIF6A = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const rootDir = "/Users/ttcenter/happy-cf";

const appHead = {"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"name":"author","content":"Happy Coffee"},{"property":"og:site_name","content":"Happy Coffee"},{"property":"og:locale","content":"vi_VN"},{"http-equiv":"Cross-Origin-Opener-Policy","content":"same-origin-allow-popups"},{"http-equiv":"Cross-Origin-Embedder-Policy","content":"unsafe-none"}],"link":[{"rel":"stylesheet","href":"https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght@100..700"}],"style":[],"script":[{"src":"https://cdn.ckeditor.com/ckeditor5/39.0.1/super-build/ckeditor.js","defer":true},{"innerHTML":"\n            document.addEventListener(\"DOMContentLoaded\", function() { \n              const div = document.createElement(\"div\"); \n              div.id = \"loader\"; \n              div.className = \"loader\"; \n              div.innerHTML = '<div class=\"loader-icon\"></div>'; \n              document.body.insertBefore(div, document.body.firstChild); \n            });\n          ","type":"text/javascript"}],"noscript":[],"htmlAttrs":{"lang":"vi"}};

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
const _6dnK270kw12H9eqH5B6vNhXuuZYDsnNpZ4gQcGRiGi0 = (nitroApp) => {
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
  _MRDWUy9DsFcnizuzTLbV6XRfpVRJgrhF9AE4NuIF6A,
_6dnK270kw12H9eqH5B6vNhXuuZYDsnNpZ4gQcGRiGi0
];

const assets = {
  "/index.mjs": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3cb53-sZNhJjWs6HJL0fMM18jckj34ppc\"",
    "mtime": "2025-10-25T04:44:53.317Z",
    "size": 248659,
    "path": "index.mjs"
  },
  "/index.mjs.map": {
    "type": "application/json",
    "etag": "\"e7fca-AcniD0IIo6Ee4eL3TAoeY+GxB5g\"",
    "mtime": "2025-10-25T04:44:53.320Z",
    "size": 950218,
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
const _uxO0JW = eventHandler((event) => {
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
const getServerEntry = () => import('file:///Users/ttcenter/happy-cf/.nuxt//dist/server/server.mjs').then((r) => r.default || r);
const getClientManifest = () => import('file:///Users/ttcenter/happy-cf/.nuxt//dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
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

const _lazy_WZOimk = () => Promise.resolve().then(function () { return addressesRouter; });
const _lazy_tuVKNW = () => Promise.resolve().then(function () { return aboutRouter; });
const _lazy_wad1E_ = () => Promise.resolve().then(function () { return bannerRouter$1; });
const _lazy_TqIHqT = () => Promise.resolve().then(function () { return categoriesNewsRouter$1; });
const _lazy_rYJmrv = () => Promise.resolve().then(function () { return categoriesProductRouter$1; });
const _lazy_ZkwUyZ = () => Promise.resolve().then(function () { return index$2; });
const _lazy_uLsZkj = () => Promise.resolve().then(function () { return orderManageRouter$1; });
const _lazy_xiyN0M = () => Promise.resolve().then(function () { return paymentTransactionRoutes; });
const _lazy_keFZb5 = () => Promise.resolve().then(function () { return postsNewsRouter$1; });
const _lazy_H3u2OJ = () => Promise.resolve().then(function () { return productReviewRouter$1; });
const _lazy_AInuxj = () => Promise.resolve().then(function () { return productRouter$1; });
const _lazy_NI8dax = () => Promise.resolve().then(function () { return settingRouter; });
const _lazy_iadr18 = () => Promise.resolve().then(function () { return usersRouter$1; });
const _lazy_5UO9M7 = () => Promise.resolve().then(function () { return voucherRouter; });
const _lazy_6thR5q = () => Promise.resolve().then(function () { return authRouter; });
const _lazy_5GTSlq = () => Promise.resolve().then(function () { return bannerRouter; });
const _lazy_ndfMJ7 = () => Promise.resolve().then(function () { return categoriesNewsRouter; });
const _lazy_5F7aiU = () => Promise.resolve().then(function () { return categoriesProductRouter; });
const _lazy_Snf5SD = () => Promise.resolve().then(function () { return index; });
const _lazy_Ti7wbR = () => Promise.resolve().then(function () { return orderManageRouter; });
const _lazy_soYMBM = () => Promise.resolve().then(function () { return postsNewsRouter; });
const _lazy_AH2XbG = () => Promise.resolve().then(function () { return productReviewRouter; });
const _lazy_FuVwdC = () => Promise.resolve().then(function () { return productRouter; });
const _lazy_yozqhu = () => Promise.resolve().then(function () { return fileManageRouter; });
const _lazy_qiGXOx = () => Promise.resolve().then(function () { return index$1; });
const _lazy_QCha66 = () => Promise.resolve().then(function () { return locationRouter; });
const _lazy_T3AZC3 = () => Promise.resolve().then(function () { return usersRouter; });
const _lazy_wB4Btu = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '', handler: _uxO0JW, lazy: false, middleware: true, method: undefined },
  { route: '/v1/addressesRouter', handler: _lazy_WZOimk, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin/aboutRouter', handler: _lazy_tuVKNW, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin/bannerRouter', handler: _lazy_wad1E_, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin/categoriesNewsRouter', handler: _lazy_TqIHqT, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin/categoriesProductRouter', handler: _lazy_rYJmrv, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin', handler: _lazy_ZkwUyZ, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin/orderManageRouter', handler: _lazy_uLsZkj, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin/paymentTransactionRoutes', handler: _lazy_xiyN0M, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin/postsNewsRouter', handler: _lazy_keFZb5, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin/productReviewRouter', handler: _lazy_H3u2OJ, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin/productRouter', handler: _lazy_AInuxj, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin/settingRouter', handler: _lazy_NI8dax, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin/usersRouter', handler: _lazy_iadr18, lazy: true, middleware: false, method: undefined },
  { route: '/v1/admin/voucherRouter', handler: _lazy_5UO9M7, lazy: true, middleware: false, method: undefined },
  { route: '/v1/authRouter', handler: _lazy_6thR5q, lazy: true, middleware: false, method: undefined },
  { route: '/v1/bannerRouter', handler: _lazy_5GTSlq, lazy: true, middleware: false, method: undefined },
  { route: '/v1/categoriesNewsRouter', handler: _lazy_ndfMJ7, lazy: true, middleware: false, method: undefined },
  { route: '/v1/categoriesProductRouter', handler: _lazy_5F7aiU, lazy: true, middleware: false, method: undefined },
  { route: '/v1', handler: _lazy_Snf5SD, lazy: true, middleware: false, method: undefined },
  { route: '/v1/orderManageRouter', handler: _lazy_Ti7wbR, lazy: true, middleware: false, method: undefined },
  { route: '/v1/postsNewsRouter', handler: _lazy_soYMBM, lazy: true, middleware: false, method: undefined },
  { route: '/v1/productReviewRouter', handler: _lazy_AH2XbG, lazy: true, middleware: false, method: undefined },
  { route: '/v1/productRouter', handler: _lazy_FuVwdC, lazy: true, middleware: false, method: undefined },
  { route: '/v1/shared/fileManageRouter', handler: _lazy_yozqhu, lazy: true, middleware: false, method: undefined },
  { route: '/v1/shared', handler: _lazy_qiGXOx, lazy: true, middleware: false, method: undefined },
  { route: '/v1/shared/locationRouter', handler: _lazy_QCha66, lazy: true, middleware: false, method: undefined },
  { route: '/v1/usersRouter', handler: _lazy_T3AZC3, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_wB4Btu, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_wB4Btu, lazy: true, middleware: false, method: undefined }
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
    isDefault: { type: Boolean, default: false },
    provinceCode: { type: Number, required: true },
    districtCode: { type: Number, required: true },
    wardCode: { type: Number, required: true }
  },
  { timestamps: true }
);
const AddressModel = model("Address", AddressSchema, "addresses");

function toAddressDTO(doc) {
  return {
    id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : "",
    fullname: doc.fullname,
    phone: doc.phone,
    address: doc.address,
    // chi tiết: số nhà, đường
    note: doc.note,
    tag: doc.tag,
    isDefault: doc.isDefault,
    provinceCode: doc.provinceCode,
    districtCode: doc.districtCode,
    wardCode: doc.wardCode,
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
    const address = await AddressModel.findById(id).lean();
    if (!address) {
      return res.status(404).json({ code: 1, message: "address kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toAddressDTO(address) });
  } catch (err) {
    console.error("Error getAddressById:", err);
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

const authenticate = (req, res, next) => {
  var _a;
  const token = (_a = req.cookies) == null ? void 0 : _a.token;
  if (!token) {
    return res.status(401).json({ message: "Thi\u1EBFu token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token kh\xF4ng h\u1EE3p l\u1EC7" });
  }
};

const router$q = Router();
router$q.get("/default/:userId", authenticate, getDefaultAddressByUserId);
router$q.get("/user/:userId", authenticate, getAllAddress);
router$q.get("/:id", authenticate, getAddressById);
router$q.post("/", authenticate, createAddress);
router$q.put("/:id", authenticate, updateAddress);
router$q.delete("/:id", authenticate, deleteAddress);
router$q.post("/:id/set-default", authenticate, setAddressDefault);

const addressesRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$q
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

const authenticateAdmin = (req, res, next) => {
  var _a;
  const token = (_a = req.cookies) == null ? void 0 : _a.token;
  if (!token) return res.status(401).json({ code: 1, message: "Thi\u1EBFu token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    if (decoded.role !== 2) {
      return res.status(403).json({ code: 1, message: "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n truy c\u1EADp (Admin only)" });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ code: 1, message: "Token kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n" });
  }
};

const router$p = Router();
router$p.get("/", authenticateAdmin, getAllAbout);
router$p.get("/:id", getAboutById);
router$p.post("/", authenticateAdmin, createAbout);
router$p.put("/:id", authenticateAdmin, updateAbout);
router$p.delete("/:id", authenticateAdmin, deleteAbout);
router$p.patch("/updateOrder/:id", authenticateAdmin, updateOrder$3);
router$p.patch("/toggleActive/:id", authenticateAdmin, toggleActive$6);

const aboutRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$p
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

const getAllBanners$1 = async (_, res) => {
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
const toggleActive$5 = async (req, res) => {
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

const router$o = Router();
router$o.get("/", authenticateAdmin, getAllBanners$1);
router$o.get("/:id", getBannerById);
router$o.post("/", authenticateAdmin, createBanner);
router$o.put("/:id", authenticateAdmin, updateBanner);
router$o.delete("/:id", authenticateAdmin, deleteBanner);
router$o.patch("/updateOrder/:id", authenticateAdmin, updateOrder$2);
router$o.patch("/toggleActive/:id", authenticateAdmin, toggleActive$5);

const bannerRouter$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$o
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

const getAllCategories$3 = async (_, res) => {
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
const getCategoriesById$3 = async (req, res) => {
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
const toggleActive$4 = async (req, res) => {
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

const router$n = Router();
router$n.get("/", authenticateAdmin, getAllCategories$3);
router$n.get("/:id", getCategoriesById$3);
router$n.post("/", authenticateAdmin, createCategories$1);
router$n.put("/:id", authenticateAdmin, updateCategories$1);
router$n.delete("/:id", authenticateAdmin, deleteCategories$1);
router$n.patch("/toggleActive/:id", authenticateAdmin, toggleActive$4);
router$n.patch("/updateOrder/:id", authenticateAdmin, updateOrder$1);

const categoriesNewsRouter$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$n
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
    weight: { type: Number, default: 0 },
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
const CategoryProductSchema = new Schema(
  {
    categoryName: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    parentId: { type: Schema.Types.ObjectId, ref: "CategoryProduct", default: null },
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
    weight: entity.weight,
    isActive: entity.isActive,
    createdAt: ((_b = entity.createdAt) == null ? void 0 : _b.toISOString()) || "",
    updatedAt: ((_c = entity.updatedAt) == null ? void 0 : _c.toISOString()) || "",
    // SEO
    titleSEO: entity.titleSEO,
    descriptionSEO: entity.descriptionSEO,
    slug: entity.slug,
    keywords: entity.keywords
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
    parentId: entity.parentId ? entity.parentId.toString() : "",
    // SEO
    titleSEO: entity.titleSEO,
    descriptionSEO: entity.descriptionSEO,
    slug: entity.slug,
    keywords: entity.keywords,
    createdAt: ((_b = entity.createdAt) == null ? void 0 : _b.toISOString()) || "",
    updatedAt: ((_c = entity.updatedAt) == null ? void 0 : _c.toISOString()) || ""
  };
}
const toCategoryProductListDTO = (list) => list.map(toCategoryProductDTO);

function buildCategoryTree$1(list) {
  const map = /* @__PURE__ */ new Map();
  list.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });
  const tree = [];
  map.forEach((cat) => {
    if (cat.parentId) {
      const parent = map.get(cat.parentId);
      if (parent) {
        parent.children.push(cat);
      } else {
        tree.push(cat);
      }
    } else {
      tree.push(cat);
    }
  });
  return tree;
}
const getAllCategoriesTree$1 = async (_, res) => {
  try {
    const categories = await CategoryProductEntity.find().lean().sort({ order: 1 });
    const dtoList = toCategoryProductListDTO(categories);
    const tree = buildCategoryTree$1(dtoList);
    return res.json({ code: 0, data: tree });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getAllCategories$2 = async (_, res) => {
  try {
    const categories = await CategoryProductEntity.find().lean().sort({ order: 1 });
    return res.json({ code: 0, data: toCategoryProductListDTO(categories) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getCategoriesById$2 = async (req, res) => {
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
    const { categoryName, image, parentId } = req.body;
    if (!categoryName || !image) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu categoryName ho\u1EB7c image" });
    }
    if (parentId && !Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ code: 1, message: "parentId kh\xF4ng h\u1EE3p l\u1EC7" });
    }
    if (parentId) {
      const parent = await CategoryProductEntity.findById(parentId);
      if (!parent) {
        return res.status(400).json({ code: 1, message: "Danh m\u1EE5c cha kh\xF4ng t\u1ED3n t\u1EA1i" });
      }
    }
    const existed = await CategoryProductEntity.findOne({ categoryName });
    if (existed) {
      return res.status(400).json({ code: 1, message: "Danh m\u1EE5c \u0111\xE3 t\u1ED3n t\u1EA1i" });
    }
    const lastItem = await CategoryProductEntity.findOne().sort({ order: -1 });
    const maxOrder = lastItem ? lastItem.order : 0;
    const newItem = new CategoryProductEntity({
      ...req.body,
      parentId: parentId || null,
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
    if (req.body.parentId === "") {
      delete req.body.parentId;
    }
    const { parentId } = req.body;
    if (parentId && !Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ code: 1, message: "parentId kh\xF4ng h\u1EE3p l\u1EC7" });
    }
    if (parentId) {
      const parent = await CategoryProductEntity.findById(parentId);
      if (!parent) {
        return res.status(400).json({ code: 1, message: "Danh m\u1EE5c cha kh\xF4ng t\u1ED3n t\u1EA1i" });
      }
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
    const hasChildren = await CategoryProductEntity.exists({ parentId: categoryId });
    if (hasChildren) {
      return res.json({
        code: 1,
        message: "Kh\xF4ng th\u1EC3 x\xF3a danh m\u1EE5c v\xEC v\u1EABn c\xF2n danh m\u1EE5c con"
      });
    }
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
const toggleActive$3 = async (req, res) => {
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

const router$m = Router();
router$m.get("/tree", authenticateAdmin, getAllCategoriesTree$1);
router$m.get("/", authenticateAdmin, getAllCategories$2);
router$m.get("/:id", getCategoriesById$2);
router$m.post("/", authenticateAdmin, createCategories);
router$m.put("/:id", authenticateAdmin, updateCategories);
router$m.delete("/:id", authenticateAdmin, deleteCategories);
router$m.patch("/toggleActive/:id", authenticateAdmin, toggleActive$3);
router$m.patch("/updateOrder/:id", authenticateAdmin, updateOrder);

const categoriesProductRouter$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$m
}, Symbol.toStringTag, { value: 'Module' }));

const updateSettings = async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "./public/data/settings.json");
    const oldData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const newData = { ...oldData, ...req.body || {} };
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), "utf8");
    return res.json({ code: 0, message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng", data: newData });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

const router$l = Router();
router$l.put("/update", authenticateAdmin, updateSettings);

const settingRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$l
}, Symbol.toStringTag, { value: 'Module' }));

const MembershipSchema = new Schema(
  {
    level: { type: String, enum: ["Bronze", "Silver", "Gold", "Platinum"], required: true },
    point: { type: Number, default: 0 },
    balancePoint: { type: Number, default: 0 },
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
    password: { type: String, required: function() {
      return this.authProvider !== "google";
    } },
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local"
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
      default: "other"
    },
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
UserSchema.plugin(mongoosePaginate);
const UserModel = model("User", UserSchema, "users");

const MembershipBenefitSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String }
  },
  { timestamps: true }
);
const MembershipBenefitModel = model(
  "MembershipBenefit",
  MembershipBenefitSchema,
  "membership_benefits"
);

const MembershipLevelSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    minPoint: { type: Number, required: true },
    icon: { type: String },
    image: { type: String },
    discountRate: { type: Number },
    benefits: [{ type: Schema.Types.ObjectId, ref: "MembershipBenefit" }]
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
    gender: entity.gender || void 0,
    phone: entity.phone || "",
    birthday: ((_b = entity.birthday) == null ? void 0 : _b.toString()) || null,
    avatar: entity.avatar || "",
    googleId: entity.googleId,
    authProvider: entity.authProvider,
    active: entity.active,
    role: entity.role,
    membership: {
      level: entity.membership.level,
      point: entity.membership.point,
      balancePoint: entity.membership.balancePoint,
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

function toMembershipBenefitDTO(entity) {
  return {
    id: entity._id.toString(),
    name: entity.name,
    description: entity.description,
    icon: entity.icon,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString()
  };
}
const toMembershipBenefitListDTO = (items) => {
  return items.map(toMembershipBenefitDTO);
};

function toMembershipLevelDTO(entity) {
  return {
    id: entity._id.toString(),
    name: entity.name,
    minPoint: entity.minPoint,
    icon: entity.icon,
    image: entity.image,
    discountRate: entity.discountRate,
    benefits: Array.isArray(entity.benefits) ? toMembershipBenefitListDTO(entity.benefits) : []
  };
}
const toMembershipLevelListDTO = (items) => {
  return items.map(toMembershipLevelDTO);
};

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
    image: { type: String },
    method: { type: String }
  },
  { timestamps: true }
);
const OrderStatusSchema = new Schema(
  {
    name: { type: String, required: true },
    status: { type: String, required: true },
    icon: { type: String },
    index: { type: Number }
  },
  { timestamps: true }
);
const OrderSchema = new Schema(
  {
    code: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    provinceCode: { type: Number, required: true },
    districtCode: { type: Number, required: true },
    wardCode: { type: Number, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    cartItems: { type: [CartItemsSchema], required: true },
    totalPrice: { type: Number, required: true },
    totalPriceSave: { type: Number, required: true },
    totalPriceCurrent: { type: Number, required: true },
    totalDiscountOrder: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    status: { type: Schema.Types.ObjectId, ref: "OrderStatus", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    transaction: { type: Schema.Types.ObjectId, ref: "PaymentTransaction" },
    reward: {
      points: { type: Number, default: 0 },
      awarded: { type: Boolean, default: false },
      awardedAt: { type: Date, default: null }
    },
    usedPoints: { type: Number, default: 0 },
    pointsRefunded: { type: Boolean, default: false },
    membershipDiscountRate: { type: Number, default: 0 },
    membershipDiscountAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);
OrderSchema.plugin(mongoosePaginate);
const PaymentEntity = model("Payment", PaymentSchema, "payments");
const OrderStatusEntity = model("OrderStatus", OrderStatusSchema, "order_status");
const OrderEntity = model("Order", OrderSchema, "orders");

const PAYMENT_TRANSACTION_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded"
};
const PaymentTransactionStatusText = {
  [PAYMENT_TRANSACTION_STATUS.PENDING]: "Ch\u1EDD thanh to\xE1n",
  [PAYMENT_TRANSACTION_STATUS.PAID]: "\u0110\xE3 thanh to\xE1n",
  [PAYMENT_TRANSACTION_STATUS.FAILED]: "Thanh to\xE1n th\u1EA5t b\u1EA1i",
  [PAYMENT_TRANSACTION_STATUS.REFUNDED]: "\u0110\xE3 ho\xE0n ti\u1EC1n"
};
const PaymentTransactionStatusColor = {
  [PAYMENT_TRANSACTION_STATUS.PENDING]: "orange",
  [PAYMENT_TRANSACTION_STATUS.PAID]: "green",
  [PAYMENT_TRANSACTION_STATUS.FAILED]: "red",
  [PAYMENT_TRANSACTION_STATUS.REFUNDED]: "blue"
};

function toPaymentTransactionDTO(entity) {
  var _a, _b, _c, _d;
  return {
    id: ((_a = entity._id) == null ? void 0 : _a.toString()) || "",
    orderId: ((_b = entity.orderId) == null ? void 0 : _b.toString()) || "",
    amount: entity.amount,
    method: entity.method,
    status: entity.status,
    statusText: PaymentTransactionStatusText[entity.status],
    statusColor: PaymentTransactionStatusColor[entity.status],
    createdAt: ((_c = entity.createdAt) == null ? void 0 : _c.toISOString()) || "",
    updatedAt: ((_d = entity.updatedAt) == null ? void 0 : _d.toISOString()) || ""
  };
}
const toPaymentTransactionListDTO = (list) => list.map(toPaymentTransactionDTO);

function toPaymentDTO(entity) {
  var _a;
  return {
    id: ((_a = entity._id) == null ? void 0 : _a.toString()) || "",
    name: entity.name,
    description: entity.description || "",
    image: entity.image || "",
    method: entity.method || null
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
  var _a, _b, _c, _d, _e;
  return {
    id: ((_a = entity._id) == null ? void 0 : _a.toString()) || "",
    code: entity.code,
    time: entity.time,
    address: entity.address,
    fullname: entity.fullname,
    provinceCode: entity.provinceCode,
    districtCode: entity.districtCode,
    wardCode: entity.wardCode,
    phone: entity.phone,
    note: entity.note || "",
    paymentId: toPaymentDTO(entity.paymentId),
    cartItems: Array.isArray(entity.cartItems) ? entity.cartItems.map(toCartItemDTO) : [],
    totalPrice: entity.totalPrice,
    totalPriceSave: entity.totalPriceSave,
    totalPriceCurrent: entity.totalPriceCurrent,
    totalDiscountOrder: entity.totalDiscountOrder,
    shippingFee: entity.shippingFee,
    status: toOrderStatusDTO(entity.status),
    userId: entity.userId ? entity.userId._id ? entity.userId._id.toString() : entity.userId.toString() : null,
    transaction: entity.transaction ? toPaymentTransactionDTO(entity.transaction) : null,
    reward: entity.reward ? {
      points: (_b = entity.reward.points) != null ? _b : 0,
      awarded: (_c = entity.reward.awarded) != null ? _c : false,
      awardedAt: entity.reward.awardedAt ? new Date(entity.reward.awardedAt).toISOString() : null
    } : {
      points: 0,
      awarded: false,
      awardedAt: null
    },
    usedPoints: entity.usedPoints,
    pointsRefunded: entity.pointsRefunded,
    membershipDiscountRate: entity.membershipDiscountRate,
    membershipDiscountAmount: entity.membershipDiscountAmount,
    createdAt: ((_d = entity.createdAt) == null ? void 0 : _d.toISOString()) || "",
    updatedAt: ((_e = entity.updatedAt) == null ? void 0 : _e.toISOString()) || ""
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

const deleteUsers = async (req, res) => {
  const { id } = req.params;
  await UserModel.findByIdAndDelete(id);
  res.json({ code: 200, message: "Delete success" });
};
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role ? parseInt(req.query.role) : void 0;
    const filter = {};
    if (role !== void 0) {
      filter.role = role;
    }
    if (limit === -1) {
      const users = await UserModel.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({
        code: 0,
        data: toUserListDTO(users),
        pagination: {
          total: users.length,
          totalPages: 1,
          page: 1,
          limit: users.length
        }
      });
    }
    const options = {
      page,
      limit,
      sort: { createdAt: -1 }
    };
    const result = await UserModel.paginate(filter, options);
    return res.status(200).json({
      code: 0,
      data: toUserListDTO(result.docs),
      pagination: {
        total: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit
      }
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
const getUserById$1 = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) return res.status(404).json({ code: 404, message: "Not found" });
  res.json({ code: 0, data: toUserDTO(user) });
};
const getAllMembershipLevel = async (_, res) => {
  try {
    const data = await MembershipLevelModel.find().populate("benefits");
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
const getMembershipLevelById = async (req, res) => {
  try {
    const { id } = req.params;
    const level = await MembershipLevelModel.findById(id).populate("benefits");
    if (!level) {
      return res.status(404).json({
        code: 1,
        message: "Membership level kh\xF4ng t\u1ED3n t\u1EA1i"
      });
    }
    return res.json({
      code: 0,
      data: toMembershipLevelDTO(level)
    });
  } catch (error) {
    console.error("getMembershipLevelById error:", error);
    return res.status(500).json({
      code: 1,
      message: "Internal server error",
      error: error.message
    });
  }
};
const updateMembershipLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await MembershipLevelModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("benefits");
    if (!updated) {
      return res.status(404).json({
        code: 1,
        message: "Membership level not found"
      });
    }
    return res.json({
      code: 0,
      message: "Membership level updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("updateMembershipLevel error:", error);
    return res.status(500).json({
      code: 1,
      message: "Internal server error",
      error: error.message
    });
  }
};
const toggleActive$2 = async (req, res) => {
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
const createMembershipBenefit = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const existing = await MembershipBenefitModel.findOne({ name });
    if (existing) {
      return res.status(400).json({ code: 1, message: "Benefit \u0111\xE3 t\u1ED3n t\u1EA1i" });
    }
    const benefit = await MembershipBenefitModel.create({ name, description, icon });
    return res.status(201).json({
      code: 0,
      message: "T\u1EA1o benefit th\xE0nh c\xF4ng",
      data: toMembershipBenefitDTO(benefit)
    });
  } catch (err) {
    console.error("createMembershipBenefit error:", err);
    return res.status(500).json({ code: 1, message: "Internal server error", error: err.message });
  }
};
const getAllMembershipBenefits = async (_, res) => {
  try {
    const benefits = await MembershipBenefitModel.find().sort({ createdAt: -1 });
    return res.json({
      code: 0,
      data: toMembershipBenefitListDTO(benefits)
    });
  } catch (err) {
    console.error("getAllMembershipBenefits error:", err);
    return res.status(500).json({ code: 1, message: "Internal server error", error: err.message });
  }
};
const getMembershipBenefitById = async (req, res) => {
  try {
    const { id } = req.params;
    const benefit = await MembershipBenefitModel.findById(id);
    if (!benefit) return res.status(404).json({ code: 1, message: "Benefit kh\xF4ng t\u1ED3n t\u1EA1i" });
    return res.json({ code: 0, data: toMembershipBenefitDTO(benefit) });
  } catch (err) {
    console.error("getMembershipBenefitById error:", err);
    return res.status(500).json({ code: 1, message: "Internal server error", error: err.message });
  }
};
const updateMembershipBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const benefit = await MembershipBenefitModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!benefit) return res.status(404).json({ code: 1, message: "Benefit kh\xF4ng t\u1ED3n t\u1EA1i" });
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt benefit th\xE0nh c\xF4ng",
      data: toMembershipBenefitDTO(benefit)
    });
  } catch (err) {
    console.error("updateMembershipBenefit error:", err);
    return res.status(500).json({ code: 1, message: "Internal server error", error: err.message });
  }
};
const deleteMembershipBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    const benefit = await MembershipBenefitModel.findById(id);
    if (!benefit) {
      return res.status(404).json({ code: 1, message: "Benefit kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const levelUsing = await MembershipLevelModel.findOne({ benefits: id });
    if (levelUsing) {
      return res.status(400).json({
        code: 1,
        message: `Kh\xF4ng th\u1EC3 x\xF3a Benefit v\xEC \u0111ang \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng trong c\u1EA5p \u0111\u1ED9 th\xE0nh vi\xEAn "${levelUsing.name}"`
      });
    }
    await MembershipBenefitModel.findByIdAndDelete(id);
    return res.json({ code: 0, message: "X\xF3a benefit th\xE0nh c\xF4ng" });
  } catch (err) {
    console.error("deleteMembershipBenefit error:", err);
    return res.status(500).json({ code: 1, message: "Internal server error", error: err.message });
  }
};
const getRewardHistory = async (req, res) => {
  try {
    let { page = 1, limit = 20, userId } = req.query;
    const numPage = Number(page);
    const numLimit = Number(limit);
    const query = {
      $or: [
        { "reward.points": { $gt: 0 } },
        { usedPoints: { $gt: 0 } },
        { pointsRefunded: true }
      ]
    };
    if (userId) {
      query.userId = userId;
    }
    const result = await OrderEntity.paginate(query, {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 },
      populate: [
        { path: "userId", model: "User", select: "fullname email phone membership.balancePoint" },
        { path: "paymentId", model: "Payment" },
        { path: "status", model: "OrderStatus" },
        { path: "transaction", model: "PaymentTransaction" }
      ]
    });
    const history = result.docs.map((order) => {
      var _a;
      let historyType = "";
      let points = 0;
      if (order.usedPoints > 0 && order.pointsRefunded) {
        historyType = "refunded";
        points = order.usedPoints;
      } else if (order.usedPoints > 0) {
        historyType = "used";
        points = order.usedPoints;
      } else if (order.reward.points > 0 && order.reward.awarded) {
        historyType = "earned";
        points = order.reward.points;
      } else if (order.reward.points > 0 && !order.reward.awarded) {
        historyType = "pending_reward";
        points = order.reward.points;
      } else {
        historyType = "none";
      }
      return {
        orderId: order._id,
        code: order.code,
        createdAt: order.createdAt,
        user: order.userId ? {
          id: order.userId._id,
          fullname: order.userId.fullname,
          email: order.userId.email,
          phone: order.userId.phone,
          currentPoint: ((_a = order.userId.membership) == null ? void 0 : _a.balancePoint) || 0
        } : null,
        historyType,
        points,
        order: toOrderDTO(order)
      };
    });
    return res.json({
      code: 0,
      message: "L\u1EA5y l\u1ECBch s\u1EED t\xEDch \u0111i\u1EC3m th\xE0nh c\xF4ng",
      data: history,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs
      }
    });
  } catch (err) {
    console.error("\u{1F4A5} getAllRewardHistoryForAdmin error:", err);
    return res.status(500).json({
      code: 1,
      message: "L\u1ED7i server khi l\u1EA5y l\u1ECBch s\u1EED t\xEDch \u0111i\u1EC3m"
    });
  }
};

const router$k = express.Router();
router$k.get("/reward-history", authenticateAdmin, getRewardHistory);
router$k.get("/membership-level", getAllMembershipLevel);
router$k.get("/membership-level/:id", getMembershipLevelById);
router$k.put("/membership-level/:id", authenticateAdmin, updateMembershipLevel);
router$k.get("/membership-benefit", getAllMembershipBenefits);
router$k.get("/membership-benefit/:id", getMembershipBenefitById);
router$k.post("/membership-benefit", authenticateAdmin, createMembershipBenefit);
router$k.put("/membership-benefit/:id", authenticateAdmin, updateMembershipBenefit);
router$k.delete("/membership-benefit/:id", authenticateAdmin, deleteMembershipBenefit);
router$k.get("/", authenticateAdmin, getAllUsers);
router$k.get("/:id", getUserById$1);
router$k.patch("/toggleActive/:id", authenticateAdmin, toggleActive$2);
router$k.delete("/:id", authenticateAdmin, deleteUsers);

const usersRouter$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$k
}, Symbol.toStringTag, { value: 'Module' }));

const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    const query = {};
    if (limit === -1) {
      limit = await PostNewsModel.countDocuments(query);
    }
    const skip = (page - 1) * limit;
    const [total, posts] = await Promise.all([
      PostNewsModel.countDocuments(),
      PostNewsModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
    ]);
    const totalPages = Math.ceil(total / limit);
    return res.json({
      code: 0,
      data: toPostNewsListDTO(posts),
      pagination: { page, limit, total, totalPages },
      message: "Success"
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getPostsById$1 = async (req, res) => {
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

const router$j = Router();
router$j.get("/", authenticateAdmin, getAllPosts);
router$j.get("/:id", getPostsById$1);
router$j.post("/", authenticateAdmin, createPosts);
router$j.put("/:id", authenticateAdmin, updatePosts);
router$j.delete("/:id", authenticateAdmin, deletePosts);
router$j.patch("/toggleActive/:id", authenticateAdmin, toggleActive$1);

const postsNewsRouter$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$j
}, Symbol.toStringTag, { value: 'Module' }));

const ORDER_STATUS = {
  PENDING: "68a93304c9f7de47a9f3a7e2",
  CONFIRMED: "68a93304c9f7de47a9f3a7e3",
  DELIVERING: "68a93304c9f7de47a9f3a7e4",
  COMPLETED: "68a93304c9f7de47a9f3a7e5",
  CANCELLED: "68a93304c9f7de47a9f3a7e6"
};

const PRODUCT_REVIEW_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected"
};
const ProductReviewStatusText = {
  [PRODUCT_REVIEW_STATUS.PENDING]: "Ch\u01B0a \u0111\xE1nh gi\xE1",
  [PRODUCT_REVIEW_STATUS.APPROVED]: "\u0110\xE3 \u0111\xE1nh gi\xE1",
  [PRODUCT_REVIEW_STATUS.REJECTED]: "\u0110\xE3 b\u1ECB \u1EA9n"
};
const ProductReviewStatusColor = {
  [PRODUCT_REVIEW_STATUS.PENDING]: "orange",
  [PRODUCT_REVIEW_STATUS.APPROVED]: "green",
  [PRODUCT_REVIEW_STATUS.REJECTED]: "red"
};

const ProductReviewSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, default: "" },
    images: { type: [String], default: [] },
    status: { type: String, enum: Object.values(PRODUCT_REVIEW_STATUS), default: PRODUCT_REVIEW_STATUS.PENDING }
  },
  { timestamps: true }
);
ProductReviewSchema.plugin(mongoosePaginate);
const ProductReviewEntity = model("ProductReview", ProductReviewSchema, "product_reviews");

const getAllOrder = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    const numPage = Number(page);
    let numLimit = Number(limit);
    if (numLimit === -1) {
      const orders = await OrderEntity.find({}).sort({ createdAt: -1 }).populate("paymentId").populate("status").populate("userId").populate({ path: "transaction", model: "PaymentTransaction" });
      return res.json({
        code: 0,
        data: toOrderListDTO(orders),
        pagination: {
          page: 1,
          limit: orders.length,
          totalPages: 1,
          total: orders.length
        }
      });
    }
    const options = {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 },
      populate: [
        { path: "paymentId", model: "Payment" },
        { path: "status", model: "OrderStatus" },
        { path: "userId", model: "User" },
        { path: "transaction", model: "PaymentTransaction" }
      ]
    };
    const result = await OrderEntity.paginate({}, options);
    return res.json({
      code: 0,
      data: toOrderListDTO(result.docs),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs
      }
    });
  } catch (error) {
    return res.status(500).json({ code: 1, message: "L\u1ED7i l\u1EA5y danh s\xE1ch order", error });
  }
};
const getOrderById$1 = async (req, res) => {
  try {
    const order = await OrderEntity.findById(req.params.id).populate("paymentId").populate("status").populate("userId").populate({ path: "transaction", model: "PaymentTransaction" });
    if (!order) {
      return res.status(404).json({ code: 1, message: "Order kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toOrderDTO(order) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
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
const updateOrderStatus = async (req, res) => {
  var _a, _b;
  try {
    const { orderId, statusId } = req.body;
    if (!orderId || !statusId) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu orderId ho\u1EB7c statusId" });
    }
    const status = await OrderStatusEntity.findById(statusId);
    if (!status) {
      return res.status(404).json({ code: 1, message: "Status kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const order = await OrderEntity.findById(orderId);
    if (!order) {
      return res.status(404).json({ code: 1, message: "Order kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    if (((_a = order.status) == null ? void 0 : _a.toString()) === ORDER_STATUS.COMPLETED || ((_b = order.status) == null ? void 0 : _b.toString()) === ORDER_STATUS.CANCELLED) {
      return res.status(400).json({
        code: 1,
        message: "\u0110\u01A1n h\xE0ng \u0111\xE3 ho\xE0n t\u1EA5t ho\u1EB7c \u0111\xE3 h\u1EE7y, kh\xF4ng th\u1EC3 thay \u0111\u1ED5i tr\u1EA1ng th\xE1i n\u1EEFa"
      });
    }
    order.status = statusId;
    if (status.id === ORDER_STATUS.COMPLETED && order.userId) {
      const existingReviews = await ProductReviewEntity.find({ orderId });
      if (existingReviews.length === 0) {
        const reviews = order.cartItems.map((item) => ({
          orderId,
          userId: order.userId,
          productId: item.idProduct,
          rating: 0,
          comment: null,
          images: [],
          status: "pending"
        }));
        await ProductReviewEntity.insertMany(reviews);
      }
    }
    if (status.id === ORDER_STATUS.COMPLETED && order.userId && !order.reward.awarded) {
      await setPointAndUpgrade(order.userId.toString(), order.reward.points);
      order.reward.awarded = true;
      order.reward.awardedAt = /* @__PURE__ */ new Date();
      await order.save();
    }
    if (status.id === ORDER_STATUS.CANCELLED && order.userId && order.usedPoints > 0) {
      if (!order.pointsRefunded) {
        const user = await UserModel.findById(order.userId);
        if (user) {
          user.membership.balancePoint += order.usedPoints;
          await user.save();
          order.pointsRefunded = true;
        }
      }
    }
    await order.save();
    return res.json({ code: 0, message: "C\u1EADp nh\u1EADt status th\xE0nh c\xF4ng", data: toOrderDTO(order) });
  } catch (err) {
    console.error("L\u1ED7i updateOrderStatus:", err);
    return res.status(500).json({ code: 1, message: err.message || "Internal Server Error" });
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
  var _a, _b, _c, _d;
  const user = await UserModel.findById(userId);
  if (!user) return null;
  const levels = await MembershipLevelModel.find();
  const newPoint = (((_a = user.membership) == null ? void 0 : _a.point) || 0) + point;
  const newBalancePoint = (((_b = user.membership) == null ? void 0 : _b.balancePoint) || 0) + point;
  const newLevel = levels.filter((level) => newPoint >= level.minPoint).sort((a, b) => b.minPoint - a.minPoint)[0];
  const levelChanged = newLevel && ((_c = user.membership) == null ? void 0 : _c.level) !== newLevel.name;
  if (newLevel) {
    user.membership.level = newLevel.name;
    user.membership.discountRate = (_d = newLevel.discountRate) != null ? _d : 0;
  }
  user.membership.point = newPoint;
  user.membership.balancePoint = newBalancePoint;
  await user.save();
  return {
    level: user.membership.level,
    point: user.membership.point,
    balancePoint: user.membership.balancePoint,
    discountRate: user.membership.discountRate,
    levelChanged
  };
};

const router$i = Router();
router$i.get("/", authenticateAdmin, getAllOrder);
router$i.get("/status", getAllStatus);
router$i.get("/payments", getAllPayment);
router$i.get("/:id", getOrderById$1);
router$i.delete("/:id", authenticateAdmin, deleteOrder);
router$i.put("/status", authenticateAdmin, updateOrderStatus);

const orderManageRouter$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$i
}, Symbol.toStringTag, { value: 'Module' }));

const getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    const query = {};
    if (limit === -1) {
      limit = await ProductEntity.countDocuments(query);
    }
    const skip = (page - 1) * limit;
    const [total, products] = await Promise.all([
      ProductEntity.countDocuments(query),
      ProductEntity.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ]);
    const totalPages = Math.ceil(total / limit);
    return res.json({
      code: 0,
      data: toProductListDTO(products),
      pagination: { page, limit, total, totalPages },
      message: "Success"
    });
  } catch (err) {
    console.error("Get all product error:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getProductById$1 = async (req, res) => {
  try {
    let product;
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      product = await ProductEntity.findById(req.params.id);
    } else {
      product = await ProductEntity.findOne({ slug: req.params.id });
    }
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

const router$h = Router();
router$h.get("/", authenticateAdmin, getAllProduct);
router$h.post("/", authenticateAdmin, createProduct);
router$h.get("/:id", getProductById$1);
router$h.put("/:id", authenticateAdmin, updateProduct);
router$h.delete("/:id", authenticateAdmin, deleteProduct);
router$h.patch("/toggleActive/:id", authenticateAdmin, toggleActive);

const productRouter$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$h
}, Symbol.toStringTag, { value: 'Module' }));

const PaymentTransactionSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["cash", "bank_transfer"], required: true },
    status: {
      type: String,
      enum: Object.values(PAYMENT_TRANSACTION_STATUS),
      default: PAYMENT_TRANSACTION_STATUS.PENDING
    }
  },
  { timestamps: true }
);
PaymentTransactionSchema.plugin(mongoosePaginate);
const PaymentTransactionEntity = model("PaymentTransaction", PaymentTransactionSchema);

const createPaymentTransaction = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;
    if (!orderId || !amount || !method) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu d\u1EEF li\u1EC7u b\u1EAFt bu\u1ED9c" });
    }
    const existingTransaction = await PaymentTransactionEntity.findOne({ orderId });
    if (existingTransaction) {
      return res.status(400).json({
        code: 1,
        message: "\u0110\u01A1n h\xE0ng n\xE0y \u0111\xE3 c\xF3 giao d\u1ECBch thanh to\xE1n"
      });
    }
    const transaction = await PaymentTransactionEntity.create({
      orderId,
      amount,
      method,
      status: "pending"
    });
    await OrderEntity.findByIdAndUpdate(orderId, {
      transaction: transaction._id
    });
    res.json({
      code: 0,
      data: transaction,
      message: "T\u1EA1o giao d\u1ECBch th\xE0nh c\xF4ng"
    });
  } catch (err) {
    res.status(500).json({ code: 1, message: err.message });
  }
};
const updatePaymentTransactionStatus = async (req, res) => {
  try {
    const { transactionId, status } = req.body;
    const transaction = await PaymentTransactionEntity.findByIdAndUpdate(
      transactionId,
      { status, updatedAt: /* @__PURE__ */ new Date() },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ code: 1, message: "Kh\xF4ng t\xECm th\u1EA5y giao d\u1ECBch" });
    }
    res.json({ code: 0, data: transaction, message: "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i th\xE0nh c\xF4ng" });
  } catch (err) {
    res.status(500).json({ code: 1, message: err.message });
  }
};
const getPaymentTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};
    if (status) query.status = status;
    const result = await PaymentTransactionEntity.paginate(query, {
      page: Number(page),
      limit: Number(limit),
      sort: { createdAt: -1 },
      populate: "orderId"
    });
    res.json({
      code: 0,
      data: toPaymentTransactionListDTO(result.docs),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs
      }
    });
  } catch (err) {
    res.status(500).json({ code: 1, message: err.message });
  }
};
const deletePaymentTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await PaymentTransactionEntity.findByIdAndDelete(id);
    if (!transaction) return res.status(404).json({ code: 1, message: "Kh\xF4ng t\xECm th\u1EA5y giao d\u1ECBch" });
    res.json({ code: 0, message: "X\xF3a giao d\u1ECBch th\xE0nh c\xF4ng" });
  } catch (err) {
    res.status(500).json({ code: 1, message: err.message });
  }
};

const router$g = Router();
router$g.post("/", createPaymentTransaction);
router$g.put("/status", updatePaymentTransactionStatus);
router$g.get("/", getPaymentTransactions);
router$g.delete("/:id", deletePaymentTransaction);

const paymentTransactionRoutes = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$g
}, Symbol.toStringTag, { value: 'Module' }));

function toProductReviewDTO(entity) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  return {
    id: entity._id.toString(),
    orderId: ((_b = (_a = entity.orderId) == null ? void 0 : _a.toString) == null ? void 0 : _b.call(_a)) || "",
    userId: entity.userId && typeof entity.userId === "object" && "fullname" in entity.userId ? toUserDTO(entity.userId) : ((_d = (_c = entity.userId) == null ? void 0 : _c.toString) == null ? void 0 : _d.call(_c)) || "",
    productId: entity.productId && typeof entity.productId === "object" && "productName" in entity.productId ? toProductDTO(entity.productId) : ((_f = (_e = entity.productId) == null ? void 0 : _e.toString) == null ? void 0 : _f.call(_e)) || "",
    rating: entity.rating,
    comment: entity.comment || null,
    images: entity.images || [],
    status: entity.status,
    statusText: ProductReviewStatusText[entity.status],
    statusColor: ProductReviewStatusColor[entity.status],
    createdAt: ((_h = (_g = entity.createdAt) == null ? void 0 : _g.toISOString) == null ? void 0 : _h.call(_g)) || "",
    updatedAt: ((_j = (_i = entity.updatedAt) == null ? void 0 : _i.toISOString) == null ? void 0 : _j.call(_i)) || ""
  };
}
const toProductReviewListDTO = (entities) => entities.map(toProductReviewDTO);

const getAllProductReviews = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    const numPage = Number(page);
    let numLimit = Number(limit);
    if (numLimit === -1) {
      const reviews = await ProductReviewEntity.find({}).sort({ createdAt: -1 }).populate("userId").populate("productId");
      return res.json({
        code: 0,
        data: toProductReviewListDTO(reviews),
        pagination: {
          page: 1,
          limit: reviews.length,
          totalPages: 1,
          total: reviews.length
        }
      });
    }
    const options = {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 },
      populate: [
        // { path: "orderId", model: "Order" },
        { path: "userId", model: "User" },
        { path: "productId", model: "Product" }
      ]
    };
    const result = await ProductReviewEntity.paginate({}, options);
    return res.json({
      code: 0,
      data: toProductReviewListDTO(result.docs),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs
      }
    });
  } catch (error) {
    console.error("\u{1F525} L\u1ED7i chi ti\u1EBFt getAllProductReviews:", error);
    return res.status(500).json({
      code: 1,
      message: "L\u1ED7i l\u1EA5y danh s\xE1ch \u0111\xE1nh gi\xE1",
      error
    });
  }
};
const getProductReviewById$1 = async (req, res) => {
  try {
    const review = await ProductReviewEntity.findById(req.params.id).populate("orderId").populate("userId").populate("productId");
    if (!review) {
      return res.status(404).json({ code: 1, message: "\u0110\xE1nh gi\xE1 kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toProductReviewDTO(review) });
  } catch (error) {
    return res.status(500).json({ code: 1, message: "L\u1ED7i l\u1EA5y \u0111\xE1nh gi\xE1", error });
  }
};
const updateProductReviewStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu id ho\u1EB7c status" });
    }
    const review = await ProductReviewEntity.findById(id);
    if (!review) {
      return res.status(404).json({ code: 1, message: "\u0110\xE1nh gi\xE1 kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    review.status = status;
    await review.save();
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i \u0111\xE1nh gi\xE1 th\xE0nh c\xF4ng",
      data: toProductReviewDTO(review)
    });
  } catch (error) {
    return res.status(500).json({ code: 1, message: "L\u1ED7i c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i \u0111\xE1nh gi\xE1", error });
  }
};
const deleteProductReview = async (req, res) => {
  try {
    const deleted = await ProductReviewEntity.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ code: 1, message: "\u0110\xE1nh gi\xE1 kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, message: "X\xF3a \u0111\xE1nh gi\xE1 th\xE0nh c\xF4ng" });
  } catch (error) {
    return res.status(500).json({ code: 1, message: "L\u1ED7i x\xF3a \u0111\xE1nh gi\xE1", error });
  }
};

const router$f = Router();
router$f.get("/", authenticateAdmin, getAllProductReviews);
router$f.get("/:id", getProductReviewById$1);
router$f.put("/status", authenticateAdmin, updateProductReviewStatus);
router$f.delete("/:id", authenticateAdmin, deleteProductReview);

const productReviewRouter$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$f
}, Symbol.toStringTag, { value: 'Module' }));

var VOUCHER_TYPE = /* @__PURE__ */ ((VOUCHER_TYPE2) => {
  VOUCHER_TYPE2["PERCENTAGE"] = "percentage";
  VOUCHER_TYPE2["FIXED"] = "fixed";
  VOUCHER_TYPE2["FREESHIP"] = "freeship";
  VOUCHER_TYPE2["PRODUCT"] = "product";
  VOUCHER_TYPE2["TIMED"] = "timed";
  return VOUCHER_TYPE2;
})(VOUCHER_TYPE || {});
const VOUCHER_TYPE_LIST = Object.values(VOUCHER_TYPE);

const VoucherSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    // Mã voucher
    name: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      required: true,
      enum: VOUCHER_TYPE_LIST
    },
    value: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    minOrderValue: { type: Number, default: 0 },
    maxShippingDiscount: { type: Number },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    limitPerUser: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "CategoryProduct" }],
    stackable: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);
VoucherSchema.plugin(mongoosePaginate);
const VoucherEntity = model("Voucher", VoucherSchema, "vouchers");

function toVoucherDTO(entity) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  return {
    id: entity._id.toString(),
    code: entity.code,
    name: entity.name,
    description: entity.description,
    type: entity.type,
    value: entity.value,
    maxDiscount: entity.maxDiscount,
    minOrderValue: (_a = entity.minOrderValue) != null ? _a : 0,
    maxShippingDiscount: (_b = entity.maxShippingDiscount) != null ? _b : void 0,
    usageLimit: (_c = entity.usageLimit) != null ? _c : 0,
    usedCount: (_d = entity.usedCount) != null ? _d : 0,
    limitPerUser: (_e = entity.limitPerUser) != null ? _e : 0,
    startDate: (_f = entity.startDate) == null ? void 0 : _f.toISOString(),
    endDate: (_g = entity.endDate) == null ? void 0 : _g.toISOString(),
    applicableProducts: (_i = (_h = entity.applicableProducts) == null ? void 0 : _h.map((p) => p.toString())) != null ? _i : [],
    applicableCategories: (_k = (_j = entity.applicableCategories) == null ? void 0 : _j.map((c) => c.toString())) != null ? _k : [],
    stackable: (_l = entity.stackable) != null ? _l : false,
    isActive: (_m = entity.isActive) != null ? _m : true,
    createdAt: ((_n = entity.createdAt) == null ? void 0 : _n.toISOString()) || ""
  };
}

const VoucherUsageSchema = new Schema(
  {
    voucherId: {
      type: Types.ObjectId,
      ref: "Voucher",
      required: true
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    orderId: {
      type: Types.ObjectId,
      ref: "Order"
    },
    usedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);
const VoucherUsageEntity = model("VoucherUsage", VoucherUsageSchema);

const getAllVouchers = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    const numPage = Number(page);
    const numLimit = Number(limit);
    if (numLimit === -1) {
      const vouchers = await VoucherEntity.find().sort({ createdAt: -1 });
      return res.json({
        code: 0,
        data: vouchers.map(toVoucherDTO),
        pagination: {
          page: 1,
          limit: vouchers.length,
          totalPages: 1,
          total: vouchers.length
        }
      });
    }
    const options = {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 }
    };
    const result = await VoucherEntity.paginate({}, options);
    return res.json({
      code: 0,
      data: result.docs.map(toVoucherDTO),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs
      }
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: "L\u1ED7i l\u1EA5y danh s\xE1ch voucher", error: err.message });
  }
};
const getVoucherById = async (req, res) => {
  try {
    const voucher = await VoucherEntity.findById(req.params.id);
    if (!voucher) {
      return res.status(404).json({ code: 1, message: "Voucher kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toVoucherDTO(voucher) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const createVoucher = async (req, res) => {
  try {
    const exists = await VoucherEntity.findOne({ code: req.body.code });
    if (exists) {
      return res.status(400).json({ code: 1, message: "M\xE3 voucher \u0111\xE3 t\u1ED3n t\u1EA1i" });
    }
    const voucher = new VoucherEntity(req.body);
    await voucher.save();
    return res.json({
      code: 0,
      message: "T\u1EA1o voucher th\xE0nh c\xF4ng",
      data: toVoucherDTO(voucher)
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const voucher = await VoucherEntity.findById(id);
    if (!voucher) {
      return res.status(404).json({ code: 1, message: "Voucher kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const now = /* @__PURE__ */ new Date();
    if (voucher.endDate < now) {
      return res.status(400).json({ code: 1, message: "Voucher \u0111\xE3 h\u1EBFt h\u1EA1n, kh\xF4ng th\u1EC3 c\u1EADp nh\u1EADt" });
    }
    if (voucher.usedCount > 0 || voucher.startDate <= now && voucher.endDate >= now) {
      const allowedFields = ["isActive", "name", "description"];
      const filteredData = Object.keys(updateData).filter((k) => allowedFields.includes(k)).reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});
      const updated2 = await VoucherEntity.findByIdAndUpdate(id, filteredData, { new: true });
      return res.json({
        code: 0,
        message: "C\u1EADp nh\u1EADt th\xE0nh c\xF4ng",
        data: toVoucherDTO(updated2)
      });
    }
    const updated = await VoucherEntity.findByIdAndUpdate(id, updateData, { new: true });
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt voucher th\xE0nh c\xF4ng",
      data: toVoucherDTO(updated)
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await VoucherEntity.findById(id);
    if (!voucher) {
      return res.status(404).json({ code: 1, message: "Voucher kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const now = /* @__PURE__ */ new Date();
    if (voucher.usedCount > 0 || voucher.startDate <= now) {
      voucher.isActive = false;
      await voucher.save();
      return res.json({
        code: 0,
        message: "Voucher \u0111\xE3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng ho\u1EB7c \u0111ang ho\u1EA1t \u0111\u1ED9ng \u2014 chuy\u1EC3n sang tr\u1EA1ng th\xE1i v\xF4 hi\u1EC7u h\xF3a"
      });
    }
    await VoucherEntity.findByIdAndDelete(id);
    return res.json({ code: 0, message: "X\xF3a voucher th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const toggleActiveVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await VoucherEntity.findById(id);
    if (!voucher) {
      return res.status(404).json({ code: 1, message: "Voucher kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const now = /* @__PURE__ */ new Date();
    if (voucher.endDate < now) {
      return res.status(400).json({
        code: 1,
        message: "Voucher \u0111\xE3 h\u1EBFt h\u1EA1n, kh\xF4ng th\u1EC3 thay \u0111\u1ED5i tr\u1EA1ng th\xE1i"
      });
    }
    voucher.isActive = !voucher.isActive;
    await voucher.save();
    return res.json({
      code: 0,
      message: "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i ho\u1EA1t \u0111\u1ED9ng th\xE0nh c\xF4ng",
      data: toVoucherDTO(voucher)
    });
  } catch (err) {
    return res.status(500).json({
      code: 1,
      message: err.message || "L\u1ED7i khi c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i voucher"
    });
  }
};
const applyVoucher = async (req, res) => {
  var _a, _b;
  try {
    const {
      code,
      orderTotal,
      products = [],
      orderCreatedAt,
      userId
    } = req.body;
    if (!code || !orderTotal)
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu m\xE3 voucher ho\u1EB7c gi\xE1 tr\u1ECB \u0111\u01A1n h\xE0ng" });
    if (!userId)
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu th\xF4ng tin ng\u01B0\u1EDDi d\xF9ng" });
    const voucher = await VoucherEntity.findOne({ code, isActive: true });
    if (!voucher)
      return res.status(404).json({ code: 1, message: "Voucher kh\xF4ng t\u1ED3n t\u1EA1i ho\u1EB7c kh\xF4ng ho\u1EA1t \u0111\u1ED9ng" });
    const now = /* @__PURE__ */ new Date();
    if (voucher.startDate > now)
      return res.status(400).json({ code: 1, message: "Ch\u01B0a \u0111\u1EBFn th\u1EDDi gian \xE1p d\u1EE5ng voucher" });
    if (voucher.endDate < now)
      return res.status(400).json({ code: 1, message: "Voucher \u0111\xE3 h\u1EBFt h\u1EA1n" });
    if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit)
      return res.status(400).json({ code: 1, message: "Voucher \u0111\xE3 h\u1EBFt l\u01B0\u1EE3t s\u1EED d\u1EE5ng" });
    const userUsedCount = await VoucherUsageEntity.countDocuments({
      voucherId: voucher._id,
      userId
    });
    if (voucher.limitPerUser > 0 && userUsedCount >= voucher.limitPerUser)
      return res.status(400).json({ code: 1, message: "B\u1EA1n \u0111\xE3 d\xF9ng h\u1EBFt l\u01B0\u1EE3t c\u1EE7a voucher n\xE0y" });
    if (voucher.minOrderValue && orderTotal < voucher.minOrderValue)
      return res.status(400).json({
        code: 1,
        message: `\u0110\u01A1n h\xE0ng ch\u01B0a \u0111\u1EA1t gi\xE1 tr\u1ECB t\u1ED1i thi\u1EC3u ${voucher.minOrderValue.toLocaleString()}\u0111`
      });
    let applicableProducts = [];
    if (voucher.type === "product") {
      if (voucher.value < 0 || voucher.value > 100) {
        return res.status(400).json({ code: 1, message: "Gi\xE1 tr\u1ECB gi\u1EA3m (%) kh\xF4ng h\u1EE3p l\u1EC7" });
      }
      const applicableProductIds = ((_a = voucher.applicableProducts) != null ? _a : []).map(String);
      const applicableCategoryIds = ((_b = voucher.applicableCategories) != null ? _b : []).map(String);
      applicableProducts = products.filter((p) => {
        var _a2, _b2;
        const pid = (_a2 = p.productId) == null ? void 0 : _a2.toString();
        const cid = (_b2 = p.categoryId) == null ? void 0 : _b2.toString();
        return applicableProductIds.includes(pid) || applicableCategoryIds.includes(cid);
      });
      if (applicableProducts.length === 0) {
        return res.status(400).json({
          code: 1,
          message: "Voucher kh\xF4ng \xE1p d\u1EE5ng cho s\u1EA3n ph\u1EA9m n\xE0o trong \u0111\u01A1n h\xE0ng"
        });
      }
    } else {
      applicableProducts = products;
    }
    const subtotalApplicable = applicableProducts.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    let discount = 0;
    let message = "\xC1p d\u1EE5ng voucher th\xE0nh c\xF4ng";
    switch (voucher.type) {
      case "percentage":
        discount = Math.min(
          subtotalApplicable * voucher.value / 100,
          voucher.maxDiscount || Infinity
        );
        break;
      case "fixed":
        discount = Math.min(voucher.value, subtotalApplicable);
        break;
      case "freeship":
        if (!voucher.maxShippingDiscount)
          return res.status(400).json({
            code: 1,
            message: "Voucher freeship ch\u01B0a c\u1EA5u h\xECnh m\u1EE9c gi\u1EA3m ph\xED t\u1ED1i \u0111a"
          });
        discount = Math.min(voucher.maxShippingDiscount, orderTotal);
        message = `\xC1p d\u1EE5ng mi\u1EC5n ph\xED v\u1EADn chuy\u1EC3n (t\u1ED1i \u0111a ${voucher.maxShippingDiscount.toLocaleString()}\u0111)`;
        break;
      case "product":
        discount = Math.min(
          subtotalApplicable * voucher.value / 100,
          voucher.maxDiscount || Infinity
        );
        const productNames = applicableProducts.map((p) => p.productName);
        if (productNames.length === 1) {
          message = `M\xE3 gi\u1EA3m gi\xE1 ${voucher.code} ch\u1EC9 \xE1p d\u1EE5ng gi\u1EA3m ${voucher.value}% cho s\u1EA3n ph\u1EA9m ${productNames[0]}`;
        } else {
          message = `M\xE3 gi\u1EA3m gi\xE1 ${voucher.code} ch\u1EC9 \xE1p d\u1EE5ng gi\u1EA3m ${voucher.value}% cho ${productNames.length} s\u1EA3n ph\u1EA9m: ${productNames.map((name) => `<div>- ${name}</div>`).join("")}`;
        }
        break;
      case "timed":
        if (!orderCreatedAt)
          return res.status(400).json({ code: 1, message: "Thi\u1EBFu th\u1EDDi gian t\u1EA1o \u0111\u01A1n h\xE0ng" });
        const createdAt = new Date(orderCreatedAt);
        if (createdAt < voucher.startDate || createdAt > voucher.endDate)
          return res.status(400).json({ code: 1, message: "Voucher kh\xF4ng h\u1EE3p l\u1EC7 \u1EDF th\u1EDDi \u0111i\u1EC3m n\xE0y" });
        discount = Math.min(
          subtotalApplicable * voucher.value / 100,
          voucher.maxDiscount || Infinity
        );
        message = "\xC1p d\u1EE5ng voucher khung th\u1EDDi gian";
        break;
      default:
        return res.status(400).json({ code: 1, message: "Lo\u1EA1i voucher kh\xF4ng h\u1EE3p l\u1EC7" });
    }
    discount = Math.round(discount * 1e3) / 1e3;
    return res.json({
      code: 0,
      message,
      data: {
        code: voucher.code,
        type: voucher.type,
        discount,
        applicableProducts,
        stackable: voucher.stackable,
        expiresAt: voucher.endDate
      }
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getAvailableVouchersForOrder = async (req, res) => {
  var _a;
  try {
    const { orderTotal = 0, categoryIds = [], userId } = req.body;
    const now = /* @__PURE__ */ new Date();
    const vouchers = await VoucherEntity.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ createdAt: -1 });
    const result = [];
    for (const v of vouchers) {
      const userUsedCount = userId ? await VoucherUsageEntity.countDocuments({
        voucherId: v._id,
        userId
      }) : 0;
      let isDisabled = false;
      let disabledReason = null;
      if (v.usageLimit > 0 && v.usedCount >= v.usageLimit) {
        isDisabled = true;
        disabledReason = "Voucher \u0111\xE3 h\u1EBFt l\u01B0\u1EE3t s\u1EED d\u1EE5ng";
      } else if (v.limitPerUser > 0 && userUsedCount >= v.limitPerUser) {
        isDisabled = true;
        disabledReason = "B\u1EA1n \u0111\xE3 s\u1EED d\u1EE5ng h\u1EBFt s\u1ED1 l\u01B0\u1EE3t c\u1EE7a voucher n\xE0y";
      } else if (orderTotal < (v.minOrderValue || 0)) {
        isDisabled = true;
        disabledReason = `\u0110\u01A1n h\xE0ng ch\u01B0a \u0111\u1EA1t gi\xE1 tr\u1ECB t\u1ED1i thi\u1EC3u ${(_a = v.minOrderValue) == null ? void 0 : _a.toLocaleString()}\u0111`;
      } else if (v.type === "product") {
        const hasApplicableCategories = Array.isArray(v.applicableCategories) && Array.isArray(categoryIds) && categoryIds.some(
          (cid) => {
            var _a2;
            return ((_a2 = v.applicableCategories) != null ? _a2 : []).map(String).includes(cid.toString());
          }
        );
        if (!hasApplicableCategories) {
          isDisabled = true;
          disabledReason = "Kh\xF4ng \xE1p d\u1EE5ng cho s\u1EA3n ph\u1EA9m ho\u1EB7c danh m\u1EE5c trong \u0111\u01A1n h\xE0ng";
        }
      }
      result.push({
        ...v.toObject(),
        isDisabled,
        disabledReason
      });
    }
    return res.json({
      code: 0,
      message: "L\u1EA5y danh s\xE1ch voucher th\xE0nh c\xF4ng",
      data: result
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

const router$e = Router();
router$e.get("/", getAllVouchers);
router$e.get("/:id", getVoucherById);
router$e.post("/", createVoucher);
router$e.put("/:id", updateVoucher);
router$e.delete("/:id", deleteVoucher);
router$e.patch("/:id/toggle-active", toggleActiveVoucher);
router$e.post("/apply", applyVoucher);
router$e.post("/available", getAvailableVouchersForOrder);

const voucherRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$e
}, Symbol.toStringTag, { value: 'Module' }));

const router$d = Router();
router$d.use("/settings", router$l);
router$d.use("/about", router$p);
router$d.use("/users", router$k);
router$d.use("/banners", router$o);
router$d.use("/categoriesNews", router$n);
router$d.use("/newsPosts", router$j);
router$d.use("/orders", router$i);
router$d.use("/payment-transactions", router$g);
router$d.use("/categories", router$m);
router$d.use("/products", router$h);
router$d.use("/product-reviews", router$f);
router$d.use("/voucher", router$e);

const index$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$d
}, Symbol.toStringTag, { value: 'Module' }));

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

const client = new OAuth2Client(process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID, process.env.NUXT_GOOGLE_CLIENT_SECRET);
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
      authProvider: "local",
      googleId: null,
      membership: {
        level: "Bronze",
        point: 0,
        balancePoint: 0,
        membership: 0,
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
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.cookie("token", token, {
      httpOnly: true,
      // FE không đọc trực tiếp
      secure: false,
      // localhost => false
      sameSite: "lax",
      // thử 'none' nếu khác port
      maxAge: 12 * 60 * 60 * 1e3
    });
    res.status(200).json({ code: 0, message: "\u0110\u0103ng nh\u1EADp th\xE0nh c\xF4ng", data: { token, user: toUserDTO(user) } });
  } catch (err) {
    res.status(500).json({ code: 500, message: "\u0110\u0103ng nh\u1EADp th\u1EA5t b\u1EA1i, vui l\xF2ng th\u1EED l\u1EA1i", error: err });
  }
};
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ code: 1, message: "X\xE1c th\u1EF1c Google th\u1EA5t b\u1EA1i" });
    }
    const { email, name, picture, sub } = payload;
    let user = await UserModel.findOne({ email });
    if (!user) {
      const barcode = Date.now().toString();
      const barcodeFilename = `barcode-${barcode}.png`;
      const barcodePath = await generateBarcode(barcode, barcodeFilename);
      user = await UserModel.create({
        fullname: name,
        email,
        // password: "",
        gender: "male",
        phone: "",
        birthday: (/* @__PURE__ */ new Date()).toISOString(),
        avatar: picture || process.env.IMAGE_AVATAR_DEFAULT,
        authProvider: "google",
        googleId: sub,
        active: true,
        role: 1,
        membership: {
          level: "Bronze",
          point: 0,
          balancePoint: 0,
          membership: 0,
          discountRate: 0,
          joinedAt: /* @__PURE__ */ new Date(),
          code: Date.now(),
          barcode: barcodePath || ""
        }
      });
    }
    const jwtToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "12h"
    });
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1e3
    });
    return res.status(200).json({
      code: 0,
      message: "\u0110\u0103ng nh\u1EADp Google th\xE0nh c\xF4ng",
      data: { token: jwtToken, user: toUserDTO(user) }
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ code: 1, message: "\u0110\u0103ng nh\u1EADp Google th\u1EA5t b\u1EA1i", error: err.message });
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

const router$c = express.Router();
router$c.put("/users/me", authenticate, updateAccount);
router$c.get("/users/:id", getUserById);
router$c.post("/register", register);
router$c.post("/login", login);
router$c.post("/google-login", googleLogin);
router$c.post("/forgot-password", forgotPassword);
router$c.post("/reset-password", resetPassword);
router$c.post("/change-password", authenticate, changePassword);

const authRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$c
}, Symbol.toStringTag, { value: 'Module' }));

const getAllBanners = async (_, res) => {
  try {
    const banners = await BannerEntity.find({ isActive: true }).sort({ order: 1 });
    return res.json({ code: 0, data: toBannerListDTO(banners) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

const router$b = Router();
router$b.get("/", getAllBanners);

const bannerRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$b
}, Symbol.toStringTag, { value: 'Module' }));

const getAllCategories$1 = async (_, res) => {
  try {
    const categories = await CategoryNewsModel.find({ isActive: true }).sort({ order: 1 });
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
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await CategoryNewsModel.findOne({ slug });
    if (!category) {
      return res.status(404).json({ code: 1, message: "Category not found" });
    }
    res.json({ code: 0, data: toCategoryNewsDTO(category) });
  } catch (err) {
    res.status(500).json({ code: 1, message: "Server error" });
  }
};

const router$a = Router();
router$a.get("/", getAllCategories$1);
router$a.get("/slug/:slug", getCategoryBySlug);
router$a.get("/:id", getCategoriesById$1);

const categoriesNewsRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$a
}, Symbol.toStringTag, { value: 'Module' }));

function buildCategoryTree(list) {
  const map = /* @__PURE__ */ new Map();
  list.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });
  const tree = [];
  map.forEach((cat) => {
    if (cat.parentId) {
      const parent = map.get(cat.parentId);
      if (parent) {
        parent.children.push(cat);
      } else {
        tree.push(cat);
      }
    } else {
      tree.push(cat);
    }
  });
  return tree;
}
const getAllCategoriesTree = async (_, res) => {
  try {
    const categories = await CategoryProductEntity.find({ isActive: true }).lean().sort({ order: 1 });
    const dtoList = toCategoryProductListDTO(categories);
    const tree = buildCategoryTree(dtoList);
    return res.json({ code: 0, data: tree });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getAllCategories = async (_, res) => {
  try {
    const categories = await CategoryProductEntity.find({ isActive: true }).lean().sort({ order: 1 });
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
const getCategoriesBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await CategoryProductEntity.findOne({ slug }).lean();
    if (!category) {
      return res.status(404).json({ code: 1, message: "Danh m\u1EE5c kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({
      code: 0,
      data: toCategoryProductDTO(category),
      message: "Success"
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getChildrenCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const { includeInactive } = req.query;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 1, message: "ID kh\xF4ng h\u1EE3p l\u1EC7" });
    }
    const query = { parentId: id };
    if (!includeInactive || includeInactive === "false") {
      query.isActive = true;
    }
    const children = await CategoryProductEntity.find(query).lean().sort({ order: 1 });
    return res.json({
      code: 0,
      data: toCategoryProductListDTO(children),
      message: "Success"
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getProductsByCategory = async (req, res) => {
  var _a;
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID kh\xF4ng h\u1EE3p l\u1EC7" });
    }
    const categoryId = new Types.ObjectId(req.params.id);
    const categories = await CategoryProductEntity.aggregate([
      { $match: { _id: categoryId } },
      {
        $graphLookup: {
          from: "product_categories",
          // 👈 tên collection (mặc định là model name viết thường + "s")
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentId",
          as: "descendants"
        }
      },
      {
        $project: {
          ids: {
            $concatArrays: [["$_id"], "$descendants._id"]
          }
        }
      }
    ]);
    const categoryIds = ((_a = categories[0]) == null ? void 0 : _a.ids) || [categoryId];
    const page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    const sortType = req.query.sort || "default";
    if (limit === -1) {
      limit = await ProductEntity.countDocuments({
        categoryId: { $in: categoryIds },
        isActive: true
      });
    }
    const skip = (page - 1) * limit;
    const [total, products] = await Promise.all([
      ProductEntity.countDocuments({
        categoryId: { $in: categoryIds },
        isActive: true
      }),
      ProductEntity.aggregate([
        { $match: { categoryId: { $in: categoryIds }, isActive: true } },
        // Ép kiểu price & priceDiscount sang số
        {
          $addFields: {
            price: { $toDouble: "$price" },
            priceDiscount: { $toDouble: "$priceDiscount" }
          }
        },
        // Tính toán giảm giá
        {
          $addFields: {
            hasDiscount: { $cond: [{ $lt: ["$priceDiscount", "$price"] }, 1, 0] },
            discountValue: {
              $cond: [
                { $lt: ["$priceDiscount", "$price"] },
                { $subtract: ["$price", "$priceDiscount"] },
                0
              ]
            },
            discountPercent: {
              $cond: [
                { $lt: ["$priceDiscount", "$price"] },
                {
                  $multiply: [
                    { $divide: [{ $subtract: ["$price", "$priceDiscount"] }, "$price"] },
                    100
                  ]
                },
                0
              ]
            }
          }
        },
        // Sort động theo sortType
        {
          $sort: sortType === "discount" ? { hasDiscount: -1, discountPercent: -1, updatedAt: -1 } : sortType === "popular" ? { amountOrder: -1 } : sortType === "price_desc" ? { price: -1 } : sortType === "price_asc" ? { price: 1 } : { updatedAt: -1 }
        },
        { $skip: skip },
        { $limit: limit }
      ])
    ]);
    const totalPages = Math.ceil(total / limit);
    return res.json({
      code: 0,
      data: toProductListDTO(products),
      pagination: { page, limit, total, totalPages },
      message: "Success"
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

const router$9 = Router();
router$9.get("/tree", getAllCategoriesTree);
router$9.get("/", getAllCategories);
router$9.get("/slug/:slug", getCategoriesBySlug);
router$9.get("/:id", getCategoriesById);
router$9.get("/:id/children", getChildrenCategories);
router$9.get("/:id/products", getProductsByCategory);

const categoriesProductRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$9
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

const router$8 = express.Router();
router$8.get("/images", authenticate, getImages);
router$8.get("/images/folders", authenticateAdmin, getFolders);
router$8.delete("/images/delete", authenticate, deleteImage);
router$8.get("/images/search", authenticate, searchImage);
router$8.post("/images/upload", authenticate, uploadImageMulter.single("file"), uploadImage);

const fileManageRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$8
}, Symbol.toStringTag, { value: 'Module' }));

const getAllProvinces = async (_, res) => {
  try {
    const response = await fetch("https://provinces.open-api.vn/api/?depth=1");
    const data = await response.json();
    return res.json({ code: 0, data });
  } catch (err) {
    return res.status(500).json({ code: 1, message: "L\u1ED7i khi l\u1EA5y danh s\xE1ch t\u1EC9nh/th\xE0nh", error: err.message });
  }
};
const getDistrictsByProvince = async (req, res) => {
  try {
    const { provinceCode } = req.params;
    const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    const data = await response.json();
    if (!data || !data.districts) {
      return res.status(404).json({ code: 1, message: "Kh\xF4ng t\xECm th\u1EA5y qu\u1EADn/huy\u1EC7n" });
    }
    return res.json({ code: 0, data: data.districts });
  } catch (err) {
    return res.status(500).json({ code: 1, message: "L\u1ED7i khi l\u1EA5y qu\u1EADn/huy\u1EC7n", error: err.message });
  }
};
const getWardsByDistrict = async (req, res) => {
  try {
    const { districtCode } = req.params;
    const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    const data = await response.json();
    if (!data || !data.wards) {
      return res.status(404).json({ code: 1, message: "Kh\xF4ng t\xECm th\u1EA5y x\xE3/ph\u01B0\u1EDDng" });
    }
    return res.json({ code: 0, data: data.wards });
  } catch (err) {
    return res.status(500).json({ code: 1, message: "L\u1ED7i khi l\u1EA5y x\xE3/ph\u01B0\u1EDDng", error: err.message });
  }
};
const getProvinceDetail = async (req, res) => {
  try {
    const { provinceCode } = req.params;
    const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=1`);
    const data = await response.json();
    if (!data || !data.name) {
      return res.status(404).json({ code: 1, message: "Kh\xF4ng t\xECm th\u1EA5y t\u1EC9nh/th\xE0nh" });
    }
    return res.json({ code: 0, data });
  } catch (err) {
    return res.status(500).json({
      code: 1,
      message: "L\u1ED7i khi l\u1EA5y chi ti\u1EBFt t\u1EC9nh/th\xE0nh",
      error: err.message
    });
  }
};
const getDistrictDetail = async (req, res) => {
  try {
    const { districtCode } = req.params;
    const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=1`);
    const data = await response.json();
    if (!data || !data.name) {
      return res.status(404).json({ code: 1, message: "Kh\xF4ng t\xECm th\u1EA5y qu\u1EADn/huy\u1EC7n" });
    }
    return res.json({ code: 0, data });
  } catch (err) {
    return res.status(500).json({
      code: 1,
      message: "L\u1ED7i khi l\u1EA5y chi ti\u1EBFt qu\u1EADn/huy\u1EC7n",
      error: err.message
    });
  }
};
const getWardDetail = async (req, res) => {
  const { wardCode } = req.params;
  const districtCode = req.query.districtCode;
  if (!districtCode) {
    return res.status(400).json({
      code: 1,
      message: "Thi\u1EBFu districtCode khi t\xECm x\xE3/ph\u01B0\u1EDDng c\xF3 m\xE3 ng\u1EAFn"
    });
  }
  try {
    const resp = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    const district = await resp.json();
    if (resp.ok && district && Array.isArray(district.wards)) {
      const ward = district.wards.find(
        (w) => String(w.code) === String(wardCode)
      );
      if (ward) {
        return res.json({ code: 0, data: ward });
      }
    }
    return res.status(404).json({ code: 1, message: "Kh\xF4ng t\xECm th\u1EA5y x\xE3/ph\u01B0\u1EDDng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: "L\u1ED7i khi l\u1EA5y chi ti\u1EBFt x\xE3/ph\u01B0\u1EDDng", error: err.message });
  }
};

const router$7 = express.Router();
router$7.get("/provinces", getAllProvinces);
router$7.get("/provinces/:provinceCode", getProvinceDetail);
router$7.get("/districts/:provinceCode", getDistrictsByProvince);
router$7.get("/district/:districtCode", getDistrictDetail);
router$7.get("/wards/:districtCode", getWardsByDistrict);
router$7.get("/ward/:wardCode", getWardDetail);

const locationRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$7
}, Symbol.toStringTag, { value: 'Module' }));

const router$6 = Router();
router$6.use("/fileManage", router$8);
router$6.use("/location", router$7);

const index$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$6
}, Symbol.toStringTag, { value: 'Module' }));

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

const router$5 = express.Router();
router$5.post("/search-keywords/log", logSearchKeyword);
router$5.get("/search-keywords/list", getTopSearchKeyword);

const usersRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$5
}, Symbol.toStringTag, { value: 'Module' }));

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
const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await PostNewsModel.findOne({ slug });
    if (!post) {
      return res.status(404).json({ code: 1, message: "Kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toPostNewsDTO(post) });
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
const getPostsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const query = { categoryId };
    const [total, posts] = await Promise.all([
      PostNewsModel.countDocuments(query),
      PostNewsModel.find({ ...query, isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ]);
    const totalPages = Math.ceil(total / limit);
    return res.json({
      code: 0,
      data: toPostNewsListDTO(posts),
      pagination: { page, limit, total, totalPages },
      message: "Success"
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getRelatedPostsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const limit = parseInt(req.query.limit, 10) || 10;
    const post = await PostNewsModel.findOne({ slug });
    if (!post) {
      return res.status(404).json({ code: 1, message: "B\xE0i vi\u1EBFt kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const relatedPosts = await PostNewsModel.find({
      categoryId: new mongoose.Types.ObjectId(post.categoryId),
      slug: { $ne: slug },
      isActive: true
    }).limit(limit).sort({ createdAt: -1 });
    return res.json({
      code: 0,
      data: relatedPosts.map(toPostNewsDTO),
      message: "Success"
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const updateView = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await PostNewsModel.findOneAndUpdate(
      { slug, isActive: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ code: 1, message: "B\xE0i vi\u1EBFt kh\xF4ng t\u1ED3n t\u1EA1i" });
    return res.json({ code: 0, data: { views: post.views }, message: "C\u1EADp nh\u1EADt l\u01B0\u1EE3t xem th\xE0nh c\xF4ng" });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getAllPostsPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";
    const query = { isActive: true };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summaryContent: { $regex: search, $options: "i" } }
      ];
    }
    if (limit === -1) {
      limit = await PostNewsModel.countDocuments(query);
    }
    const skip = (page - 1) * limit;
    const [total, posts] = await Promise.all([
      PostNewsModel.countDocuments(query),
      PostNewsModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ]);
    const totalPages = Math.ceil(total / limit);
    return res.json({
      code: 0,
      data: toPostNewsListDTO(posts),
      pagination: { page, limit, total, totalPages },
      message: "Success"
    });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

const router$4 = Router();
router$4.get("/category/:categoryId", getPostsByCategory);
router$4.get("/pagination", getAllPostsPagination);
router$4.get("/slug/:slug", getPostBySlug);
router$4.get("/related/:slug", getRelatedPostsBySlug);
router$4.patch("/view/:slug", updateView);
router$4.get("/latest", getPostsLatest);
router$4.get("/:id", getPostsById);

const postsNewsRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$4
}, Symbol.toStringTag, { value: 'Module' }));

const PAYMENT_METHOD_STATUS = {
  BANK: "bank_transfer",
  CASH: "cash"
};

const getOrderById = async (req, res) => {
  try {
    const order = await OrderEntity.findById(req.params.id).populate("paymentId").populate("status").populate("userId").populate({ path: "transaction", model: "PaymentTransaction" });
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
    const { data, userId, point, usedPoint } = req.body;
    if (!(data == null ? void 0 : data.fullname) || !(data == null ? void 0 : data.phone) || !(data == null ? void 0 : data.paymentId) || !(data == null ? void 0 : data.cartItems)) {
      return res.status(400).json({ code: 1, message: "D\u1EEF li\u1EC7u \u0111\u01A1n h\xE0ng kh\xF4ng h\u1EE3p l\u1EC7" });
    }
    let membershipDiscountRate = 0;
    let membershipDiscountAmount = 0;
    if (userId) {
      const user = await UserModel.findById(userId);
      if (user) {
        membershipDiscountRate = user.membership.discountRate || 0;
        if (membershipDiscountRate > 0) {
          membershipDiscountAmount = Math.floor(data.totalPriceCurrent * (membershipDiscountRate / 100));
          data.totalPriceDiscount = data.totalPriceCurrent - membershipDiscountAmount;
        }
      }
    }
    let deductedPoints = 0;
    if (userId && usedPoint && usedPoint > 0) {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ code: 1, message: "Kh\xF4ng t\xECm th\u1EA5y user" });
      }
      if (user.membership.balancePoint < usedPoint) {
        return res.status(400).json({ code: 1, message: "\u0110i\u1EC3m t\xEDch l\u0169y kh\xF4ng \u0111\u1EE7" });
      }
      user.membership.balancePoint -= usedPoint;
      await user.save();
      deductedPoints = usedPoint;
    }
    const newOrder = await OrderEntity.create({
      ...data,
      userId,
      reward: { points: point || 0, awarded: false, awardedAt: null },
      usedPoints: deductedPoints,
      pointsRefunded: false,
      membershipDiscountRate,
      membershipDiscountAmount
    });
    return res.status(201).json({
      code: 0,
      message: "\u0110\u1EB7t h\xE0ng th\xE0nh c\xF4ng",
      data: toOrderDTO(newOrder)
    });
  } catch (err) {
    console.error("L\u1ED7i createOrder:", err);
    return res.status(500).json({ code: 2, message: "L\u1ED7i server" });
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
const getRewardHistoryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    let { page = 1, limit = 10 } = req.query;
    const numPage = Number(page);
    const numLimit = Number(limit);
    const query = {
      userId,
      $or: [
        { "reward.points": { $gt: 0 } },
        // có thưởng điểm
        { usedPoints: { $gt: 0 } },
        // có sử dụng điểm
        { pointsRefunded: true }
        // có hoàn điểm
      ]
    };
    const result = await OrderEntity.paginate(query, {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 },
      populate: [
        { path: "paymentId", model: "Payment" },
        { path: "status", model: "OrderStatus" },
        { path: "transaction", model: "PaymentTransaction" }
      ]
    });
    const history = result.docs.map((order) => {
      let historyType = "";
      let points = 0;
      if (order.usedPoints > 0 && order.pointsRefunded) {
        historyType = "refunded";
        points = order.usedPoints;
      } else if (order.usedPoints > 0) {
        historyType = "used";
        points = order.usedPoints;
      } else if (order.reward.points > 0 && order.reward.awarded) {
        historyType = "earned";
        points = order.reward.points;
      } else if (order.reward.points > 0 && !order.reward.awarded) {
        historyType = "pending_reward";
        points = order.reward.points;
      } else {
        historyType = "none";
      }
      return {
        orderId: order._id,
        code: order.code,
        createdAt: order.createdAt,
        historyType,
        points,
        order: toOrderDTO(order)
      };
    });
    return res.json({
      code: 0,
      data: history,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs
      }
    });
  } catch (err) {
    console.error("L\u1ED7i getRewardHistoryByUserId:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const checkPoint = async (req, res) => {
  try {
    const { userId, usedPoint, orderTotal } = req.body;
    if (!userId || !usedPoint || !orderTotal) {
      return res.status(400).json({ success: false, message: "Thi\u1EBFu d\u1EEF li\u1EC7u" });
    }
    const user = await UserModel.findById(userId).select("membership.balancePoint");
    if (!user) {
      return res.status(404).json({ success: false, message: "Kh\xF4ng t\xECm th\u1EA5y user" });
    }
    const balancePoint = user.membership.balancePoint || 0;
    const maxPointAllow = Math.floor(orderTotal * 0.1);
    if (usedPoint > balancePoint) {
      return res.json({
        code: 2,
        message: "S\u1ED1 \u0111i\u1EC3m b\u1EA1n c\xF3 kh\xF4ng \u0111\u1EE7 \u0111\u1EC3 s\u1EED d\u1EE5ng"
      });
    }
    if (usedPoint > maxPointAllow) {
      return res.json({
        code: 1,
        message: `B\u1EA1n ch\u1EC9 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng t\u1ED1i \u0111a ${maxPointAllow} \u0111i\u1EC3m cho \u0111\u01A1n h\xE0ng n\xE0y`
      });
    }
    return res.json({
      code: 0,
      data: { appliedPoint: usedPoint }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "L\u1ED7i server" });
  }
};
const sepayCallback = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const expectedApiKey = `Apikey ${process.env.SEPAY_WEBHOOK_API_KEY}`;
    if (authHeader !== expectedApiKey) {
      console.error("Invalid API Key in webhook");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const {
      transferType,
      // in | out
      transferAmount,
      // số tiền
      transferContent,
      // nội dung CK
      referenceNumber
      // mã giao dịch ngân hàng
    } = req.body;
    if (transferType !== "in") {
      return res.status(200).json({ success: true });
    }
    const orderCodeMatch = transferContent.match(/ORDER\d+/);
    if (!orderCodeMatch) {
      console.error("\u274C Cannot parse order code");
      return res.status(200).send("OK");
    }
    const orderCode = orderCodeMatch[0];
    const order = await OrderEntity.findOne({ code: orderCode }).populate({ path: "transaction", model: "PaymentTransaction" });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (order.transaction && order.transaction.status === PAYMENT_TRANSACTION_STATUS.PAID) {
      return res.status(200).json({ success: true, message: "Already processed" });
    }
    if (transferAmount < order.totalPrice) {
      return res.status(200).json({ success: false, message: "Amount mismatch" });
    }
    const transaction = await PaymentTransactionEntity.create({
      orderId: order._id,
      transactionId: referenceNumber,
      amount: transferAmount,
      method: PAYMENT_METHOD_STATUS.BANK,
      status: PAYMENT_TRANSACTION_STATUS.PAID
    });
    order.transaction = transaction._id;
    await order.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("\u{1F4A5} Webhook error:", err);
    return res.status(500).send("Internal Server Error");
  }
};
const tokenCachePath = path.resolve("./storage/vtp_token_cache.json");
const getViettelToken = async () => {
  var _a;
  try {
    if (fs.existsSync(tokenCachePath)) {
      const { token, expiresAt } = JSON.parse(fs.readFileSync(tokenCachePath, "utf-8"));
      if (Date.now() < expiresAt) {
        return token;
      }
    }
    const response = await fetch("https://partner.viettelpost.vn/v2/user/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        USERNAME: process.env.VTP_USERNAME || "0365305920",
        PASSWORD: process.env.VTP_PASSWORD || "Evaadam@120796"
      })
    });
    const data = await response.json();
    if (!((_a = data.data) == null ? void 0 : _a.token)) {
      throw new Error("Kh\xF4ng l\u1EA5y \u0111\u01B0\u1EE3c token m\u1EDBi t\u1EEB Viettel Post");
    }
    const newToken = data.data.token;
    fs.writeFileSync(
      tokenCachePath,
      JSON.stringify({
        token: newToken,
        expiresAt: Date.now() + 12 * 60 * 60 * 1e3
      })
    );
    return newToken;
  } catch (err) {
    console.error("\u274C getViettelToken error:", err.message);
    throw err;
  }
};
const getShippingFee = async (req, res) => {
  try {
    const {
      PRODUCT_WEIGHT,
      PRODUCT_PRICE,
      MONEY_COLLECTION,
      SENDER_PROVINCE,
      SENDER_DISTRICT,
      RECEIVER_PROVINCE,
      RECEIVER_DISTRICT
    } = req.body;
    if (!PRODUCT_WEIGHT || !SENDER_PROVINCE || !SENDER_DISTRICT || !RECEIVER_PROVINCE || !RECEIVER_DISTRICT) {
      return res.status(400).json({
        code: 1,
        message: "Missing required fields",
        data: null
      });
    }
    const body = {
      PRODUCT_WEIGHT: Number(PRODUCT_WEIGHT),
      PRODUCT_PRICE: Number(PRODUCT_PRICE) || 0,
      MONEY_COLLECTION: Number(MONEY_COLLECTION) || 0,
      ORDER_SERVICE_ADD: "",
      ORDER_SERVICE: "VCBO",
      SENDER_PROVINCE: Number(SENDER_PROVINCE),
      SENDER_DISTRICT: Number(SENDER_DISTRICT),
      RECEIVER_PROVINCE: Number(RECEIVER_PROVINCE),
      RECEIVER_DISTRICT: Number(RECEIVER_DISTRICT),
      PRODUCT_TYPE: "HH",
      NATIONAL_TYPE: 1,
      PRODUCT_LENGTH: 0,
      PRODUCT_WIDTH: 0,
      PRODUCT_HEIGHT: 0
    };
    const token = await getViettelToken();
    const response = await fetch("https://partner.viettelpost.vn/v2/order/getPrice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Token": token || ""
      },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    if (!response.ok || result.error || result.status !== 200) {
      console.error("\u274C ViettelPost API Error:", result);
      return res.status(400).json({
        code: 1,
        message: result.message || "Error fetching fee from Viettel Post",
        data: result || null
      });
    }
    return res.json({
      code: 0,
      message: "Success",
      data: result.data
    });
  } catch (err) {
    console.error("\u274C getShippingFee error:", err.message);
    console.error("Stack trace:", err.stack);
    res.status(500).json({
      code: 1,
      message: "Internal Server Error",
      data: null
    });
  }
};

const router$3 = Router();
router$3.get("/:id", getOrderById);
router$3.post("/", createOrder);
router$3.post("/check-point", authenticate, checkPoint);
router$3.post("/sepay-callback", sepayCallback);
router$3.post("/shipping/fee", getShippingFee);
router$3.get("/users/:userId/orders", authenticate, getOrdersByUserId);
router$3.get("/users/:userId/rewards", authenticate, getRewardHistoryByUserId);

const orderManageRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$3
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

const getProductById = async (req, res) => {
  try {
    let product;
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      product = await ProductEntity.findById(req.params.id);
    } else {
      product = await ProductEntity.findOne({ slug: req.params.id });
    }
    if (!product) {
      return res.status(404).json({ code: 1, message: "Product kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toProductDTO(product) });
  } catch (err) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getRelatedProducts = async (req, res) => {
  try {
    const { slug } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const product = await ProductEntity.findOne({ slug }).lean();
    if (!product) {
      return res.status(404).json({ code: 1, message: "Product kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const related = await ProductEntity.find({
      _id: { $ne: product._id },
      categoryId: product.categoryId,
      isActive: true,
      amount: { $gt: 0 }
    }).limit(limit).sort({ createdAt: -1 }).lean();
    return res.json({
      code: 0,
      data: toProductListDTO(related),
      message: "Success"
    });
  } catch (err) {
    console.error("Get related products error:", err);
    return res.status(500).json({ code: 1, message: err.message });
  }
};
const getWishlistByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ code: 1, message: "Invalid userId" });
    }
    const items = await WishlistModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $match: {
          "product.isActive": true
        }
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          createdAt: 1,
          product: 1
        }
      }
    ]);
    const mapped = items.map((item) => ({
      id: item._id.toString(),
      userId: item.userId.toString(),
      createdAt: item.createdAt,
      product: toProductDTO(item.product)
    }));
    return res.json({ code: 0, data: mapped });
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
const getPromotionalProducts = async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const products = await ProductEntity.aggregate([
      {
        $match: {
          isActive: true,
          amount: { $gt: 0 },
          $expr: { $lt: ["$priceDiscounts", "$price"] }
        }
      },
      {
        $addFields: {
          discountPercent: {
            $cond: [
              { $and: [{ $ifNull: ["$price", false] }, { $ifNull: ["$priceDiscounts", false] }] },
              {
                $round: [
                  { $multiply: [{ $divide: [{ $subtract: ["$price", "$priceDiscounts"] }, "$price"] }, 100] },
                  0
                ]
              },
              0
            ]
          }
        }
      },
      { $sort: { discountPercent: -1 } },
      { $limit: limit }
    ]);
    res.json({
      code: 0,
      data: toProductListDTO(
        products.map((p) => ({
          ...p,
          isPromotional: true,
          discountPercent: p.price && p.priceDiscounts ? Math.round((p.price - p.priceDiscounts) / p.price * 100) : 0
        }))
      )
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 1,
      message: "Server error"
    });
  }
};
const getMostOrderedProduct = async (req, res) => {
  var _a;
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const orders = await OrderEntity.find().lean();
    const products = await ProductEntity.find({ isActive: true, amount: { $gt: 0 } }).lean();
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
const searchProducts = async (req, res) => {
  var _a;
  try {
    const keyword = ((_a = req.query.keyword) == null ? void 0 : _a.trim()) || "";
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const skip = (page - 1) * limit;
    const matchStage = {
      isActive: true,
      amount: { $gt: 0 }
    };
    if (keyword) {
      matchStage.$or = [
        { productName: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { summaryContent: { $regex: keyword, $options: "i" } }
      ];
    }
    const pipeline = [
      { $match: matchStage },
      {
        $addFields: {
          discountPercent: {
            $cond: [
              { $and: [{ $ifNull: ["$price", false] }, { $ifNull: ["$priceDiscounts", false] }] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: [{ $subtract: ["$price", "$priceDiscounts"] }, "$price"] },
                      100
                    ]
                  },
                  0
                ]
              },
              0
            ]
          }
        }
      },
      { $sort: { discountPercent: -1, amount: -1 } },
      { $skip: skip },
      { $limit: limit }
    ];
    const [products, totalCount] = await Promise.all([
      ProductEntity.aggregate(pipeline),
      ProductEntity.countDocuments(matchStage)
    ]);
    res.json({
      code: 0,
      data: toProductListDTO(
        products.map((p) => ({
          ...p,
          isPromotional: p.discountPercent > 0
        }))
      ),
      pagination: {
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
        limit
      }
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      code: 1,
      message: "Server error"
    });
  }
};

const router$2 = Router();
router$2.get("/promotion", getPromotionalProducts);
router$2.get("/most-order", getMostOrderedProduct);
router$2.get("/search", searchProducts);
router$2.get("/related/:slug", getRelatedProducts);
router$2.get("/:id", getProductById);
router$2.get("/users/:userId/wishlist", authenticate, getWishlistByUserId);
router$2.post("/users/:userId/wishlist", authenticate, addWishlistItem);
router$2.delete("/users/:userId/wishlist/:productId", authenticate, deleteWishlistItem);

const productRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$2
}, Symbol.toStringTag, { value: 'Module' }));

const getProductReviewById = async (req, res) => {
  try {
    const review = await ProductReviewEntity.findById(req.params.id).populate("orderId").populate("userId").populate("productId");
    if (!review) {
      return res.status(404).json({ code: 1, message: "\u0110\xE1nh gi\xE1 kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    return res.json({ code: 0, data: toProductReviewDTO(review) });
  } catch (error) {
    return res.status(500).json({ code: 1, message: "L\u1ED7i l\u1EA5y \u0111\xE1nh gi\xE1", error });
  }
};
const submitProductReview = async (req, res) => {
  try {
    const { reviewId, rating, comment, images } = req.body;
    if (!reviewId || !rating) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu reviewId ho\u1EB7c rating" });
    }
    const review = await ProductReviewEntity.findById(reviewId);
    if (!review) {
      return res.status(404).json({ code: 1, message: "\u0110\xE1nh gi\xE1 kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    review.rating = rating;
    review.comment = comment || null;
    review.images = images || [];
    review.status = "approved";
    await review.save();
    return res.json({ code: 0, message: "G\u1EEDi \u0111\xE1nh gi\xE1 th\xE0nh c\xF4ng", data: toProductReviewDTO(review) });
  } catch (error) {
    console.error("L\u1ED7i submitProductReview:", error);
    return res.status(500).json({ code: 1, message: "L\u1ED7i g\u1EEDi \u0111\xE1nh gi\xE1", error });
  }
};
const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    if (!userId) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu userId" });
    }
    if (!status) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu status" });
    }
    const numPage = Number(page);
    const numLimit = Number(limit);
    const query = {
      userId,
      status
      // Sử dụng status từ query string
    };
    if (numLimit === -1) {
      const reviews = await ProductReviewEntity.find(query).populate("productId").sort({ createdAt: -1 });
      return res.json({
        code: 0,
        data: toProductReviewListDTO(reviews),
        pagination: {
          page: 1,
          limit: reviews.length,
          totalPages: 1,
          total: reviews.length
        }
      });
    }
    const options = {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 },
      populate: [
        // { path: "orderId", model: "Order" },
        { path: "productId", model: "Product" }
      ]
    };
    const result = await ProductReviewEntity.paginate(query, options);
    return res.json({
      code: 0,
      data: toProductReviewListDTO(result.docs),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs
      }
    });
  } catch (error) {
    console.error("L\u1ED7i getReviewsByUser:", error);
    return res.status(500).json({ code: 1, message: "L\u1ED7i l\u1EA5y danh s\xE1ch \u0111\xE1nh gi\xE1", error });
  }
};
const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    if (!productId) {
      return res.status(400).json({ code: 1, message: "Thi\u1EBFu productId" });
    }
    const product = await ProductEntity.findById(productId);
    if (!product) {
      return res.status(404).json({ code: 1, message: "S\u1EA3n ph\u1EA9m kh\xF4ng t\u1ED3n t\u1EA1i" });
    }
    const numPage = Number(page);
    const numLimit = Number(limit);
    const query = { productId: product._id, status: "approved" };
    const summaryAgg = await ProductReviewEntity.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      }
    ]);
    const totalReviews = summaryAgg.reduce((acc, cur) => acc + cur.count, 0);
    const sumRatings = summaryAgg.reduce(
      (acc, cur) => acc + cur._id * cur.count,
      0
    );
    const averageRating = totalReviews > 0 ? parseFloat((sumRatings / totalReviews).toFixed(1)) : 0;
    const ratingsBreakdown = {};
    for (let i = 1; i <= 5; i++) {
      const found = summaryAgg.find((s) => s._id === i);
      ratingsBreakdown[i] = found ? found.count : 0;
    }
    if (numLimit === -1) {
      const reviews = await ProductReviewEntity.find(query).populate("userId").sort({ createdAt: -1 });
      return res.json({
        code: 0,
        data: toProductReviewListDTO(reviews),
        pagination: {
          page: 1,
          limit: reviews.length,
          totalPages: 1,
          total: reviews.length
        },
        summary: {
          averageRating,
          totalReviews,
          ratingsBreakdown
        }
      });
    }
    const options = {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 },
      populate: [{ path: "userId", model: "User" }]
    };
    const result = await ProductReviewEntity.paginate(query, options);
    return res.json({
      code: 0,
      data: toProductReviewListDTO(result.docs),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs
      },
      summary: {
        averageRating,
        totalReviews,
        ratingsBreakdown
      }
    });
  } catch (error) {
    console.error("L\u1ED7i getReviewsByProduct:", error);
    return res.status(500).json({ code: 1, message: "L\u1ED7i l\u1EA5y danh s\xE1ch \u0111\xE1nh gi\xE1", error });
  }
};

const router$1 = Router();
router$1.get("/:id", getProductReviewById);
router$1.get("/user/:userId/reviews", authenticate, getReviewsByUser);
router$1.get("/product/:productId/reviews", getReviewsByProduct);
router$1.put("/submit", authenticate, submitProductReview);

const productReviewRouter = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: router$1
}, Symbol.toStringTag, { value: 'Module' }));

const router = Router();
router.use("/admin", router$d);
router.use("/", router$6);
router.use("/auth", router$c);
router.use("/users", router$5);
router.use("/banners", router$b);
router.use("/categoriesNews", router$a);
router.use("/newsPosts", router$4);
router.use("/orders", router$3);
router.use("/categories", router$9);
router.use("/products", router$2);
router.use("/addresses", router$q);
router.use("/product-reviews", router$1);
router.use("/", router$2);

const index = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
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
