import { CryptographyKey, SodiumPlus } from 'sodium-plus';
import createHash from 'create-hash';
import { validateMnemonic as validateMnemonic$1, setDefaultWordlist, generateMnemonic as generateMnemonic$1, mnemonicToSeedSync } from 'bip39';
import baseX from 'base-x';
import { mnemonicToMiniSecret, encodeAddress, decodeAddress, cryptoWaitReady } from '@polkadot/util-crypto';
import { u8aToHex, hexToU8a, stringToU8a, isHex } from '@polkadot/util';
import { ECPair, payments, Psbt } from 'bitcoinjs-lib';
import { fromBase58, fromSeed } from 'bip32';
import bech32 from 'bech32';
import addressValidator from 'wallet-address-validator';
import { addHexPrefix, bufferToHex, importPublic, publicToAddress, toChecksumAddress, isValidSignature, isValidAddress, hashPersonalMessage, toBuffer, ecsign } from 'ethereumjs-util';
import { Transaction, FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import Common, { Hardfork, Chain } from '@ethereumjs/common';
import { privateToPublic, PrivateKey, PublicKey, verify, sign } from 'eosjs-ecc';
import { JsonRpc, Api } from 'eosjs';
import { deriveAddress, verify as verify$1, sign as sign$1 } from 'ripple-keypairs';
import { classicAddressToXAddress, isValidXAddress, isValidClassicAddress } from 'ripple-address-codec';
import { RippleAPI } from 'ripple-lib';
import { Keyring } from '@polkadot/keyring';
import { ApiPromise, WsProvider } from '@polkadot/api';
import Common$1 from 'ethereumjs-common';
import { Transaction as Transaction$1 } from 'ethereumjs-tx';
import { ec } from 'elliptic';
import { utils } from 'ethers';

var Blockchain;

(function (Blockchain) {
  Blockchain["BTC"] = "bitcoin";
  Blockchain["ETH"] = "ethereum";
  Blockchain["EOS"] = "eos";
  Blockchain["BCH"] = "bitcoin_cash";
  Blockchain["BSV"] = "bitcoin_sv";
  Blockchain["LTC"] = "litecoin";
  Blockchain["XRP"] = "ripple";
  Blockchain["DOGE"] = "dogecoin";
  Blockchain["DASH"] = "dashcoin";
  Blockchain["DOT"] = "polkadot";
  Blockchain["BSC"] = "binance_smart_chain";
  Blockchain["TRX"] = "tron";
})(Blockchain || (Blockchain = {}));

var Network;

(function (Network) {
  Network["MAINNET"] = "mainnet";
  Network["TESTNET"] = "testnet";
  Network["REGTEST"] = "regtest";
})(Network || (Network = {}));

var SeedDictionaryLang;

(function (SeedDictionaryLang) {
  SeedDictionaryLang["ENGLISH"] = "english";
  SeedDictionaryLang["JAPANESE"] = "japanese";
  SeedDictionaryLang["SPANISH"] = "spanish";
  SeedDictionaryLang["CHINESE_SIMPLE"] = "chinese_simple";
  SeedDictionaryLang["CHINESE_TRADITIONAL"] = "chinese_traditional";
  SeedDictionaryLang["FRENCH"] = "french";
  SeedDictionaryLang["ITALIAN"] = "italian";
  SeedDictionaryLang["KOREAN"] = "korean";
  SeedDictionaryLang["CZECH"] = "czech";
})(SeedDictionaryLang || (SeedDictionaryLang = {}));

var TransactionMethod;

(function (TransactionMethod) {
  TransactionMethod["TRANSFER"] = "TRANSFER";
  TransactionMethod["BOND"] = "BOND";
  TransactionMethod["BOND_EXTRA_AMOUNT"] = "BOND_EXTRA_AMOUNT";
  TransactionMethod["UNBOND_AMOUNT"] = "UNBOND_AMOUNT";
  TransactionMethod["CHANGE_REWARDS_DESTINATION_ADDRESS"] = "CHANGE_REWARDS_DESTINATION_ADDRESS";
  TransactionMethod["TRANSFER_KEEP_ALIVE"] = "TRANSFER_KEEP_ALIVE";
  TransactionMethod["NOMINATE"] = "NOMINATE";
  TransactionMethod["WITHDRAW_UNBONDED"] = "WITHDRAW_UNBONDED";
})(TransactionMethod || (TransactionMethod = {}));

function _regeneratorRuntime() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */

  _regeneratorRuntime = function () {
    return exports;
  };

  var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }

  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
    return generator._invoke = function (innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");

        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }

        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);

          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }

          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }(innerFn, self, context), generator;
  }

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  exports.wrap = wrap;
  var ContinueSentinel = {};

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {}

  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if ("throw" !== record.type) {
        var result = record.arg,
            value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }

      reject(record.arg);
    }

    var previousPromise;

    this._invoke = function (method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    };
  }

  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (undefined === method) {
      if (context.delegate = null, "throw" === context.method) {
        if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }

  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;

          return next.value = undefined, next.done = !0, next;
        };

        return next.next = next;
      }
    }

    return {
      next: doneResult
    };
  }

  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }

  return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (object) {
    var keys = [];

    for (var key in object) keys.push(key);

    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }

      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;

      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
            record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      }

      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var validateMnemonic = function validateMnemonic(mnemonic) {
  return validateMnemonic$1(mnemonic);
};
var mnemonicToSeedHex = function mnemonicToSeedHex(mnemonic, password, blockchain) {
  if (blockchain === Blockchain.DOT) {
    return u8aToHex(mnemonicToMiniSecret(mnemonic, password));
  }

  return mnemonicToSeedSync(mnemonic, password).toString('hex');
};
var generateMnemonic = function generateMnemonic(length, lang) {
  if (lang === void 0) {
    lang = 'english';
  }

  var strength = 128;

  if (length === 24) {
    strength = 256;
  } else if (length !== 12) {
    throw new Error('Wrong mnemonic length');
  }

  setDefaultWordlist(lang);
  var mnemonic = generateMnemonic$1(strength);
  return mnemonic;
};
var getIndexes = function getIndexes(skip, limit) {
  if (skip < 0) {
    throw Error('Skip must be greater or equal than zero');
  }

  if (limit < 1) {
    throw Error('Limit must be greater than zero');
  }

  return Array.from({
    length: limit
  }, function (_, k) {
    return k + skip + 1;
  });
};
var preparePath = function preparePath(path) {
  var parts = path.split('/');
  parts.pop();
  parts.push('{index}');
  return parts.join('/');
};
var getHardenedPath = function getHardenedPath(path) {
  var parts = path.split('/').filter(function (part) {
    return part === 'm' || part.indexOf("'") != -1;
  });
  return parts.join('/');
};
var base58 = /*#__PURE__*/baseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
var sha256 = function sha256(payload) {
  return Buffer.from(createHash('sha256').update(payload).digest());
};

