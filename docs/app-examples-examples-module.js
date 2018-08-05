(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app-examples-examples-module"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/examples/theming/parent/parent.component.scss-theme.scss":
/*!****************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/examples/theming/parent/parent.component.scss-theme.scss ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@import '~@angular/material/theming';\n\n@mixin anms-parent-component-theme($theme) {\n  $accent: map-get($theme, accent);\n\n  anms-parent {\n    > .container {\n      > .row {\n        > .col-md-6 {\n          > .example {\n            border-color: mat-color($accent);\n\n            > h1 {\n              color: mat-color($accent);\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"

/***/ }),

/***/ "./node_modules/uuid/index.js":
/*!************************************!*\
  !*** ./node_modules/uuid/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var v1 = __webpack_require__(/*! ./v1 */ "./node_modules/uuid/v1.js");
var v4 = __webpack_require__(/*! ./v4 */ "./node_modules/uuid/v4.js");

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),

/***/ "./node_modules/uuid/lib/rng-browser.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/rng-browser.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && msCrypto.getRandomValues.bind(msCrypto));
if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),

/***/ "./node_modules/uuid/v1.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v1.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ "./src/app/examples/authenticated/authenticated.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/examples/authenticated/authenticated.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-12\">\n      <h1 class=\"main-heading\">{{ 'anms.examples.auth.title' | translate }}</h1>\n      <p>\n        {{ 'anms.examples.auth.description1' | translate }}\n      </p>\n      <p>\n        {{ 'anms.examples.auth.description2' | translate }}\n      </p>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/examples/authenticated/authenticated.component.scss":
/*!*********************************************************************!*\
  !*** ./src/app/examples/authenticated/authenticated.component.scss ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/examples/authenticated/authenticated.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/examples/authenticated/authenticated.component.ts ***!
  \*******************************************************************/
/*! exports provided: AuthenticatedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthenticatedComponent", function() { return AuthenticatedComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AuthenticatedComponent = /** @class */ (function () {
    function AuthenticatedComponent() {
    }
    AuthenticatedComponent.prototype.ngOnInit = function () { };
    AuthenticatedComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-authenticated',
            template: __webpack_require__(/*! ./authenticated.component.html */ "./src/app/examples/authenticated/authenticated.component.html"),
            styles: [__webpack_require__(/*! ./authenticated.component.scss */ "./src/app/examples/authenticated/authenticated.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], AuthenticatedComponent);
    return AuthenticatedComponent;
}());



/***/ }),

/***/ "./src/app/examples/examples-routing.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/examples/examples-routing.module.ts ***!
  \*****************************************************/
/*! exports provided: ExamplesRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExamplesRoutingModule", function() { return ExamplesRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _app_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/core */ "./src/app/core/index.ts");
/* harmony import */ var _examples_examples_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./examples/examples.component */ "./src/app/examples/examples/examples.component.ts");
/* harmony import */ var _todos_todos_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./todos/todos.component */ "./src/app/examples/todos/todos.component.ts");
/* harmony import */ var _stock_market_stock_market_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./stock-market/stock-market.component */ "./src/app/examples/stock-market/stock-market.component.ts");
/* harmony import */ var _theming_parent_parent_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./theming/parent/parent.component */ "./src/app/examples/theming/parent/parent.component.ts");
/* harmony import */ var _authenticated_authenticated_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./authenticated/authenticated.component */ "./src/app/examples/authenticated/authenticated.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var routes = [
    {
        path: '',
        component: _examples_examples_component__WEBPACK_IMPORTED_MODULE_3__["ExamplesComponent"],
        children: [
            {
                path: '',
                redirectTo: 'todos',
                pathMatch: 'full'
            },
            {
                path: 'todos',
                component: _todos_todos_component__WEBPACK_IMPORTED_MODULE_4__["TodosComponent"],
                data: { title: 'anms.examples.menu.todos' }
            },
            {
                path: 'stock-market',
                component: _stock_market_stock_market_component__WEBPACK_IMPORTED_MODULE_5__["StockMarketComponent"],
                data: { title: 'anms.examples.menu.stocks' }
            },
            {
                path: 'theming',
                component: _theming_parent_parent_component__WEBPACK_IMPORTED_MODULE_6__["ParentComponent"],
                data: { title: 'anms.examples.menu.theming' }
            },
            {
                path: 'authenticated',
                component: _authenticated_authenticated_component__WEBPACK_IMPORTED_MODULE_7__["AuthenticatedComponent"],
                canActivate: [_app_core__WEBPACK_IMPORTED_MODULE_2__["AuthGuardService"]],
                data: { title: 'anms.examples.menu.auth' }
            }
        ]
    }
];
var ExamplesRoutingModule = /** @class */ (function () {
    function ExamplesRoutingModule() {
    }
    ExamplesRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], ExamplesRoutingModule);
    return ExamplesRoutingModule;
}());



/***/ }),

/***/ "./src/app/examples/examples.module.ts":
/*!*********************************************!*\
  !*** ./src/app/examples/examples.module.ts ***!
  \*********************************************/