var bitcoin = {
  mainnet: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      "public": 0x0488b21e,
      "private": 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    dustThreshold: 546,
    timeInTransaction: false
  },
  testnet: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    dustThreshold: 546,
    timeInTransaction: false
  }
};
var litecoin = {
  mainnet: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
      "public": 0x019da462,
      "private": 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
    dustThreshold: 0,
    timeInTransaction: false
  },
  testnet: {
    messagePrefix: '\x18Litecoin Signed Message:\n',
    bech32: 'tltc',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    dustThreshold: 500,
    timeInTransaction: false,
    maximumFeeRate: 50000
  }
};
var dogecoin = {
  mainnet: {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bech32: 'xdg',
    bip32: {
      "public": 0x02facafd,
      "private": 0x02fac398
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
    dustThreshold: 0,
    timeInTransaction: false
  },
  testnet: {
    messagePrefix: '\x18Dogecoin Signed Message:\n',
    bech32: 'xdg',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x71,
    scriptHash: 0xc4,
    wif: 0xf1,
    dustThreshold: 0,
    timeInTransaction: false
  }
};
var dashcoin = {
  mainnet: {
    messagePrefix: '\x18Dashcoin Signed Message:\n',
    bech32: 'dash',
    bip32: {
      "public": 0x0488b21e,
      "private": 0x0488ade4
    },
    pubKeyHash: 0x4c,
    scriptHash: 0x10,
    wif: 0xcc,
    dustThreshold: 0,
    timeInTransaction: false
  },
  testnet: {
    messagePrefix: '\x18Dashcoin Signed Message:\n',
    bech32: 'dash',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x8c,
    scriptHash: 0x13,
    wif: 0xef,
    dustThreshold: 500,
    timeInTransaction: false,
    maximumFeeRate: 50000
  }
};
var polkadot = {
  mainnet: {
    messagePrefix: 'unused',
    bech32: 'dot',
    bip32: {
      "public": 0x0488b21e,
      "private": 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    dustThreshold: 0,
    timeInTransaction: false
  },
  testnet: {
    messagePrefix: 'unused',
    bech32: 'dot',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0x80,
    dustThreshold: 0,
    timeInTransaction: false
  }
};
var tron = {
  mainnet: {
    messagePrefix: '\x19TRON Signed Message:\n32',
    bech32: 'bc',
    bip32: {
      "public": 0x0488b21e,
      "private": 0x0488ade4
    },
    pubKeyHash: 0x41,
    scriptHash: 0x05,
    wif: 0x80,
    dustThreshold: 0,
    timeInTransaction: false
  },
  testnet: {
    messagePrefix: '\x19TRON Signed Message:\n',
    bech32: 'tb',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x41,
    scriptHash: 0x05,
    wif: 0x80,
    dustThreshold: 0,
    timeInTransaction: false
  }
};

var addressTypes = {
  0x00: {
    type: 'p2pkh',
    network: 'mainnet'
  },
  0x30: {
    type: 'p2pkh',
    network: 'mainnet'
  },
  0x6f: {
    type: 'p2pkh',
    network: 'testnet'
  },
  0x05: {
    type: 'p2sh',
    network: 'mainnet'
  },
  0xc4: {
    type: 'p2sh',
    network: 'testnet'
  }
};
var decodeBase58 = function decodeBase58(address) {
  try {
    return base58.decode(address);
  } catch (_unused) {
    return null;
  }
};
var decodeBech32 = function decodeBech32(address) {
  try {
    return bech32.decode(address);
  } catch (_unused2) {
    return null;
  }
};
var isValidBech32Address = function isValidBech32Address(address) {
  var decoded = decodeBech32(address);

  if (!decoded) {
    return false;
  }

  var prefixesNetwork = {
    bc: 'mainnet',
    tb: 'testnet',
    bcrt: 'regtest'
  };
  var network = prefixesNetwork[decoded.prefix];

  if (network === undefined) {
    return false;
  }

  var witnessVersion = decoded.words[0];

  if (witnessVersion < 0 || witnessVersion > 16) {
    return false;
  }

  return true;
};
var isValidBase58Address = function isValidBase58Address(address) {
  var decoded = decodeBase58(address);

  if (!decoded) {
    return false;
  }

  var length = decoded.length;

  if (length !== 25) {
    return false;
  }

  var version = decoded.readUInt8(0);
  var checksum = decoded.slice(length - 4, length);
  var body = decoded.slice(0, length - 4);
  var expectedChecksum = sha256(sha256(body)).slice(0, 4);

  if (!checksum.equals(expectedChecksum)) {
    return false;
  }

  if (addressTypes[version]) {
    return true;
  } else {
    return false;
  }
};

var BitcoinBase = /*#__PURE__*/function () {
  function BitcoinBase(network) {
    var _this$networks;

    this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.BTC,
      network: Network.MAINNET,
      path: "m/44'/0'/0'",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.BTC,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
      config: bitcoin.testnet
    }, _this$networks);
    this.networkConfig = this.networks[network].config;
    this.defaultPath = this.networks[network].path;
  }

  var _proto = BitcoinBase.prototype;

  _proto.getPaths = function getPaths() {
    return Object.values(this.networks).map(function (path) {
      return {
        blockchain: path.blockchain,
        network: path.network,
        path: path.path + '/0/0'
      };
    });
  };

  _proto.deriveRecursive = function deriveRecursive(derived, parts) {
    if (parts.length) {
      var part = parts[0],
          leftParts = parts.slice(1);
      return this.deriveRecursive(derived.derive(part), leftParts);
    }

    return derived;
  };

  _proto.getPrivateKey = function getPrivateKey(privateKey) {
    return privateKey.toWIF();
  };

  _proto.getPublicKey = function getPublicKey(publicKey) {
    return publicKey;
  };

  _proto.getPath = function getPath(path, isAccount) {
    if (path.indexOf('m') !== -1) {
      if (isAccount) {
        throw new Error("invalid path or key\n use full path(m/44'/194'/0'/0/2) with master key\n use short path(0/2) with master account key");
      }

      return path;
    } else {
      if (isAccount) {
        return path;
      } else {
        return this.defaultPath + '/' + path;
      }
    }
  };

  _proto.derivateFromPrivate = function derivateFromPrivate(masterPrivateKey, cursor) {
    var _this = this;

    var wallet = fromBase58(masterPrivateKey, this.networkConfig);
    var isAccount = false;

    if (wallet.parentFingerprint) {
      isAccount = true;
    }

    var indexes = getIndexes(cursor.skip, cursor.limit);
    var path = preparePath(this.getPath(cursor.path || '0/0', isAccount));
    return indexes.map(function (index) {
      var currentPath = path.replace('{index}', index.toString());
      var derived = wallet.derivePath(currentPath);
      return {
        path: _this.getPath(currentPath, false),
        address: _this.getAddressFromPublic(_this.getPublicKey(derived.publicKey.toString('hex'))),
        publicKey: _this.getPublicKey(derived.publicKey.toString('hex')),
        privateKey: _this.getPrivateKey(derived)
      };
    });
  };

  _proto.derivateFromPublic = function derivateFromPublic(masterPublicKey, cursor) {
    var _this2 = this;

    var wallet = fromBase58(masterPublicKey, this.networkConfig);
    var isAccount = false;

    if (wallet.parentFingerprint) {
      isAccount = true;
    }

    var indexes = getIndexes(cursor.skip, cursor.limit);
    var path = preparePath(this.getPath(cursor.path || '0/0', isAccount));
    return indexes.map(function (index) {
      var currentPath = path.replace('{index}', index.toString());
      var pathParts = currentPath.replace(getHardenedPath(path), '').split('/').filter(function (part) {
        return part;
      }).map(function (part) {
        return parseInt(part);
      });

      var derived = _this2.deriveRecursive(wallet, pathParts);

      return {
        path: _this2.getPath(currentPath, false),
        address: _this2.getAddressFromPublic(_this2.getPublicKey(derived.publicKey.toString('hex'))),
        publicKey: _this2.getPublicKey(derived.publicKey.toString('hex'))
      };
    });
  };

  _proto.sign = /*#__PURE__*/function () {
    var _sign = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data, privateKey, isTx) {
      var dataObj, mapPrivateKeys, signedHex, tx, _iterator, _step, input, _iterator2, _step2, output, _iterator3, _step3, _step3$value, index, _input, keyPair, key, hash;

      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (isTx === void 0) {
                isTx = true;
              }

              if (!isTx) {
                _context.next = 18;
                break;
              }

              _context.prev = 2;
              dataObj = JSON.parse(data);
              mapPrivateKeys = JSON.parse(privateKey);
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](2);
              throw new Error('Invalid data or key, must be json string');

            case 10:
              signedHex = '';
              tx = new Psbt({
                network: this.networkConfig
              }, null);

              for (_iterator = _createForOfIteratorHelperLoose(dataObj.inputs); !(_step = _iterator()).done;) {
                input = _step.value;

                if (input.type.includes('witness')) {
                  tx.addInput({
                    hash: input.txId,
                    index: input.n,
                    witnessUtxo: {
                      script: Buffer.from(input.scriptPubKeyHex, 'hex'),
                      value: +input.value
                    }
                  });
                } else {
                  tx.addInput({
                    hash: input.txId,
                    index: input.n,
                    nonWitnessUtxo: Buffer.from(input.hex, 'hex')
                  });
                }
              }

              for (_iterator2 = _createForOfIteratorHelperLoose(dataObj.outputs); !(_step2 = _iterator2()).done;) {
                output = _step2.value;
                tx.addOutput({
                  address: output.address,
                  value: +output.amount
                });
              }

              for (_iterator3 = _createForOfIteratorHelperLoose(dataObj.inputs.entries()); !(_step3 = _iterator3()).done;) {
                _step3$value = _step3.value, index = _step3$value[0], _input = _step3$value[1];
                keyPair = ECPair.fromWIF(mapPrivateKeys[_input.address], this.networkConfig);
                tx.signInput(index, keyPair);
                tx.validateSignaturesOfInput(index);
              }

              tx.finalizeAllInputs();
              signedHex = tx.extractTransaction().toHex();
              return _context.abrupt("return", signedHex);

            case 18:
              key = ECPair.fromWIF(privateKey, this.networkConfig);
              hash = createHash('sha256').update(data).digest('hex');
              return _context.abrupt("return", key.sign(Buffer.from(hash, 'hex')).toString('hex'));

            case 21:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[2, 7]]);
    }));

    function sign(_x, _x2, _x3) {
      return _sign.apply(this, arguments);
    }

    return sign;
  }();

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    var key = ECPair.fromPublicKey(Buffer.from(publicKey, 'hex'), {
      network: this.networkConfig
    });
    var hash = createHash('sha256').update(data).digest('hex');
    return key.verify(Buffer.from(hash, 'hex'), Buffer.from(sign, 'hex'));
  };

  _proto.getMasterAddressFromSeed = /*#__PURE__*/function () {
    var _getMasterAddressFromSeed = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(seed, path) {
      var hdkey, hdnode;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              hdkey = fromSeed(Buffer.from(seed, 'hex'), this.networkConfig);
              hdnode = hdkey.derivePath(getHardenedPath(path || this.defaultPath));
              return _context2.abrupt("return", {
                masterPrivateKey: hdkey.toBase58(),
                masterPublicKey: hdkey.neutered().toBase58(),
                masterAccountPrivateKey: hdnode.toBase58(),
                masterAccountPublicKey: hdnode.neutered().toBase58()
              });

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function getMasterAddressFromSeed(_x4, _x5) {
      return _getMasterAddressFromSeed.apply(this, arguments);
    }

    return getMasterAddressFromSeed;
  }();

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey, isWIF) {
    if (isWIF === void 0) {
      isWIF = true;
    }

    var key;

    if (isWIF) {
      key = ECPair.fromWIF(privateKey, this.networkConfig);
    } else {
      key = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
    }

    return key.publicKey.toString('hex');
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey, format) {
    var _payments$p2pkh$addre;

    if (format && format === 'bech32') {
      var _payments$p2wpkh$addr;

      return (_payments$p2wpkh$addr = payments.p2wpkh({
        pubkey: Buffer.from(publicKey, 'hex'),
        network: this.networkConfig
      }).address) != null ? _payments$p2wpkh$addr : '';
    }

    return (_payments$p2pkh$addre = payments.p2pkh({
      pubkey: Buffer.from(publicKey, 'hex'),
      network: this.networkConfig
    }).address) != null ? _payments$p2pkh$addre : '';
  };

  _proto.isValidAddress = function isValidAddress(address, format) {
    if (!address) {
      return false;
    }

    if (!format) {
      return this.isValidAddress(address, this.getFormat(address));
    } else {
      if (format.toLowerCase() === 'bech32') {
        return isValidBech32Address(address);
      } else if (format.toLowerCase() === 'base58') {
        return isValidBase58Address(address);
      } else {
        return false;
      }
    }
  };

  _proto.getFormat = function getFormat(address) {
    if (decodeBase58(address)) {
      return 'base58';
    }

    if (decodeBech32(address)) {
      return 'bech32';
    }

    throw new Error('Invalid address');
  };

  return BitcoinBase;
}();