/*! exports provided: ExamplesModule, HttpLoaderFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExamplesModule", function() { return ExamplesModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpLoaderFactory", function() { return HttpLoaderFactory; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/http-loader */ "./node_modules/@ngx-translate/http-loader/esm5/ngx-translate-http-loader.js");
/* harmony import */ var _app_shared__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @app/shared */ "./src/app/shared/index.ts");
/* harmony import */ var _examples_routing_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./examples-routing.module */ "./src/app/examples/examples-routing.module.ts");
/* harmony import */ var _examples_examples_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./examples/examples.component */ "./src/app/examples/examples/examples.component.ts");
/* harmony import */ var _todos_todos_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./todos/todos.component */ "./src/app/examples/todos/todos.component.ts");
/* harmony import */ var _todos_todos_reducer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./todos/todos.reducer */ "./src/app/examples/todos/todos.reducer.ts");
/* harmony import */ var _todos_todos_effects__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./todos/todos.effects */ "./src/app/examples/todos/todos.effects.ts");
/* harmony import */ var _stock_market_stock_market_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./stock-market/stock-market.component */ "./src/app/examples/stock-market/stock-market.component.ts");
/* harmony import */ var _stock_market_stock_market_reducer__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./stock-market/stock-market.reducer */ "./src/app/examples/stock-market/stock-market.reducer.ts");
/* harmony import */ var _stock_market_stock_market_effects__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./stock-market/stock-market.effects */ "./src/app/examples/stock-market/stock-market.effects.ts");
/* harmony import */ var _stock_market_stock_market_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./stock-market/stock-market.service */ "./src/app/examples/stock-market/stock-market.service.ts");
/* harmony import */ var _theming_parent_parent_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./theming/parent/parent.component */ "./src/app/examples/theming/parent/parent.component.ts");
/* harmony import */ var _theming_child_child_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./theming/child/child.component */ "./src/app/examples/theming/child/child.component.ts");
/* harmony import */ var _authenticated_authenticated_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./authenticated/authenticated.component */ "./src/app/examples/authenticated/authenticated.component.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _env_environment__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @env/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




















var ExamplesModule = /** @class */ (function () {
    function ExamplesModule() {
    }
    ExamplesModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _app_shared__WEBPACK_IMPORTED_MODULE_5__["SharedModule"],
                _examples_routing_module__WEBPACK_IMPORTED_MODULE_6__["ExamplesRoutingModule"],
                _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["StoreModule"].forFeature('examples', {
                    todos: _todos_todos_reducer__WEBPACK_IMPORTED_MODULE_9__["todosReducer"],
                    stocks: _stock_market_stock_market_reducer__WEBPACK_IMPORTED_MODULE_12__["stockMarketReducer"]
                }),
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__["TranslateModule"].forChild({
                    loader: {
                        provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__["TranslateLoader"],
                        useFactory: HttpLoaderFactory,
                        deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_18__["HttpClient"]]
                    },
                    isolate: true
                }),
                _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["EffectsModule"].forFeature([_todos_todos_effects__WEBPACK_IMPORTED_MODULE_10__["TodosEffects"], _stock_market_stock_market_effects__WEBPACK_IMPORTED_MODULE_13__["StockMarketEffects"]])
            ],
            declarations: [
                _examples_examples_component__WEBPACK_IMPORTED_MODULE_7__["ExamplesComponent"],
                _todos_todos_component__WEBPACK_IMPORTED_MODULE_8__["TodosComponent"],
                _stock_market_stock_market_component__WEBPACK_IMPORTED_MODULE_11__["StockMarketComponent"],
                _theming_parent_parent_component__WEBPACK_IMPORTED_MODULE_15__["ParentComponent"],
                _theming_child_child_component__WEBPACK_IMPORTED_MODULE_16__["ChildComponent"],
                _authenticated_authenticated_component__WEBPACK_IMPORTED_MODULE_17__["AuthenticatedComponent"]
            ],
            providers: [_stock_market_stock_market_service__WEBPACK_IMPORTED_MODULE_14__["StockMarketService"]]
        }),
        __metadata("design:paramtypes", [])
    ], ExamplesModule);
    return ExamplesModule;
}());

function HttpLoaderFactory(http) {
    return new _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_4__["TranslateHttpLoader"](http, _env_environment__WEBPACK_IMPORTED_MODULE_19__["environment"].i18nPrefix + "/assets/i18n/examples/", '.json');
}


/***/ }),

/***/ "./src/app/examples/examples/examples.component.html":
/*!***********************************************************!*\
  !*** ./src/app/examples/examples/examples.component.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<nav mat-tab-nav-bar >\n  <a mat-tab-link\n     *ngFor=\"let e of examples\"\n     [routerLink]=\"e.link\"\n     routerLinkActive #rla=\"routerLinkActive\"\n     [active]=\"rla.isActive\">\n    {{e.label | translate}}\n  </a>\n</nav>\n\n<div [@routeAnimations]=\"o.isActivated && o.activatedRoute.routeConfig.path\">\n  <router-outlet #o=\"outlet\"></router-outlet>\n</div>\n"

/***/ }),

/***/ "./src/app/examples/examples/examples.component.scss":
/*!***********************************************************!*\
  !*** ./src/app/examples/examples/examples.component.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "nav {\n  margin-bottom: 20px;\n  position: relative; }\n  nav .mat-tab-link {\n    min-width: 130px; }\n  @media (max-width: 576px) {\n    nav .mat-tab-link {\n      min-width: 0;\n      padding: 0 15px; } }\n"

/***/ }),

/***/ "./src/app/examples/examples/examples.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/examples/examples/examples.component.ts ***!
  \*********************************************************/
/*! exports provided: ExamplesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExamplesComponent", function() { return ExamplesComponent; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _app_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @app/core */ "./src/app/core/index.ts");
/* harmony import */ var _app_settings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @app/settings */ "./src/app/settings/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ExamplesComponent = /** @class */ (function () {
    function ExamplesComponent(store, router, titleService, translate) {
        this.store = store;
        this.router = router;
        this.titleService = titleService;
        this.translate = translate;
        this.unsubscribe$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__["Subject"]();
        this.examples = [
            { link: 'todos', label: 'anms.examples.menu.todos' },
            { link: 'stock-market', label: 'anms.examples.menu.stocks' },
            { link: 'theming', label: 'anms.examples.menu.theming' },
            { link: 'authenticated', label: 'anms.examples.menu.auth' }
        ];
    }
    ExamplesComponent.prototype.ngOnInit = function () {
        this.translate.setDefaultLang('en');
        this.subscribeToSettings();
        this.subscribeToRouterEvents();
    };
    ExamplesComponent.prototype.ngOnDestroy = function () {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    };
    ExamplesComponent.prototype.subscribeToSettings = function () {
        var _this = this;
        this.store
            .select(_app_settings__WEBPACK_IMPORTED_MODULE_7__["selectorSettings"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.unsubscribe$))
            .subscribe(function (settings) {
            return _this.translate.use(settings.language);
        });
    };
    ExamplesComponent.prototype.subscribeToRouterEvents = function () {
        var _this = this;
        this.titleService.setTitle(this.router.routerState.snapshot.root, this.translate);
        this.router.events
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["filter"])(function (event) { return event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivationEnd"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (event) { return event.snapshot; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.unsubscribe$))
            .subscribe(function (snapshot) {
            return _this.titleService.setTitle(snapshot, _this.translate);
        });
    };
    ExamplesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'anms-examples',
            template: __webpack_require__(/*! ./examples.component.html */ "./src/app/examples/examples/examples.component.html"),
            styles: [__webpack_require__(/*! ./examples.component.scss */ "./src/app/examples/examples/examples.component.scss")],
            animations: [_app_core__WEBPACK_IMPORTED_MODULE_6__["routeAnimations"]]
        }),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["Store"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _app_core__WEBPACK_IMPORTED_MODULE_6__["TitleService"],
            _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__["TranslateService"]])
    ], ExamplesComponent);
    return ExamplesComponent;
}());



/***/ }),

/***/ "./src/app/examples/stock-market/stock-market.component.html":
/*!*******************************************************************!*\
  !*** ./src/app/examples/stock-market/stock-market.component.html ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h1 class=\"main-heading\">{{ 'anms.examples.stocks.title' | translate }}</h1>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-6 col-lg-3\">\n      <form autocomplete=\"false\">\n        <mat-form-field>\n          <input matInput [placeholder]=\"'anms.examples.stocks.symbol' | translate\"\n                 [value]=\"stocks.symbol\"\n                 (keyup)=\"onSymbolChange($event.target.value)\">\n        </mat-form-field>\n      </form>\n      <p>\n        {{ 'anms.examples.stocks.description' | translate }} GOOGL, FB, AAPL, NVDA, AMZN,\n        TWTR, SNAP, TSLA...\n      </p>\n      <br>\n      <mat-slider vertical></mat-slider>\n    </div>\n    <div class=\"col-md-6 col-lg-4 offset-lg-1\">\n      <mat-spinner *ngIf=\"stocks.loading\"></mat-spinner>\n      <mat-card *ngIf=\"stocks.stock\">\n        <mat-card-title>{{stocks.stock.symbol}} <span>{{stocks.stock.last}} {{stocks.stock.ccy}}</span></mat-card-title>\n        <mat-card-subtitle>\n          <p [ngClass]=\"{ negative: stocks.stock.changeNegative }\">\n            <mat-icon fontSet=\"fas\" fontIcon=\"fa-caret-up\"\n                      *ngIf=\"stocks.stock.changePositive\"></mat-icon>\n            <mat-icon fontSet=\"fas\" fontIcon=\"fa-caret-down\"\n                      *ngIf=\"stocks.stock.changeNegative\"></mat-icon>\n            {{stocks.stock.change}} ({{stocks.stock.changePercent}})\n          </p>\n        </mat-card-subtitle>\n        <mat-card-content>{{stocks.stock.exchange}}</mat-card-content>\n      </mat-card>\n      <p *ngIf=\"stocks.error\" class=\"error\">\n        <mat-icon fontSet=\"fas\" fontIcon=\"fa-exclamation-triangle\"></mat-icon>\n        <br><br>\n        <span>\n          {{ 'anms.examples.stocks.error1' | translate }}\n          <span class=\"symbol\">{{stocks.symbol}}</span>\n          {{ 'anms.examples.stocks.error2' | translate }}\n        </span>\n      </p>\n      <br>\n      <br>\n    </div>\n    <div class=\"col-md-12 col-lg-4\">\n      <p>\n        {{ 'anms.examples.stocks.text1' | translate }} <code>HTTP</code>\n        {{ 'anms.examples.stocks.text2' | translate }} <code>@ngrx/effects</code>\n        {{ 'anms.examples.stocks.text3' | translate }}\n      </p>\n      <p>{{ 'anms.examples.stocks.text4' | translate }}</p>\n      <p>\n        {{ 'anms.examples.stocks.text5' | translate }} <code>.switchMap</code>.\n      </p>\n      <p>{{ 'anms.examples.stocks.text6' | translate }}</p>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/examples/stock-market/stock-market.component.scss":
/*!*******************************************************************!*\
  !*** ./src/app/examples/stock-market/stock-market.component.scss ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".main-heading {\n  text-transform: uppercase;\n  margin: 0 0 20px 0; }\n\nmat-form-field {\n  width: 100%; }\n\nmat-card span {\n  float: right; }\n\nmat-card mat-card-title {\n  margin-bottom: 5px; }\n\nmat-card mat-card-subtitle {\n  text-align: right; }\n\nmat-card mat-card-subtitle mat-icon {\n    width: 8px; }\n\nmat-card mat-card-content {\n  text-align: center; }\n\nmat-spinner {\n  margin: auto; }\n\n.error {\n  text-align: center;\n  padding: 20px; }\n\n.error mat-icon {\n    width: 54px;\n    font-size: 48px; }\n\n.error > span {\n    opacity: 0.4; }\n\n.error .symbol {\n    font-weight: bold; }\n"

/***/ }),