var Bitcoin = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Bitcoin, _BitcoinBase);

  function Bitcoin() {
    return _BitcoinBase.apply(this, arguments) || this;
  }

  return Bitcoin;
}(BitcoinBase);

var Litecoin = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Litecoin, _BitcoinBase);

  function Litecoin(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.LTC,
      network: Network.MAINNET,
      path: "m/44'/2'/0'",
      config: litecoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.LTC,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
      config: litecoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  return Litecoin;
}(BitcoinBase);

var Dogecoin = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Dogecoin, _BitcoinBase);

  function Dogecoin(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.DOGE,
      network: Network.MAINNET,
      path: "m/44'/3'/0'",
      config: dogecoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.DOGE,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
      config: dogecoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  var _proto = Dogecoin.prototype;

  _proto.isValidAddress = function isValidAddress(address, format) {
    if (!address) {
      return false;
    }

    return addressValidator.validate(address, 'DOGE') || addressValidator.validate(address, 'DOGE', 'testnet');
  };

  return Dogecoin;
}(BitcoinBase);

var Ethereum = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Ethereum, _BitcoinBase);

  function Ethereum(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.ETH,
      network: Network.MAINNET,
      path: "m/44'/60'/0'",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.ETH,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
      config: bitcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    _this.net = network;
    return _this;
  }

  var _proto = Ethereum.prototype;

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey) {
    return addHexPrefix(_BitcoinBase.prototype.getPublicFromPrivate.call(this, privateKey.replace('0x', ''), false));
  };

  _proto.getPrivateKey = function getPrivateKey(privateKey) {
    if (privateKey.privateKey) {
      return bufferToHex(privateKey.privateKey);
    } else {
      throw new Error('Invalid private key');
    }
  };

  _proto.getPublicKey = function getPublicKey(publicKey) {
    return addHexPrefix(publicKey);
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey) {
    var ethPubkey = importPublic(Buffer.from(publicKey.replace('0x', ''), 'hex'));
    var addressBuffer = publicToAddress(ethPubkey);
    var hexAddress = addHexPrefix(addressBuffer.toString('hex'));
    var checksumAddress = toChecksumAddress(hexAddress);
    var address = addHexPrefix(checksumAddress);
    return address;
  };

  _proto.sign = /*#__PURE__*/function () {
    var _sign = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data, privateKey, isTx, addMessagePrefix) {
      var _Object$values, privateKeyString, chain, common, transaction, gasPrice, rawTransaction, privateKeyBuffer, signedTransaction, message, sign;

      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (isTx === void 0) {
                isTx = true;
              }

              if (addMessagePrefix === void 0) {
                addMessagePrefix = true;
              }

              _Object$values = Object.values(JSON.parse(privateKey)), privateKeyString = _Object$values[0];

              if (!isTx) {
                _context.next = 12;
                break;
              }

              chain = this.net === Network.MAINNET ? Chain.Mainnet : Chain.Ropsten;
              common = new Common({
                chain: chain,
                hardfork: Hardfork.London
              });
              transaction = JSON.parse(data);
              gasPrice = transaction.gasPrice;
              rawTransaction = gasPrice ? Transaction.fromTxData(transaction, {
                common: common
              }) : FeeMarketEIP1559Transaction.fromTxData(transaction, {
                common: common
              });
              privateKeyBuffer = Buffer.from(privateKeyString.replace('0x', ''), 'hex');
              signedTransaction = rawTransaction.sign(privateKeyBuffer);
              return _context.abrupt("return", "0x" + signedTransaction.serialize().toString('hex'));

            case 12:
              message = addMessagePrefix ? hashPersonalMessage(Buffer.from(data)) : toBuffer(data);
              sign = ecsign(message, toBuffer(privateKeyString));
              return _context.abrupt("return", JSON.stringify({
                r: sign.r.toString('hex'),
                s: sign.s.toString('hex'),
                v: sign.v
              }));

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function sign(_x, _x2, _x3, _x4) {
      return _sign.apply(this, arguments);
    }

    return sign;
  }();

  _proto.checkSign = function checkSign(_, __, sign) {
    var signObject = JSON.parse(sign);
    return isValidSignature(parseInt(signObject.v), Buffer.from(signObject.r, 'hex'), Buffer.from(signObject.s, 'hex'));
  };

  _proto.isValidAddress = function isValidAddress$1(address) {
    return isValidAddress(address);
  };

  return Ethereum;
}(BitcoinBase);