/***/ "./src/app/examples/stock-market/stock-market.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/examples/stock-market/stock-market.component.ts ***!
  \*****************************************************************/
/*! exports provided: StockMarketComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockMarketComponent", function() { return StockMarketComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _stock_market_reducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./stock-market.reducer */ "./src/app/examples/stock-market/stock-market.reducer.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var StockMarketComponent = /** @class */ (function () {
    function StockMarketComponent(store) {
        this.store = store;
        this.unsubscribe$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
    }
    StockMarketComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.initialized = false;
        this.store
            .select(_stock_market_reducer__WEBPACK_IMPORTED_MODULE_4__["selectorStocks"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.unsubscribe$))
            .subscribe(function (stocks) {
            _this.stocks = stocks;
            if (!_this.initialized) {
                _this.initialized = true;
                _this.store.dispatch(new _stock_market_reducer__WEBPACK_IMPORTED_MODULE_4__["ActionStockMarketRetrieve"]({ symbol: stocks.symbol }));
            }
        });
    };
    StockMarketComponent.prototype.ngOnDestroy = function () {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    };
    StockMarketComponent.prototype.onSymbolChange = function (symbol) {
        this.store.dispatch(new _stock_market_reducer__WEBPACK_IMPORTED_MODULE_4__["ActionStockMarketRetrieve"]({ symbol: symbol }));
    };
    StockMarketComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-stock-market',
            template: __webpack_require__(/*! ./stock-market.component.html */ "./src/app/examples/stock-market/stock-market.component.html"),
            styles: [__webpack_require__(/*! ./stock-market.component.scss */ "./src/app/examples/stock-market/stock-market.component.scss")]
        }),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]])
    ], StockMarketComponent);
    return StockMarketComponent;
}());



/***/ }),

/***/ "./src/app/examples/stock-market/stock-market.effects.ts":
/*!***************************************************************!*\
  !*** ./src/app/examples/stock-market/stock-market.effects.ts ***!
  \***************************************************************/
/*! exports provided: StockMarketEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockMarketEffects", function() { return StockMarketEffects; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _app_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @app/core */ "./src/app/core/index.ts");
/* harmony import */ var _stock_market_reducer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./stock-market.reducer */ "./src/app/examples/stock-market/stock-market.reducer.ts");
/* harmony import */ var _stock_market_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./stock-market.service */ "./src/app/examples/stock-market/stock-market.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var StockMarketEffects = /** @class */ (function () {
    function StockMarketEffects(actions$, localStorageService, service) {
        this.actions$ = actions$;
        this.localStorageService = localStorageService;
        this.service = service;
    }
    StockMarketEffects.prototype.retrieveStock = function () {
        var _this = this;
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_stock_market_reducer__WEBPACK_IMPORTED_MODULE_5__["StockMarketActionTypes"].RETRIEVE), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (action) {
            return _this.localStorageService.setItem(_stock_market_reducer__WEBPACK_IMPORTED_MODULE_5__["STOCK_MARKET_KEY"], {
                symbol: action.payload.symbol
            });
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["debounceTime"])(500), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (action) {
            return _this.service
                .retrieveStock(action.payload.symbol)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (stock) { return new _stock_market_reducer__WEBPACK_IMPORTED_MODULE_5__["ActionStockMarketRetrieveSuccess"]({ stock: stock }); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function (error) {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(new _stock_market_reducer__WEBPACK_IMPORTED_MODULE_5__["ActionStockMarketRetrieveError"]({ error: error }));
            }));
        }));
    };
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], StockMarketEffects.prototype, "retrieveStock", null);
    StockMarketEffects = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"],
            _app_core__WEBPACK_IMPORTED_MODULE_4__["LocalStorageService"],
            _stock_market_service__WEBPACK_IMPORTED_MODULE_6__["StockMarketService"]])
    ], StockMarketEffects);
    return StockMarketEffects;
}());



/***/ }),

/***/ "./src/app/examples/stock-market/stock-market.reducer.ts":
/*!***************************************************************!*\
  !*** ./src/app/examples/stock-market/stock-market.reducer.ts ***!
  \***************************************************************/
/*! exports provided: STOCK_MARKET_KEY, StockMarketActionTypes, ActionStockMarketRetrieve, ActionStockMarketRetrieveSuccess, ActionStockMarketRetrieveError, initialState, selectorStocks, stockMarketReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STOCK_MARKET_KEY", function() { return STOCK_MARKET_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockMarketActionTypes", function() { return StockMarketActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionStockMarketRetrieve", function() { return ActionStockMarketRetrieve; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionStockMarketRetrieveSuccess", function() { return ActionStockMarketRetrieveSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionStockMarketRetrieveError", function() { return ActionStockMarketRetrieveError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialState", function() { return initialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectorStocks", function() { return selectorStocks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stockMarketReducer", function() { return stockMarketReducer; });
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var STOCK_MARKET_KEY = 'EXAMPLES.STOCKS';
var StockMarketActionTypes;
(function (StockMarketActionTypes) {
    StockMarketActionTypes["RETRIEVE"] = "[Todos] Retrieve";
    StockMarketActionTypes["RETRIEVE_SUCCESS"] = "[Todos] Retrieve Success";
    StockMarketActionTypes["RETRIEVE_ERROR"] = "[Todos] Retrieve Error";
})(StockMarketActionTypes || (StockMarketActionTypes = {}));
var ActionStockMarketRetrieve = /** @class */ (function () {
    function ActionStockMarketRetrieve(payload) {
        this.payload = payload;
        this.type = StockMarketActionTypes.RETRIEVE;
    }
    return ActionStockMarketRetrieve;
}());