var _require = /*#__PURE__*/require('eosjs/dist/eosjs-jssig'),
    JsSignatureProvider = _require.JsSignatureProvider;

var fetch = /*#__PURE__*/require('node-fetch');

var _require2 = /*#__PURE__*/require('util'),
    TextEncoder = _require2.TextEncoder,
    TextDecoder = _require2.TextDecoder;

var EOS = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(EOS, _BitcoinBase);

  function EOS(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.EOS,
      network: Network.MAINNET,
      path: "m/44'/194'/0'",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.EOS,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
      config: bitcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  var _proto = EOS.prototype;

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey) {
    return privateToPublic(privateKey);
  };

  _proto.getPrivateKey = function getPrivateKey(privateKey) {
    return PrivateKey(privateKey.privateKey).toWif();
  };

  _proto.getPublicKey = function getPublicKey(publicKey) {
    return PublicKey(Buffer.from(publicKey, 'hex')).toString();
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey) {
    return publicKey;
  };

  _proto.sign = /*#__PURE__*/function () {
    var _sign = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data, privateKey, isTx) {
      var accountPrvKey, signatureProvider, rpc, api, result;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!isTx) {
                _context.next = 10;
                break;
              }

              accountPrvKey = Object.values(JSON.parse(privateKey))[0];
              signatureProvider = new JsSignatureProvider([accountPrvKey]);
              rpc = new JsonRpc(JSON.parse(data).endpoint, {
                fetch: fetch
              });
              api = new Api({
                rpc: rpc,
                signatureProvider: signatureProvider,
                textDecoder: new TextDecoder(),
                textEncoder: new TextEncoder()
              });
              _context.next = 7;
              return api.transact({
                actions: JSON.parse(data).actions
              }, {
                broadcast: false,
                sign: true,
                blocksBehind: 3,
                expireSeconds: 3600
              });

            case 7:
              result = _context.sent;
              result.serializedTransaction = Buffer.from(result.serializedTransaction).toString('hex');
              return _context.abrupt("return", JSON.stringify(result));

            case 10:
              return _context.abrupt("return", sign(data, privateKey));

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function sign$1(_x, _x2, _x3) {
      return _sign.apply(this, arguments);
    }

    return sign$1;
  }();

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    return verify(sign, data, publicKey);
  };

  _proto.isValidAddress = function isValidAddress(address) {
    var regex = new RegExp(/^[a-z1-5\.]{12}$/g);
    return regex.test(address);
  };

  return EOS;
}(BitcoinBase);

var Ripple = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Ripple, _BitcoinBase);

  function Ripple(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.XRP,
      network: Network.MAINNET,
      path: "m/44'/144'/0'",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.XRP,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
      config: bitcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  var _proto = Ripple.prototype;

  _proto.getPrivateKey = function getPrivateKey(privateKey) {
    return privateKey.privateKey.toString('hex');
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey, format) {
    var classicAddress = deriveAddress(publicKey);

    if (format === 'classic') {
      return classicAddress;
    }

    var xAddress = classicAddressToXAddress(classicAddress, false, false);

    if (xAddress === undefined) {
      throw new Error('Unknown error deriving address');
    }

    return xAddress;
  };

  _proto.sign = /*#__PURE__*/function () {
    var _sign = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data, privateKey, isTx) {
      var api, privateKeyString, publicKey, keypair, key, hash;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!isTx) {
                _context.next = 8;
                break;
              }

              _context.next = 3;
              return new RippleAPI();

            case 3:
              api = _context.sent;
              privateKeyString = Object.values(JSON.parse(privateKey))[0].toString();
              publicKey = this.getPublicFromPrivate(privateKeyString, false);
              keypair = {
                privateKey: privateKeyString.toUpperCase(),
                publicKey: publicKey.toUpperCase()
              };
              return _context.abrupt("return", api.sign(data, keypair).signedTransaction);

            case 8:
              key = ECPair.fromWIF(privateKey, this.networkConfig);
              hash = createHash('sha256').update(data).digest('hex');

              if (!key.privateKey) {
                _context.next = 14;
                break;
              }

              return _context.abrupt("return", sign$1(hash, key.privateKey.toString('hex')));

            case 14:
              throw Error('Invalid private key');

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function sign(_x, _x2, _x3) {
      return _sign.apply(this, arguments);
    }

    return sign;
  }();

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    var hash = createHash('sha256').update(data).digest('hex');
    return verify$1(hash, sign, publicKey);
  };

  _proto.isValidAddress = function isValidAddress(address) {
    return isValidXAddress(address) || isValidClassicAddress(address);
  };

  return Ripple;
}(BitcoinBase);

var Dashcoin = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Dashcoin, _BitcoinBase);

  function Dashcoin(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.DASH,
      network: Network.MAINNET,
      path: "m/44'/5'/0'",
      config: dashcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.DASH,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
      config: dashcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  var _proto = Dashcoin.prototype;

  _proto.isValidAddress = function isValidAddress(address, format) {
    if (!address) {
      return false;
    }

    return addressValidator.validate(address, 'DASH') || addressValidator.validate(address, 'DASH', 'testnet');
  };

  return Dashcoin;
}(BitcoinBase);