var ActionStockMarketRetrieveSuccess = /** @class */ (function () {
    function ActionStockMarketRetrieveSuccess(payload) {
        this.payload = payload;
        this.type = StockMarketActionTypes.RETRIEVE_SUCCESS;
    }
    return ActionStockMarketRetrieveSuccess;
}());

var ActionStockMarketRetrieveError = /** @class */ (function () {
    function ActionStockMarketRetrieveError(payload) {
        this.payload = payload;
        this.type = StockMarketActionTypes.RETRIEVE_ERROR;
    }
    return ActionStockMarketRetrieveError;
}());

var initialState = {
    symbol: 'GOOGL',
    loading: false
};
var selectorStocks = function (state) { return state.examples.stocks; };
function stockMarketReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case StockMarketActionTypes.RETRIEVE:
            return __assign({}, state, { loading: true, stock: null, error: null, symbol: action.payload.symbol });
        case StockMarketActionTypes.RETRIEVE_SUCCESS:
            return __assign({}, state, { loading: false, stock: action.payload.stock, error: null });
        case StockMarketActionTypes.RETRIEVE_ERROR:
            return __assign({}, state, { loading: false, stock: null, error: action.payload.error });
        default:
            return state;
    }
}


/***/ }),

/***/ "./src/app/examples/stock-market/stock-market.service.ts":
/*!***************************************************************!*\
  !*** ./src/app/examples/stock-market/stock-market.service.ts ***!
  \***************************************************************/
/*! exports provided: StockMarketService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockMarketService", function() { return StockMarketService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
var StockMarketService = /** @class */ (function () {
    function StockMarketService(httpClient) {
        this.httpClient = httpClient;
    }
    StockMarketService.prototype.retrieveStock = function (symbol) {
        return this.httpClient
            .get(PROXY_URL + ("https://api.iextrading.com/1.0/stock/" + symbol + "/quote"))
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (stock) { return ({
            symbol: stock.symbol,
            exchange: stock.primaryExchange,
            last: stock.latestPrice,
            ccy: 'USD',
            change: stock.close,
            changePositive: stock.change.toString().indexOf('+') === 0,
            changeNegative: stock.change.toString().indexOf('-') === 0,
            changePercent: stock.changePercent.toFixed(2)
        }); }));
    };
    StockMarketService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], StockMarketService);
    return StockMarketService;
}());



/***/ }),

/***/ "./src/app/examples/theming/child/child.component.html":
/*!*************************************************************!*\
  !*** ./src/app/examples/theming/child/child.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n  <h1>\n    {{ 'anms.examples.theming.child.title' | translate }}\n    <br>{{ 'anms.examples.theming.child.subtitle' | translate }}\n  </h1>\n  <h2>{{ 'anms.examples.theming.child.description' | translate }}</h2>\n</div>\n"

/***/ }),

/***/ "./src/app/examples/theming/child/child.component.scss":
/*!*************************************************************!*\
  !*** ./src/app/examples/theming/child/child.component.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "div {\n  border: 1px solid;\n  padding: 20px; }\n"

/***/ }),

/***/ "./src/app/examples/theming/child/child.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/examples/theming/child/child.component.ts ***!
  \***********************************************************/
/*! exports provided: ChildComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChildComponent", function() { return ChildComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ChildComponent = /** @class */ (function () {
    function ChildComponent() {
    }
    ChildComponent.prototype.ngOnInit = function () { };
    ChildComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-child',
            template: __webpack_require__(/*! ./child.component.html */ "./src/app/examples/theming/child/child.component.html"),
            styles: [__webpack_require__(/*! ./child.component.scss */ "./src/app/examples/theming/child/child.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ChildComponent);
    return ChildComponent;
}());



/***/ }),

/***/ "./src/app/examples/theming/parent/parent.component.html":
/*!***************************************************************!*\
  !*** ./src/app/examples/theming/parent/parent.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-12\">\n      <h1 class=\"main-heading\">{{ 'anms.examples.theming.parent.title' | translate }}</h1>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <p>\n        {{ 'anms.examples.theming.parent.text1' | translate }} <code>stylesUrls</code>\n        {{ 'anms.examples.theming.parent.text2' | translate }} <code>@Component</code>\n        {{ 'anms.examples.theming.parent.text3' | translate }} <code>styles.scss</code>\n        {{ 'anms.examples.theming.parent.text4' | translate }}\n        <strong>{{ 'anms.examples.theming.parent.text5' | translate }}</strong>\n        {{ 'anms.examples.theming.parent.text6' | translate }}\n      </p>\n      <p>\n        {{ 'anms.examples.theming.parent.text7' | translate }}\n        <strong>{{ 'anms.examples.theming.parent.text8' | translate }}</strong>\n        {{ 'anms.examples.theming.parent.text9' | translate }}\n        <code>> (child selectors)</code>\n        {{ 'anms.examples.theming.parent.text10' | translate }}\n      </p>\n      <pre>\n{{themeSrc}}\n      </pre>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"example\">\n        <h1>{{ 'anms.examples.theming.parent.description' | translate }}</h1>\n        <anms-child></anms-child>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/examples/theming/parent/parent.component.scss":
/*!***************************************************************!*\
  !*** ./src/app/examples/theming/parent/parent.component.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".main-heading {\n  text-transform: uppercase;\n  margin: 0 0 20px 0; }\n\npre {\n  margin: 0; }\n\n.example {\n  border: 1px solid;\n  padding: 20px;\n  margin: 0 0 20px 0; }\n"

/***/ }),