var Polkadot = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Polkadot, _BitcoinBase);

  function Polkadot(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.DOT,
      network: Network.MAINNET,
      path: '//44//354//0',
      config: polkadot.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.DOT,
      network: Network.TESTNET,
      path: '//44//1//0',
      config: polkadot.testnet
    }, _this$networks);
    _this.passphrase = 'restoreKeyRingPassphrase';
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    _this.network = network;
    return _this;
  }

  var _proto = Polkadot.prototype;

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey, isWIF) {

    var keyPair = this.getKeyring().createFromUri('//ANYPATH');
    keyPair.decodePkcs8(this.passphrase, hexToU8a(privateKey));
    return u8aToHex(keyPair.publicKey);
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey) {
    return this.getKeyring().addFromAddress(publicKey).address;
  };

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    return this.getKeyring().addFromAddress(publicKey).verify(data, stringToU8a(sign), publicKey);
  };

  _proto.sign = /*#__PURE__*/function () {
    var _sign = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data, privateKey, isTx) {
      var privateKeyString, keyPair, signable, tx, payload, _this$offlineApi$crea, signature;

      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return cryptoWaitReady();

            case 2:
              privateKeyString = Object.values(JSON.parse(privateKey))[0].toString();
              keyPair = this.getKeyring().createFromUri('//ANYPATH');
              keyPair.decodePkcs8(this.passphrase, hexToU8a(privateKeyString));

              if (!isTx) {
                _context.next = 13;
                break;
              }

              signable = JSON.parse(data);
              _context.next = 9;
              return this.createSubmittableExtrinsic(JSON.stringify(signable.tx));

            case 9:
              tx = _context.sent;
              payload = this.offlineApi.createType('SignerPayload', _extends({
                method: tx
              }, signable.payload));
              _this$offlineApi$crea = this.offlineApi.createType('ExtrinsicPayload', payload.toPayload(), {
                version: signable.payload.version
              }).sign(keyPair), signature = _this$offlineApi$crea.signature;
              return _context.abrupt("return", JSON.stringify(_extends({}, signable, {
                signature: signature
              })));

            case 13:
              return _context.abrupt("return", u8aToHex(keyPair.sign(data)));

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function sign(_x, _x2, _x3) {
      return _sign.apply(this, arguments);
    }

    return sign;
  }();

  _proto.getMasterFromSeed = /*#__PURE__*/function () {
    var _getMasterFromSeed = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(seedPhrase, path, password) {
      var seed, keys;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              seed = u8aToHex(mnemonicToMiniSecret(seedPhrase, password));
              _context2.next = 3;
              return this.getMasterAddressFromSeed(seed, path);

            case 3:
              keys = _context2.sent;
              return _context2.abrupt("return", _extends({
                seedPhrase: seedPhrase,
                seed: seed
              }, keys));

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function getMasterFromSeed(_x4, _x5, _x6) {
      return _getMasterFromSeed.apply(this, arguments);
    }

    return getMasterFromSeed;
  }();

  _proto.getMasterAddressFromSeed = /*#__PURE__*/function () {
    var _getMasterAddressFromSeed = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(seed, path) {
      var masterPair, masterAccountPair;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return cryptoWaitReady();

            case 2:
              masterPair = this.getKeyring().addFromUri(seed);
              masterAccountPair = this.getKeyring().addFromUri("" + seed + (path || this.defaultPath));
              return _context3.abrupt("return", {
                masterPrivateKey: u8aToHex(masterPair.encodePkcs8(this.passphrase)),
                masterPublicKey: u8aToHex(masterPair.publicKey),
                masterAccountPrivateKey: u8aToHex(masterAccountPair.encodePkcs8(this.passphrase)),
                masterAccountPublicKey: u8aToHex(masterAccountPair.publicKey)
              });

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function getMasterAddressFromSeed(_x7, _x8) {
      return _getMasterAddressFromSeed.apply(this, arguments);
    }

    return getMasterAddressFromSeed;
  }();

  _proto.derivateFromPrivate = function derivateFromPrivate(masterPrivateKey, cursor) {
    var _this2 = this;

    var keyring = this.getKeyring();
    var isAccount = true;
    var pair;

    if (masterPrivateKey.length === 66) {
      isAccount = false;
      pair = keyring.addFromSeed(hexToU8a(masterPrivateKey));
    } else {
      pair = keyring.createFromUri('//ANYPATH');
      pair.decodePkcs8(this.passphrase, hexToU8a(masterPrivateKey));
    }

    var indexes = getIndexes(cursor.skip, cursor.limit);
    var path = preparePath(this.getPath(cursor.path || '0/0', isAccount));
    return indexes.map(function (index) {
      var currentPath = path.replace('{index}', index.toString());
      var derivedPair = pair.derive(currentPath);
      return {
        path: currentPath,
        address: derivedPair.address,
        publicKey: u8aToHex(derivedPair.publicKey),
        privateKey: u8aToHex(derivedPair.encodePkcs8(_this2.passphrase))
      };
    });
  };

  _proto.getPath = function getPath(path, isAccount) {
    if (path.indexOf('m') !== -1) {
      if (isAccount) {
        throw new Error("invalid path or key\n use full path(m/44'/194'/0'/0/2) with master key\n use short path(0/2) with master account key");
      }

      var lastIndex = path.lastIndexOf("'");
      path = path.slice(0, lastIndex) + path.slice(lastIndex + 1);
      return path.replace('m/', '//').replace(/'/g, '/');
    } else {
      if (isAccount) {
        return "/" + path;
      } else {
        return this.defaultPath + '/' + path;
      }
    }
  };

  _proto.isValidAddress = function isValidAddress(address) {
    try {
      encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
      return true;
    } catch (error) {
      return false;
    }
  };

  _proto.createSubmittableExtrinsic = /*#__PURE__*/function () {
    var _createSubmittableExtrinsic = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(txJson) {
      var POLKA_ANY_API_ENDPOINT, tx;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return cryptoWaitReady();

            case 2:
              POLKA_ANY_API_ENDPOINT = 'ws://3.20.227.6:3020';
              _context4.prev = 3;
              _context4.next = 6;
              return ApiPromise.create({
                provider: new WsProvider(POLKA_ANY_API_ENDPOINT)
              });

            case 6:
              this.offlineApi = _context4.sent;
              _context4.next = 9;
              return this.offlineApi.disconnect();

            case 9:
              _context4.next = 14;
              break;

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](3);
              console.log("createSubmittableExtrinsic error: " + _context4.t0.message);

            case 14:
              tx = JSON.parse(txJson);
              _context4.t1 = tx.method;
              _context4.next = _context4.t1 === TransactionMethod.TRANSFER ? 18 : _context4.t1 === TransactionMethod.BOND ? 19 : _context4.t1 === TransactionMethod.BOND_EXTRA_AMOUNT ? 20 : _context4.t1 === TransactionMethod.UNBOND_AMOUNT ? 21 : _context4.t1 === TransactionMethod.CHANGE_REWARDS_DESTINATION_ADDRESS ? 22 : _context4.t1 === TransactionMethod.TRANSFER_KEEP_ALIVE ? 23 : _context4.t1 === TransactionMethod.NOMINATE ? 24 : _context4.t1 === TransactionMethod.WITHDRAW_UNBONDED ? 25 : 26;
              break;

            case 18:
              return _context4.abrupt("return", this.offlineApi.tx.balances.transfer(tx.destination, tx.amount));

            case 19:
              return _context4.abrupt("return", this.offlineApi.tx.staking.bond(tx.controller, tx.amount, tx.rewardsDestination));

            case 20:
              return _context4.abrupt("return", this.offlineApi.tx.staking.bondExtra(tx.amount));

            case 21:
              return _context4.abrupt("return", this.offlineApi.tx.staking.unbond(tx.amount));

            case 22:
              return _context4.abrupt("return", this.offlineApi.tx.staking.setPayee(tx.rewardsDestination));

            case 23:
              return _context4.abrupt("return", this.offlineApi.tx.balances.transferKeepAlive(tx.destination, tx.amount));

            case 24:
              return _context4.abrupt("return", this.offlineApi.tx.staking.nominate(tx.validators));

            case 25:
              return _context4.abrupt("return", this.offlineApi.tx.staking.withdrawUnbonded(tx.numSlashingSpans));

            case 26:
              return _context4.abrupt("return", null);

            case 27:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[3, 11]]);
    }));

    function createSubmittableExtrinsic(_x9) {
      return _createSubmittableExtrinsic.apply(this, arguments);
    }

    return createSubmittableExtrinsic;
  }();

  _proto.getKeyring = function getKeyring() {
    var ss58Format = this.network === Network.MAINNET ? 0 : 42;
    return new Keyring({
      type: 'sr25519',
      ss58Format: ss58Format
    });
  };

  _proto.derivateFromPublic = function derivateFromPublic(masterPublicKey, cursor) {
    throw new Error('Method not implemented for polkadot!');
  };

  return Polkadot;
}(BitcoinBase);

var Binance = /*#__PURE__*/function (_Ethereum) {
  _inheritsLoose(Binance, _Ethereum);

  function Binance() {
    return _Ethereum.apply(this, arguments) || this;
  }

  var _proto = Binance.prototype;

  _proto.sign = /*#__PURE__*/function () {
    var _sign = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data, privateKey, isTx) {
      var privateKeyString, baseChain, chainId, hardfork, transactionObject, common, txRaw, pk, hash, sign;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (isTx === void 0) {
                isTx = true;
              }

              if (!isTx) {
                _context.next = 13;
                break;
              }

              privateKeyString = Object.values(JSON.parse(privateKey))[0].toString();
              baseChain = 'mainnet';
              chainId = 56;
              hardfork = 'london';

              if (this.net === Network.TESTNET) {
                baseChain = 'ropsten';
                chainId = 97;
                hardfork = 'petersburg';
              }

              transactionObject = JSON.parse(data);
              common = Common$1.forCustomChain(baseChain, {
                networkId: chainId,
                chainId: chainId
              }, hardfork);
              txRaw = new Transaction$1(transactionObject, {
                common: common
              });
              pk = Buffer.from(privateKeyString.replace('0x', ''), 'hex');
              txRaw.sign(pk);
              return _context.abrupt("return", "0x" + txRaw.serialize().toString('hex'));

            case 13:
              hash = hashPersonalMessage(Buffer.from(data));
              sign = ecsign(hash, Buffer.from(privateKey.replace('0x', ''), 'hex'));
              return _context.abrupt("return", JSON.stringify({
                r: sign.r.toString('hex'),
                s: sign.s.toString('hex'),
                v: sign.v
              }));

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function sign(_x, _x2, _x3) {
      return _sign.apply(this, arguments);
    }

    return sign;
  }();

  return Binance;
}(Ethereum);

var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var ALPHABET_MAP = {};

for (var i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[/*#__PURE__*/ALPHABET.charAt(i)] = i;
}