/***/ "./src/app/examples/theming/parent/parent.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/examples/theming/parent/parent.component.ts ***!
  \*************************************************************/
/*! exports provided: ParentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParentComponent", function() { return ParentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ParentComponent = /** @class */ (function () {
    function ParentComponent() {
        this.themeSrc = __webpack_require__(/*! raw-loader!./parent.component.scss-theme.scss */ "./node_modules/raw-loader/index.js!./src/app/examples/theming/parent/parent.component.scss-theme.scss");
    }
    ParentComponent.prototype.ngOnInit = function () { };
    ParentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-parent',
            template: __webpack_require__(/*! ./parent.component.html */ "./src/app/examples/theming/parent/parent.component.html"),
            styles: [__webpack_require__(/*! ./parent.component.scss */ "./src/app/examples/theming/parent/parent.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ParentComponent);
    return ParentComponent;
}());



/***/ }),

/***/ "./src/app/examples/todos/todos.component.html":
/*!*****************************************************!*\
  !*** ./src/app/examples/todos/todos.component.html ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"offset-md-2 col-md-8 entry\">\n      <anms-big-input [placeholder]=\"'anms.examples.todos.input' | translate\"\n                      [value]=\"newTodo\"\n                      (keyup)=\"onNewTodoChange($event.target.value)\"\n                      (keyup.enter)=\"!isAddTodoDisabled && onAddTodo()\"\n                      (keyup.escape)=\"onNewTodoClear()\">\n        <anms-big-input-action fontSet=\"fas\" fontIcon=\"fa-plus\" color=\"accent\"\n                               (action)=\"onAddTodo()\"\n                               [disabled]=\"isAddTodoDisabled\"\n                               [matTooltip]=\"'anms.examples.todos.tooltip.add' | translate\"\n                               matTooltipPosition=\"before\">\n        </anms-big-input-action>\n        <anms-big-input-action fontSet=\"fas\" fontIcon=\"fa-trash\" color=\"warn\"\n                               (action)=\"onRemoveDoneTodos()\"\n                               [disabled]=\"isRemoveDoneTodosDisabled\"\n                               matTooltip=\"Remove done todos\"\n                               [matTooltip]=\"'anms.examples.todos.tooltip.remove' | translate\"\n                               matTooltipPosition=\"after\">\n        </anms-big-input-action>\n      </anms-big-input>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <h2>\n        {{ 'anms.examples.todos.list' | translate }}\n        <button class=\"todos-filter\" mat-icon-button [matMenuTriggerFor]=\"todosFilter\">\n          <mat-icon fontSet=\"fas\" fontIcon=\"fa-filter\"></mat-icon>\n        </button>\n        <mat-menu class=\"todos-filter-menu-overlay\" #todosFilter=\"matMenu\" xPosition=\"before\">\n          <button mat-menu-item (click)=\"onFilterTodos('ALL')\" [ngClass]=\"{ active: todos.filter === 'ALL' }\">\n            <mat-icon fontSet=\"fas\" fontIcon=\"fa-tasks\"></mat-icon>\n            <span>{{ 'anms.examples.todos.filter.all' | translate }}</span>\n          </button>\n          <button mat-menu-item (click)=\"onFilterTodos('DONE')\" [ngClass]=\"{ active: todos.filter === 'DONE' }\">\n            <mat-icon fontSet=\"fas\" fontIcon=\"fa-check\"></mat-icon>\n            <span>{{ 'anms.examples.todos.filter.done' | translate }}</span>\n          </button>\n          <button mat-menu-item (click)=\"onFilterTodos('ACTIVE')\" [ngClass]=\"{ active: todos.filter === 'ACTIVE' }\">\n            <mat-icon fontSet=\"fas\" fontIcon=\"fa-square\"></mat-icon>\n            <span>{{ 'anms.examples.todos.filter.active' | translate }}</span>\n          </button>\n        </mat-menu>\n        <mat-chip-list class=\"todos-filter-info d-none d-sm-block\">\n          <mat-chip>\n            {{ 'anms.examples.todos.filter.description' | translate }} {{todos.filter !==\n            'ALL' ? filteredTodos.length : ''}}\n            {{ ('anms.examples.todos.filter.' + todos.filter.toLowerCase() |\n            translate).toLowerCase() }}\n            {{todos.filter === 'ALL' ? filteredTodos.length : ''}}\n            {{ 'anms.examples.todos.filter.items' | translate }}\n          </mat-chip>\n        </mat-chip-list>\n      </h2>\n      <mat-card *ngFor=\"let todo of filteredTodos\" class=\"todo\"\n                [ngClass]=\"routeAnimationsElements\">\n        <mat-checkbox class=\"todo-done\" [checked]=\"todo.done\" (change)=\"onToggleTodo(todo)\"></mat-checkbox>\n        <span class=\"todo-label\"\n              [ngClass]=\"{ 'todo-label-done': todo.done }\"\n              (click)=\"onToggleTodo(todo)\">\n          &nbsp;{{todo.name}}&nbsp;\n        </span>\n      </mat-card>\n      <br>\n      <br>\n    </div>\n    <div class=\"offset-md-1  col-md-5\">\n      <h2>{{ 'anms.examples.todos.example' | translate }}</h2>\n      <p>\n        {{ 'anms.examples.todos.text1' | translate }}\n        <code>{{ 'anms.examples.todos.text2' | translate }}</code>\n        {{ 'anms.examples.todos.text3' | translate }}\n      </p>\n      <p>\n        {{ 'anms.examples.todos.text4' | translate }} <code>ngrx</code>\n        {{ 'anms.examples.todos.text5' | translate }}\n      </p>\n      <p>{{ 'anms.examples.todos.text6' | translate }}</p>\n      <br>\n    </div>\n  </div>\n\n</div>\n"

/***/ }),