var BASE = 58;
var ADDRESS_SIZE = 34;
var ADDRESS_PREFIX = '41';
var ADDRESS_PREFIX_BYTE = 0x41;
var Tron = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Tron, _BitcoinBase);

  function Tron(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.TRX,
      network: Network.MAINNET,
      path: "m/44'/195'/0'",
      config: tron.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.TRX,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
      config: tron.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    _this.net = network;
    return _this;
  }

  var _proto = Tron.prototype;

  _proto.sign = /*#__PURE__*/function () {
    var _sign = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data, privateKey, isTx) {
      var privateKeyString, transaction, _privateKeyBytes, txID, signature, privateKeyBytes, bytes, hashBytes, signedBytes, signedString;

      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (isTx === void 0) {
                isTx = true;
              }

              if (!isTx) {
                _context.next = 9;
                break;
              }

              privateKeyString = Object.values(JSON.parse(privateKey))[0].toString();
              transaction = JSON.parse(data);
              _privateKeyBytes = this.hexStr2byteArray(privateKeyString);
              txID = transaction.txID;
              signature = this.ECKeySign(this.hexStr2byteArray(txID), _privateKeyBytes);

              if (Array.isArray(transaction.signature)) {
                if (!transaction.signature.includes(signature)) transaction.signature.push(signature);
              } else transaction.signature = [signature];

              return _context.abrupt("return", JSON.stringify(transaction));

            case 9:
              privateKeyBytes = this.hexStr2byteArray(privateKey);
              bytes = this.stringToBytes(data);
              hashBytes = this.SHA256(bytes);
              signedBytes = this.ECKeySign(hashBytes, privateKeyBytes);
              signedString = this.bytesToString(signedBytes);
              return _context.abrupt("return", signedString);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function sign(_x, _x2, _x3) {
      return _sign.apply(this, arguments);
    }

    return sign;
  }();

  _proto.ECKeySign = function ECKeySign(hashBytes, priKeyBytes) {
    var ec$1 = new ec('secp256k1');
    var key = ec$1.keyFromPrivate(priKeyBytes, 'bytes');
    var signature = key.sign(hashBytes);
    var r = signature.r;
    var s = signature.s;
    var id = signature.recoveryParam;
    var rHex = r.toString('hex');

    while (rHex.length < 64) {
      rHex = "0" + rHex;
    }

    var sHex = s.toString('hex');

    while (sHex.length < 64) {
      sHex = "0" + sHex;
    }

    var idHex = this.byte2hexStr(id);
    var signHex = rHex + sHex + idHex;
    return signHex;
  };

  _proto.getPrivateKey = function getPrivateKey(privateKey) {
    return privateKey.privateKey.toString('hex');
  };

  _proto.derivateFromPrivate = function derivateFromPrivate(masterPrivateKey, cursor) {
    var _this2 = this;

    var wallet = fromBase58(masterPrivateKey, this.networkConfig);
    var isAccount = false;

    if (wallet.parentFingerprint) {
      isAccount = true;
    }

    var indexes = getIndexes(cursor.skip, cursor.limit);
    var path = preparePath(this.getPath(cursor.path || '0/0', isAccount));
    return indexes.map(function (index) {
      var currentPath = path.replace('{index}', index.toString());
      var derived = wallet.derivePath(currentPath);

      var publicKey = _this2.getPubKeyFromPriKey(derived.privateKey);

      var address = _this2.computeAddress(_this2.hexStr2byteArray(publicKey));

      return {
        path: _this2.getPath(currentPath, false),
        address: _this2.getBase58CheckAddress(address),
        publicKey: publicKey,
        privateKey: _this2.getPrivateKey(derived)
      };
    });
  };

  _proto.derivateFromPublic = function derivateFromPublic(masterPublicKey, cursor) {
    var _this3 = this;

    var wallet = fromBase58(masterPublicKey, this.networkConfig);
    var isAccount = false;

    if (wallet.parentFingerprint) {
      isAccount = true;
    }

    var indexes = getIndexes(cursor.skip, cursor.limit);
    var path = preparePath(this.getPath(cursor.path || '0/0', isAccount));
    return indexes.map(function (index) {
      var currentPath = path.replace('{index}', index.toString());
      var pathParts = currentPath.replace(getHardenedPath(path), '').split('/').filter(function (part) {
        return part;
      }).map(function (part) {
        return parseInt(part);
      });

      var derived = _this3.deriveRecursive(wallet, pathParts);

      var publicKey = _this3.getTronPubKeyFromPubKey(derived.publicKey);

      var address = _this3.computeAddress(_this3.hexStr2byteArray(publicKey));

      return {
        path: _this3.getPath(currentPath, false),
        address: _this3.getBase58CheckAddress(address),
        publicKey: publicKey
      };
    });
  };

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey, isWIF) {

    var privateKeyBytes = this.hexStr2byteArray(privateKey);
    return this.getPubKeyFromPriKey(privateKeyBytes);
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey) {
    var addressBytes = this.computeAddress(this.hexStr2byteArray(publicKey));
    var address = this.getBase58CheckAddress(addressBytes);
    return address;
  };

  _proto.computeAddress = function computeAddress(pubBytes) {
    if (pubBytes.length === 65) pubBytes = pubBytes.slice(1);
    var hash = utils.keccak256(pubBytes).toString().substring(2);
    var addressHex = ADDRESS_PREFIX + hash.substring(24);
    return this.hexStr2byteArray(addressHex);
  };

  _proto.getTronPubKeyFromPubKey = function getTronPubKeyFromPubKey(PubKeyBytes) {
    var ec$1 = new ec('secp256k1');
    var key = ec$1.keyFromPublic(PubKeyBytes, 'bytes');
    var pubkey = key.getPublic();
    var x = pubkey.x;
    var y = pubkey.y;
    var xHex = x.toString('hex');

    while (xHex.length < 64) {
      xHex = "0" + xHex;
    }

    var yHex = y.toString('hex');

    while (yHex.length < 64) {
      yHex = "0" + yHex;
    }

    var pubkeyHex = "04" + xHex + yHex;
    return pubkeyHex;
  };

  _proto.isValidAddress = function isValidAddress(base58Str) {
    if (typeof base58Str !== 'string') return false;
    if (base58Str.length !== ADDRESS_SIZE) return false;
    var address = this.decode58(base58Str);
    if (address.length !== 25) return false;
    if (address[0] !== ADDRESS_PREFIX_BYTE) return false;
    var checkSum = address.slice(21);
    address = address.slice(0, 21);
    var hash0 = this.SHA256(address);
    var hash1 = this.SHA256(hash0);
    var checkSum1 = hash1.slice(0, 4);

    if (checkSum[0] == checkSum1[0] && checkSum[1] == checkSum1[1] && checkSum[2] == checkSum1[2] && checkSum[3] == checkSum1[3]) {
      return true;
    }

    return false;
  };

  _proto.getPubKeyFromPriKey = function getPubKeyFromPriKey(priKeyBytes) {
    var ec$1 = new ec('secp256k1');
    var key = ec$1.keyFromPrivate(priKeyBytes, 'bytes');
    var pubkey = key.getPublic();
    var x = pubkey.x;
    var y = pubkey.y;
    var xHex = x.toString('hex');

    while (xHex.length < 64) {
      xHex = "0" + xHex;
    }

    var yHex = y.toString('hex');

    while (yHex.length < 64) {
      yHex = "0" + yHex;
    }

    var pubkeyHex = "04" + xHex + yHex;
    return pubkeyHex;
  };

  _proto.decode58 = function decode58(string) {
    if (string.length === 0) return [];
    var i;
    var j;
    var bytes = [0];

    for (i = 0; i < string.length; i++) {
      var c = string[i];
      if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character');

      for (j = 0; j < bytes.length; j++) {
        bytes[j] *= BASE;
      }

      bytes[0] += ALPHABET_MAP[c];
      var carry = 0;

      for (j = 0; j < bytes.length; ++j) {
        bytes[j] += carry;
        carry = bytes[j] >> 8;
        bytes[j] &= 0xff;
      }

      while (carry) {
        bytes.push(carry & 0xff);
        carry >>= 8;
      }
    }

    for (i = 0; string[i] === '1' && i < string.length - 1; i++) {
      bytes.push(0);
    }

    return bytes.reverse();
  };

  _proto.encode58 = function encode58(buffer) {
    if (buffer.length === 0) return '';
    var i;
    var j;
    var digits = [0];

    for (i = 0; i < buffer.length; i++) {
      for (j = 0; j < digits.length; j++) {
        digits[j] <<= 8;
      }

      digits[0] += buffer[i];
      var carry = 0;

      for (j = 0; j < digits.length; ++j) {
        digits[j] += carry;
        carry = digits[j] / BASE | 0;
        digits[j] %= BASE;
      }

      while (carry) {
        digits.push(carry % BASE);
        carry = carry / BASE | 0;
      }
    }

    for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
      digits.push(0);
    }

    return digits.reverse().map(function (digit) {
      return ALPHABET[digit];
    }).join('');
  };

  _proto.SHA256 = function SHA256(msgBytes) {
    var msgHex = this.byteArray2hexStr(msgBytes);
    var hashHex = utils.sha256('0x' + msgHex).replace(/^0x/, '');
    return this.hexStr2byteArray(hashHex);
  };

  _proto.byteArray2hexStr = function byteArray2hexStr(byteArray) {
    var str = '';

    for (var _i = 0; _i < byteArray.length; _i++) {
      str += this.byte2hexStr(byteArray[_i]);
    }

    return str;
  };

  _proto.byte2hexStr = function byte2hexStr(_byte) {
    if (typeof _byte !== 'number') throw new Error('Input must be a number');
    if (_byte < 0 || _byte > 255) throw new Error('Input must be a byte');
    var hexByteMap = '0123456789ABCDEF';
    var str = '';
    str += hexByteMap.charAt(_byte >> 4);
    str += hexByteMap.charAt(_byte & 0x0f);
    return str;
  };

  _proto.getBase58CheckAddress = function getBase58CheckAddress(addressBytes) {
    var hash0 = this.SHA256(addressBytes);
    var hash1 = this.SHA256(hash0);
    var checkSum = hash1.slice(0, 4);
    checkSum = addressBytes.concat(checkSum);
    return this.encode58(checkSum);
  };

  _proto.hexStr2byteArray = function hexStr2byteArray(str, strict) {
    if (strict === void 0) {
      strict = false;
    }

    if (typeof str !== 'string') throw new Error('The passed string is not a string');
    var len = str.length;

    if (strict) {
      if (len % 2) {
        str = "0" + str;
        len++;
      }
    }

    var byteArray = [];
    var d = 0;
    var j = 0;
    var k = 0;

    for (var _i2 = 0; _i2 < len; _i2++) {
      var c = str.charAt(_i2);

      if (this.isHexChar(c)) {
        d <<= 4;
        d += this.hexChar2byte(c);
        j++;

        if (0 === j % 2) {
          byteArray[k++] = d;
          d = 0;
        }
      } else throw new Error('The passed hex char is not a valid hex string');
    }

    return byteArray;
  };

  _proto.isHexChar = function isHexChar(c) {
    if (c >= 'A' && c <= 'F' || c >= 'a' && c <= 'f' || c >= '0' && c <= '9') {
      return 1;
    }

    return 0;
  };

  _proto.hexChar2byte = function hexChar2byte(c) {
    var d;
    if (c >= 'A' && c <= 'F') d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;else if (c >= 'a' && c <= 'f') d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;else if (c >= '0' && c <= '9') d = c.charCodeAt(0) - '0'.charCodeAt(0);
    if (typeof d === 'number') return d;else throw new Error('The passed hex char is not a valid hex char');
  };

  _proto.stringToBytes = function stringToBytes(str) {
    if (typeof str !== 'string') throw new Error('The passed string is not a string');
    var bytes = [];
    var c;

    for (var _i3 = 0; _i3 < str.length; _i3++) {
      c = str.charCodeAt(_i3);

      if (c >= 0x010000 && c <= 0x10ffff) {
        bytes.push(c >> 18 & 0x07 | 0xf0);
        bytes.push(c >> 12 & 0x3f | 0x80);
        bytes.push(c >> 6 & 0x3f | 0x80);
        bytes.push(c & 0x3f | 0x80);
      } else if (c >= 0x000800 && c <= 0x00ffff) {
        bytes.push(c >> 12 & 0x0f | 0xe0);
        bytes.push(c >> 6 & 0x3f | 0x80);
        bytes.push(c & 0x3f | 0x80);
      } else if (c >= 0x000080 && c <= 0x0007ff) {
        bytes.push(c >> 6 & 0x1f | 0xc0);
        bytes.push(c & 0x3f | 0x80);
      } else bytes.push(c & 0xff);
    }

    return bytes;
  };

  _proto.bytesToString = function bytesToString(arr) {
    if (typeof arr === 'string') return arr;
    var str = '';

    for (var _i4 = 0; _i4 < arr.length; _i4++) {
      var one = arr[_i4].toString(2);

      var v = one.match(/^1+?(?=0)/);

      if (v && one.length === 8) {
        var bytesLength = v[0].length;

        var store = arr[_i4].toString(2).slice(7 - bytesLength);

        for (var st = 1; st < bytesLength; st++) {
          store += arr[st + _i4].toString(2).slice(2);
        }

        str += String.fromCharCode(parseInt(store, 2));
        _i4 += bytesLength - 1;
      } else {
        str += String.fromCharCode(arr[_i4]);
      }
    }

    return str;
  };

  return Tron;
}(BitcoinBase);