/***/ "./src/app/examples/todos/todos.component.scss":
/*!*****************************************************!*\
  !*** ./src/app/examples/todos/todos.component.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".entry {\n  margin-top: 40px;\n  margin-bottom: 40px; }\n\n.todos-filter-info {\n  float: right;\n  font-weight: normal; }\n\n.todos-filter {\n  float: right;\n  position: relative;\n  left: 10px;\n  top: -5px;\n  margin-left: -10px; }\n\n.todo {\n  display: -ms-flexbox;\n  display: flex;\n  margin-bottom: 10px; }\n\n.todo .todo-done {\n    margin: 0 20px 0 0; }\n\n.todo .todo-label {\n    position: relative;\n    top: 2px;\n    cursor: pointer; }\n\n.todo .todo-label.todo-label-done {\n      text-decoration: line-through;\n      opacity: 0.5; }\n"

/***/ }),

/***/ "./src/app/examples/todos/todos.component.ts":
/*!***************************************************!*\
  !*** ./src/app/examples/todos/todos.component.ts ***!
  \***************************************************/
/*! exports provided: TodosComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodosComponent", function() { return TodosComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/esm5/snack-bar.es5.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _app_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @app/core */ "./src/app/core/index.ts");
/* harmony import */ var _todos_reducer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./todos.reducer */ "./src/app/examples/todos/todos.reducer.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var TodosComponent = /** @class */ (function () {
    function TodosComponent(store, snackBar) {
        this.store = store;
        this.snackBar = snackBar;
        this.unsubscribe$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        this.routeAnimationsElements = _app_core__WEBPACK_IMPORTED_MODULE_5__["ROUTE_ANIMATIONS_ELEMENTS"];
        this.newTodo = '';
    }
    TodosComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store
            .select(_todos_reducer__WEBPACK_IMPORTED_MODULE_6__["selectorTodos"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.unsubscribe$))
            .subscribe(function (todos) {
            _this.todos = todos;
            _this.store.dispatch(new _todos_reducer__WEBPACK_IMPORTED_MODULE_6__["ActionTodosPersist"]({ todos: todos }));
        });
    };
    TodosComponent.prototype.ngOnDestroy = function () {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    };
    Object.defineProperty(TodosComponent.prototype, "filteredTodos", {
        get: function () {
            var filter = this.todos.filter;
            if (filter === 'ALL') {
                return this.todos.items;
            }
            else {
                var predicate = filter === 'DONE' ? function (t) { return t.done; } : function (t) { return !t.done; };
                return this.todos.items.filter(predicate);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TodosComponent.prototype, "isAddTodoDisabled", {
        get: function () {
            return this.newTodo.length < 4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TodosComponent.prototype, "isRemoveDoneTodosDisabled", {
        get: function () {
            return this.todos.items.filter(function (item) { return item.done; }).length === 0;
        },
        enumerable: true,
        configurable: true
    });
    TodosComponent.prototype.onNewTodoChange = function (newTodo) {
        this.newTodo = newTodo;
    };
    TodosComponent.prototype.onNewTodoClear = function () {
        this.newTodo = '';
    };
    TodosComponent.prototype.onAddTodo = function () {
        this.store.dispatch(new _todos_reducer__WEBPACK_IMPORTED_MODULE_6__["ActionTodosAdd"]({ name: this.newTodo }));
        this.showNotification("\"" + this.newTodo + "\" added");
        this.newTodo = '';
    };
    TodosComponent.prototype.onToggleTodo = function (todo) {
        var _this = this;
        var newStatus = todo.done ? 'active' : 'done';
        this.store.dispatch(new _todos_reducer__WEBPACK_IMPORTED_MODULE_6__["ActionTodosToggle"]({ id: todo.id }));
        this.showNotification("Toggled \"" + todo.name + "\" to " + newStatus, 'Undo')
            .onAction()
            .subscribe(function () { return _this.onToggleTodo(__assign({}, todo, { done: !todo.done })); });
    };
    TodosComponent.prototype.onRemoveDoneTodos = function () {
        this.store.dispatch(new _todos_reducer__WEBPACK_IMPORTED_MODULE_6__["ActionTodosRemoveDone"]());
        this.showNotification('Removed done todos');
    };
    TodosComponent.prototype.onFilterTodos = function (filter) {
        this.store.dispatch(new _todos_reducer__WEBPACK_IMPORTED_MODULE_6__["ActionTodosFilter"]({ filter: filter }));
        this.showNotification("Filtered to " + filter.toLowerCase());
    };
    TodosComponent.prototype.showNotification = function (message, action) {
        return this.snackBar.open(message, action, {
            duration: 2500,
            panelClass: 'todos-notification-overlay'
        });
    };
    TodosComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-todos',
            template: __webpack_require__(/*! ./todos.component.html */ "./src/app/examples/todos/todos.component.html"),
            styles: [__webpack_require__(/*! ./todos.component.scss */ "./src/app/examples/todos/todos.component.scss")]
        }),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"], _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"]])
    ], TodosComponent);
    return TodosComponent;
}());



/***/ }),

/***/ "./src/app/examples/todos/todos.effects.ts":
/*!*************************************************!*\
  !*** ./src/app/examples/todos/todos.effects.ts ***!
  \*************************************************/
/*! exports provided: TodosEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodosEffects", function() { return TodosEffects; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _app_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/core */ "./src/app/core/index.ts");
/* harmony import */ var _todos_reducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./todos.reducer */ "./src/app/examples/todos/todos.reducer.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TodosEffects = /** @class */ (function () {
    function TodosEffects(actions$, localStorageService) {
        this.actions$ = actions$;
        this.localStorageService = localStorageService;
    }
    TodosEffects.prototype.persistTodos = function () {
        var _this = this;
        return this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_todos_reducer__WEBPACK_IMPORTED_MODULE_4__["TodosActionTypes"].PERSIST), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["tap"])(function (action) {
            return _this.localStorageService.setItem(_todos_reducer__WEBPACK_IMPORTED_MODULE_4__["TODOS_KEY"], action.payload.todos);
        }));
    };
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])({ dispatch: false }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TodosEffects.prototype, "persistTodos", null);
    TodosEffects = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"],
            _app_core__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"]])
    ], TodosEffects);
    return TodosEffects;
}());



/***/ }),

/***/ "./src/app/examples/todos/todos.reducer.ts":
/*!*************************************************!*\
  !*** ./src/app/examples/todos/todos.reducer.ts ***!
  \*************************************************/
/*! exports provided: TODOS_KEY, TodosActionTypes, ActionTodosAdd, ActionTodosToggle, ActionTodosRemoveDone, ActionTodosFilter, ActionTodosPersist, initialState, selectorTodos, todosReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TODOS_KEY", function() { return TODOS_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodosActionTypes", function() { return TodosActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionTodosAdd", function() { return ActionTodosAdd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionTodosToggle", function() { return ActionTodosToggle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionTodosRemoveDone", function() { return ActionTodosRemoveDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionTodosFilter", function() { return ActionTodosFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionTodosPersist", function() { return ActionTodosPersist; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialState", function() { return initialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectorTodos", function() { return selectorTodos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "todosReducer", function() { return todosReducer; });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/index.js");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_0__);
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var TODOS_KEY = 'EXAMPLES.TODOS';
var TodosActionTypes;
(function (TodosActionTypes) {
    TodosActionTypes["ADD"] = "[Todos] Add";
    TodosActionTypes["TOGGLE"] = "[Todos] Toggle";
    TodosActionTypes["REMOVE_DONE"] = "[Todos] Remove Done";
    TodosActionTypes["FILTER"] = "[Todos] Filter";
    TodosActionTypes["PERSIST"] = "[Todos] Persist";
})(TodosActionTypes || (TodosActionTypes = {}));
var ActionTodosAdd = /** @class */ (function () {
    function ActionTodosAdd(payload) {
        this.payload = payload;
        this.type = TodosActionTypes.ADD;
    }
    return ActionTodosAdd;
}());

var ActionTodosToggle = /** @class */ (function () {
    function ActionTodosToggle(payload) {
        this.payload = payload;
        this.type = TodosActionTypes.TOGGLE;
    }
    return ActionTodosToggle;
}());

var ActionTodosRemoveDone = /** @class */ (function () {
    function ActionTodosRemoveDone() {
        this.type = TodosActionTypes.REMOVE_DONE;
    }
    return ActionTodosRemoveDone;
}());

var ActionTodosFilter = /** @class */ (function () {
    function ActionTodosFilter(payload) {
        this.payload = payload;
        this.type = TodosActionTypes.FILTER;
    }
    return ActionTodosFilter;
}());

var ActionTodosPersist = /** @class */ (function () {
    function ActionTodosPersist(payload) {
        this.payload = payload;
        this.type = TodosActionTypes.PERSIST;
    }
    return ActionTodosPersist;
}());

var initialState = {
    items: [
        { id: Object(uuid__WEBPACK_IMPORTED_MODULE_0__["v4"])(), name: 'Open Todo list example', done: true },
        { id: Object(uuid__WEBPACK_IMPORTED_MODULE_0__["v4"])(), name: 'Check the other examples', done: false },
        {
            id: Object(uuid__WEBPACK_IMPORTED_MODULE_0__["v4"])(),
            name: 'Use Angular ngRx Material Starter in your project',
            done: false
        }
    ],
    filter: 'ALL'
};
var selectorTodos = function (state) { return state.examples.todos; };
function todosReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case TodosActionTypes.ADD:
            return __assign({}, state, { items: [
                    {
                        id: Object(uuid__WEBPACK_IMPORTED_MODULE_0__["v4"])(),
                        name: action.payload.name,
                        done: false
                    }
                ].concat(state.items) });
        case TodosActionTypes.TOGGLE:
            return __assign({}, state, { items: state.items.map(function (item) {
                    return item.id === action.payload.id ? __assign({}, item, { done: !item.done }) : item;
                }) });
        case TodosActionTypes.REMOVE_DONE:
            return __assign({}, state, { items: state.items.filter(function (item) { return !item.done; }) });
        case TodosActionTypes.FILTER:
            return __assign({}, state, { filter: action.payload.filter });
        default:
            return state;
    }
}


/***/ })

}]);
//# sourceMappingURL=app-examples-examples-module.js.map