var blockchainLibs = {
  bitcoin: Bitcoin,
  litecoin: Litecoin,
  binance_smart_chain: Binance,
  ethereum: Ethereum,
  eos: EOS,
  ripple: Ripple,
  dogecoin: Dogecoin,
  dashcoin: Dashcoin,
  polkadot: Polkadot,
  tron: Tron
};
var Keys = /*#__PURE__*/function () {
  function Keys(blockchain, network) {
    this.blockchain = blockchain;

    if (blockchainLibs[blockchain]) {
      this.lib = new blockchainLibs[blockchain](network);
    } else {
      throw new Error("Blockchain " + blockchain + " not implemented yet!");
    }
  }

  var _proto = Keys.prototype;

  _proto.getMasterFromSeed = /*#__PURE__*/function () {
    var _getMasterFromSeed = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(seedPhrase, path, password) {
      var seed, keys;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              seed = mnemonicToSeedHex(seedPhrase, password, this.blockchain);
              _context.next = 3;
              return this.lib.getMasterAddressFromSeed(seed, path);

            case 3:
              keys = _context.sent;
              return _context.abrupt("return", _extends({
                seedPhrase: seedPhrase,
                seed: seed
              }, keys));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getMasterFromSeed(_x, _x2, _x3) {
      return _getMasterFromSeed.apply(this, arguments);
    }

    return getMasterFromSeed;
  }();

  _proto.isSeed = function isSeed(from) {
    return from.seedPhrase !== undefined;
  };

  _proto.isMasterPrivate = function isMasterPrivate(from) {
    return from.masterPrivateKey !== undefined;
  };

  _proto.generateSeedPhrase = /*#__PURE__*/function () {
    var _generateSeedPhrase = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(wordCount, lang, path, password) {
      var seedPhrase;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (lang === void 0) {
                lang = SeedDictionaryLang.ENGLISH;
              }

              seedPhrase = generateMnemonic(wordCount, lang);
              return _context2.abrupt("return", this.getMasterFromSeed(seedPhrase, path, password));

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function generateSeedPhrase(_x4, _x5, _x6, _x7) {
      return _generateSeedPhrase.apply(this, arguments);
    }

    return generateSeedPhrase;
  }();

  _proto.getDataFromSeed = /*#__PURE__*/function () {
    var _getDataFromSeed = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(seedPhrase, path, password) {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", this.getMasterFromSeed(seedPhrase, path, password));

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function getDataFromSeed(_x8, _x9, _x10) {
      return _getDataFromSeed.apply(this, arguments);
    }

    return getDataFromSeed;
  }();

  _proto.derivateKeys = /*#__PURE__*/function () {
    var _derivateKeys = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(from, pathCursor) {
      var seedData;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!this.isSeed(from)) {
                _context4.next = 13;
                break;
              }

              _context4.next = 3;
              return this.getMasterFromSeed(from.seedPhrase, from.password);

            case 3:
              seedData = _context4.sent;

              if (!(pathCursor.path && pathCursor.path.indexOf('m') !== -1)) {
                _context4.next = 9;
                break;
              }

              console.log('From seed from full path');
              return _context4.abrupt("return", this.lib.derivateFromPrivate(seedData.masterPrivateKey, pathCursor));

            case 9:
              console.log('From seed from short path');
              return _context4.abrupt("return", this.lib.derivateFromPrivate(seedData.masterAccountPrivateKey, pathCursor));

            case 11:
              _context4.next = 18;
              break;

            case 13:
              if (!this.isMasterPrivate(from)) {
                _context4.next = 17;
                break;
              }

              return _context4.abrupt("return", this.lib.derivateFromPrivate(from.masterPrivateKey, pathCursor));

            case 17:
              return _context4.abrupt("return", this.lib.derivateFromPublic(from.masterPublicKey, pathCursor));

            case 18:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function derivateKeys(_x11, _x12) {
      return _derivateKeys.apply(this, arguments);
    }

    return derivateKeys;
  }();

  _proto.sign = /*#__PURE__*/function () {
    var _sign = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(data, privateKey, isTx, addMessagePrefix) {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (isTx === void 0) {
                isTx = true;
              }

              if (addMessagePrefix === void 0) {
                addMessagePrefix = true;
              }

              _context5.next = 4;
              return this.lib.sign(data, privateKey, isTx, addMessagePrefix);

            case 4:
              return _context5.abrupt("return", _context5.sent);

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function sign(_x13, _x14, _x15, _x16) {
      return _sign.apply(this, arguments);
    }

    return sign;
  }();

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey) {
    return this.lib.getPublicFromPrivate(privateKey);
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey, format) {
    return this.lib.getAddressFromPublic(publicKey, format);
  };

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    return this.lib.checkSign(publicKey, data, sign);
  };

  _proto.checkSeedPhrase = function checkSeedPhrase(seedPhrase) {
    return validateMnemonic(seedPhrase);
  };

  _proto.getDefaultPaths = function getDefaultPaths() {
    return this.lib.getPaths();
  };

  _proto.isValidAddress = function isValidAddress(address, format) {
    return this.lib.isValidAddress(address, format);
  };

  _proto.getFormat = function getFormat(address) {
    return this.lib.getFormat(address);
  };

  Keys.decrypt = /*#__PURE__*/function () {
    var _decrypt = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(encryptedData, password) {
      var sodium, hashedPassword, key, nonce, ciphertext, decrypted;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return SodiumPlus.auto();

            case 2:
              sodium = _context6.sent;
              hashedPassword = createHash('sha256').update(password).digest('hex');
              key = CryptographyKey.from(hashedPassword, 'hex');
              nonce = Buffer.from(encryptedData.substring(0, 48), 'hex');
              ciphertext = Buffer.from(encryptedData.substring(48), 'hex');
              _context6.next = 9;
              return sodium.crypto_secretbox_open(ciphertext, nonce, key);

            case 9:
              decrypted = _context6.sent;
              return _context6.abrupt("return", decrypted.toString('utf-8'));

            case 11:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    function decrypt(_x17, _x18) {
      return _decrypt.apply(this, arguments);
    }

    return decrypt;
  }();

  Keys.encrypt = /*#__PURE__*/function () {
    var _encrypt = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data, password) {
      var sodium, hashedPassword, key, nonce, ciphertext, encryptedData;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return SodiumPlus.auto();

            case 2:
              sodium = _context7.sent;
              hashedPassword = createHash('sha256').update(password).digest('hex');
              key = CryptographyKey.from(hashedPassword, 'hex');
              _context7.next = 7;
              return sodium.randombytes_buf(24);

            case 7:
              nonce = _context7.sent;
              _context7.next = 10;
              return sodium.crypto_secretbox(data, nonce, key);

            case 10:
              ciphertext = _context7.sent;
              encryptedData = nonce.toString('hex') + ciphertext.toString('hex');
              return _context7.abrupt("return", encryptedData);

            case 13:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    function encrypt(_x19, _x20) {
      return _encrypt.apply(this, arguments);
    }

    return encrypt;
  }();

  return Keys;
}();

export { Blockchain, Keys, Network, SeedDictionaryLang, TransactionMethod };
//# sourceMappingURL=crypto-api-keys-lib.esm.js.map
