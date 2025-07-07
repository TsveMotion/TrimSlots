"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/user/account/route";
exports.ids = ["app/api/user/account/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist\\client\\components\\action-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist\\client\\components\\action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist\\client\\components\\request-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist\\client\\components\\request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!*********************************************************************************************!*\
  !*** external "next/dist\\client\\components\\static-generation-async-storage.external.js" ***!
  \*********************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist\\client\\components\\static-generation-async-storage.external.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fuser%2Faccount%2Froute&page=%2Fapi%2Fuser%2Faccount%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fuser%2Faccount%2Froute.ts&appDir=D%3A%5CTSVWEB%5CTrimSlots%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTSVWEB%5CTrimSlots&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fuser%2Faccount%2Froute&page=%2Fapi%2Fuser%2Faccount%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fuser%2Faccount%2Froute.ts&appDir=D%3A%5CTSVWEB%5CTrimSlots%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTSVWEB%5CTrimSlots&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var D_TSVWEB_TrimSlots_src_app_api_user_account_route_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/app/api/user/account/route.ts */ \"(rsc)/./src/app/api/user/account/route.ts\");\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/user/account/route\",\n        pathname: \"/api/user/account\",\n        filename: \"route\",\n        bundlePath: \"app/api/user/account/route\"\n    },\n    resolvedPagePath: \"D:\\\\TSVWEB\\\\TrimSlots\\\\src\\\\app\\\\api\\\\user\\\\account\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_TSVWEB_TrimSlots_src_app_api_user_account_route_ts__WEBPACK_IMPORTED_MODULE_2__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/user/account/route\";\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZ1c2VyJTJGYWNjb3VudCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGdXNlciUyRmFjY291bnQlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZ1c2VyJTJGYWNjb3VudCUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDVFNWV0VCJTVDVHJpbVNsb3RzJTVDc3JjJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1EJTNBJTVDVFNWV0VCJTVDVHJpbVNsb3RzJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUMyQjtBQUMxRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHVHQUF1RztBQUMvRztBQUNpSjs7QUFFakoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90cmltc2xvdHMvPzFmOTAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiRDpcXFxcVFNWV0VCXFxcXFRyaW1TbG90c1xcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFx1c2VyXFxcXGFjY291bnRcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3VzZXIvYWNjb3VudC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3VzZXIvYWNjb3VudFwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdXNlci9hY2NvdW50L3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiRDpcXFxcVFNWV0VCXFxcXFRyaW1TbG90c1xcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFx1c2VyXFxcXGFjY291bnRcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0IH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvdXNlci9hY2NvdW50L3JvdXRlXCI7XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIGhlYWRlckhvb2tzLCBzdGF0aWNHZW5lcmF0aW9uQmFpbG91dCwgb3JpZ2luYWxQYXRobmFtZSwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fuser%2Faccount%2Froute&page=%2Fapi%2Fuser%2Faccount%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fuser%2Faccount%2Froute.ts&appDir=D%3A%5CTSVWEB%5CTrimSlots%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTSVWEB%5CTrimSlots&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/user/account/route.ts":
/*!*******************************************!*\
  !*** ./src/app/api/user/account/route.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n\n\n\n\nasync function GET() {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n        if (!session?.user?.id) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"Unauthorized\"\n            }, {\n                status: 401\n            });\n        }\n        const userId = session.user.id;\n        // Fetch detailed user information including relationships\n        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].user.findUnique({\n            where: {\n                id: userId\n            },\n            include: {\n                business: true,\n                managedBusiness: true,\n                clientBusinesses: {\n                    include: {\n                        business: true\n                    }\n                }\n            }\n        });\n        if (!user) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"User not found\"\n            }, {\n                status: 404\n            });\n        }\n        // Remove sensitive information\n        const { hashedPassword, ...userWithoutPassword } = user;\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json(userWithoutPassword);\n    } catch (error) {\n        console.error(\"Error fetching user account:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS91c2VyL2FjY291bnQvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTJDO0FBQ0U7QUFDSjtBQUNQO0FBRTNCLGVBQWVJO0lBQ3BCLElBQUk7UUFDRixNQUFNQyxVQUFVLE1BQU1KLDJEQUFnQkEsQ0FBQ0Msa0RBQVdBO1FBRWxELElBQUksQ0FBQ0csU0FBU0MsTUFBTUMsSUFBSTtZQUN0QixPQUFPUCxrRkFBWUEsQ0FBQ1EsSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUFlLEdBQ3hCO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxNQUFNQyxTQUFTTixRQUFRQyxJQUFJLENBQUNDLEVBQUU7UUFFOUIsMERBQTBEO1FBQzFELE1BQU1ELE9BQU8sTUFBTUgsbURBQU1BLENBQUNHLElBQUksQ0FBQ00sVUFBVSxDQUFDO1lBQ3hDQyxPQUFPO2dCQUNMTixJQUFJSTtZQUNOO1lBQ0FHLFNBQVM7Z0JBQ1BDLFVBQVU7Z0JBQ1ZDLGlCQUFpQjtnQkFDakJDLGtCQUFrQjtvQkFDaEJILFNBQVM7d0JBQ1BDLFVBQVU7b0JBQ1o7Z0JBQ0Y7WUFDRjtRQUNGO1FBRUEsSUFBSSxDQUFDVCxNQUFNO1lBQ1QsT0FBT04sa0ZBQVlBLENBQUNRLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBaUIsR0FDMUI7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLCtCQUErQjtRQUMvQixNQUFNLEVBQUVRLGNBQWMsRUFBRSxHQUFHQyxxQkFBcUIsR0FBR2I7UUFFbkQsT0FBT04sa0ZBQVlBLENBQUNRLElBQUksQ0FBQ1c7SUFDM0IsRUFBRSxPQUFPVixPQUFPO1FBQ2RXLFFBQVFYLEtBQUssQ0FBQyxnQ0FBZ0NBO1FBQzlDLE9BQU9ULGtGQUFZQSxDQUFDUSxJQUFJLENBQ3RCO1lBQUVDLE9BQU87UUFBd0IsR0FDakM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90cmltc2xvdHMvLi9zcmMvYXBwL2FwaS91c2VyL2FjY291bnQvcm91dGUudHM/ZDViNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tIFwibmV4dC1hdXRoXCI7XG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gXCJAL2xpYi9hdXRoXCI7XG5pbXBvcnQgcHJpc21hIGZyb20gXCJAL2xpYi9wcmlzbWFcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmlkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMSB9XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHVzZXJJZCA9IHNlc3Npb24udXNlci5pZDtcbiAgICBcbiAgICAvLyBGZXRjaCBkZXRhaWxlZCB1c2VyIGluZm9ybWF0aW9uIGluY2x1ZGluZyByZWxhdGlvbnNoaXBzXG4gICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgICAgd2hlcmU6IHtcbiAgICAgICAgaWQ6IHVzZXJJZFxuICAgICAgfSxcbiAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgYnVzaW5lc3M6IHRydWUsXG4gICAgICAgIG1hbmFnZWRCdXNpbmVzczogdHJ1ZSxcbiAgICAgICAgY2xpZW50QnVzaW5lc3Nlczoge1xuICAgICAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgICAgIGJ1c2luZXNzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJVc2VyIG5vdCBmb3VuZFwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDQgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgc2Vuc2l0aXZlIGluZm9ybWF0aW9uXG4gICAgY29uc3QgeyBoYXNoZWRQYXNzd29yZCwgLi4udXNlcldpdGhvdXRQYXNzd29yZCB9ID0gdXNlcjtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih1c2VyV2l0aG91dFBhc3N3b3JkKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgdXNlciBhY2NvdW50OlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogXCJJbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImdldFNlcnZlclNlc3Npb24iLCJhdXRoT3B0aW9ucyIsInByaXNtYSIsIkdFVCIsInNlc3Npb24iLCJ1c2VyIiwiaWQiLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJ1c2VySWQiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJpbmNsdWRlIiwiYnVzaW5lc3MiLCJtYW5hZ2VkQnVzaW5lc3MiLCJjbGllbnRCdXNpbmVzc2VzIiwiaGFzaGVkUGFzc3dvcmQiLCJ1c2VyV2l0aG91dFBhc3N3b3JkIiwiY29uc29sZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/user/account/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @next-auth/prisma-adapter */ \"(rsc)/./node_modules/@next-auth/prisma-adapter/dist/index.js\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./src/lib/prisma.ts\");\n\n\n\n\nconst authOptions = {\n    adapter: (0,_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_0__.PrismaAdapter)(_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"]),\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"text\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    throw new Error(\"Invalid credentials\");\n                }\n                // Check if credentials match admin credentials from .env\n                if (credentials.email === process.env.ADMIN_USERNAME && credentials.password === process.env.ADMIN_PASSWORD) {\n                    // Return a synthetic admin user\n                    return {\n                        id: \"admin-id\",\n                        name: \"Administrator\",\n                        email: process.env.ADMIN_USERNAME,\n                        role: \"ADMIN\",\n                        image: null,\n                        emailVerified: new Date()\n                    };\n                }\n                // Regular user authentication\n                const user = await _prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].user.findUnique({\n                    where: {\n                        email: credentials.email\n                    }\n                });\n                if (!user || !user?.hashedPassword) {\n                    throw new Error(\"Invalid credentials\");\n                }\n                const isCorrectPassword = await bcrypt__WEBPACK_IMPORTED_MODULE_2___default().compare(credentials.password, user.hashedPassword);\n                if (!isCorrectPassword) {\n                    throw new Error(\"Invalid credentials\");\n                }\n                return user;\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                // Ensure role is properly serialized as a string\n                token.role = String(user.role);\n                token.id = user.id;\n                // Add debug information\n                console.log(\"JWT callback - user role:\", user.role);\n                console.log(\"JWT callback - token role:\", token.role);\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token && session.user) {\n                // Ensure role is properly passed to session\n                session.user.role = String(token.role);\n                session.user.id = token.id;\n                // Add debug information\n                console.log(\"Session callback - token role:\", token.role);\n                console.log(\"Session callback - session role:\", session.user.role);\n            }\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/auth/signin\",\n        signOut: \"/auth/signout\",\n        error: \"/auth/error\"\n    },\n    debug: \"development\" === \"development\",\n    session: {\n        strategy: \"jwt\"\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUFkYXB0ZXIgfSBmcm9tIFwiQG5leHQtYXV0aC9wcmlzbWEtYWRhcHRlclwiO1xuaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IENyZWRlbnRpYWxzUHJvdmlkZXIgZnJvbSBcIm5leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHNcIjtcbmltcG9ydCBiY3J5cHQgZnJvbSBcImJjcnlwdFwiO1xuaW1wb3J0IHByaXNtYSBmcm9tIFwiLi9wcmlzbWFcIjtcbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIjtcblxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zOiBOZXh0QXV0aE9wdGlvbnMgPSB7XG4gIGFkYXB0ZXI6IFByaXNtYUFkYXB0ZXIocHJpc21hKSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XG4gICAgICBuYW1lOiBcImNyZWRlbnRpYWxzXCIsXG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICBlbWFpbDogeyBsYWJlbDogXCJFbWFpbFwiLCB0eXBlOiBcInRleHRcIiB9LFxuICAgICAgICBwYXNzd29yZDogeyBsYWJlbDogXCJQYXNzd29yZFwiLCB0eXBlOiBcInBhc3N3b3JkXCIgfSxcbiAgICAgIH0sXG4gICAgICBhc3luYyBhdXRob3JpemUoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgaWYgKCFjcmVkZW50aWFscz8uZW1haWwgfHwgIWNyZWRlbnRpYWxzPy5wYXNzd29yZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY3JlZGVudGlhbHNcIik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIENoZWNrIGlmIGNyZWRlbnRpYWxzIG1hdGNoIGFkbWluIGNyZWRlbnRpYWxzIGZyb20gLmVudlxuICAgICAgICBpZiAoXG4gICAgICAgICAgY3JlZGVudGlhbHMuZW1haWwgPT09IHByb2Nlc3MuZW52LkFETUlOX1VTRVJOQU1FICYmIFxuICAgICAgICAgIGNyZWRlbnRpYWxzLnBhc3N3b3JkID09PSBwcm9jZXNzLmVudi5BRE1JTl9QQVNTV09SRFxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBSZXR1cm4gYSBzeW50aGV0aWMgYWRtaW4gdXNlclxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogJ2FkbWluLWlkJyxcbiAgICAgICAgICAgIG5hbWU6ICdBZG1pbmlzdHJhdG9yJyxcbiAgICAgICAgICAgIGVtYWlsOiBwcm9jZXNzLmVudi5BRE1JTl9VU0VSTkFNRSxcbiAgICAgICAgICAgIHJvbGU6ICdBRE1JTicsXG4gICAgICAgICAgICBpbWFnZTogbnVsbCxcbiAgICAgICAgICAgIGVtYWlsVmVyaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlZ3VsYXIgdXNlciBhdXRoZW50aWNhdGlvblxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XG4gICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgIGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXVzZXIgfHwgIXVzZXI/Lmhhc2hlZFBhc3N3b3JkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjcmVkZW50aWFsc1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzQ29ycmVjdFBhc3N3b3JkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoXG4gICAgICAgICAgY3JlZGVudGlhbHMucGFzc3dvcmQsXG4gICAgICAgICAgdXNlci5oYXNoZWRQYXNzd29yZFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICghaXNDb3JyZWN0UGFzc3dvcmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNyZWRlbnRpYWxzXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICB9LFxuICAgIH0pLFxuICAgIC8vIFlvdSBjYW4gYWRkIG1vcmUgcHJvdmlkZXJzIGhlcmUgbGlrZSBHb29nbGUsIEZhY2Vib29rLCBldGMuXG4gIF0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyIH0pIHtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIC8vIEVuc3VyZSByb2xlIGlzIHByb3Blcmx5IHNlcmlhbGl6ZWQgYXMgYSBzdHJpbmdcbiAgICAgICAgdG9rZW4ucm9sZSA9IFN0cmluZygodXNlciBhcyBVc2VyKS5yb2xlKTtcbiAgICAgICAgdG9rZW4uaWQgPSAodXNlciBhcyBVc2VyKS5pZDtcbiAgICAgICAgLy8gQWRkIGRlYnVnIGluZm9ybWF0aW9uXG4gICAgICAgIGNvbnNvbGUubG9nKCdKV1QgY2FsbGJhY2sgLSB1c2VyIHJvbGU6JywgKHVzZXIgYXMgVXNlcikucm9sZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdKV1QgY2FsbGJhY2sgLSB0b2tlbiByb2xlOicsIHRva2VuLnJvbGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH0sXG4gICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH0pIHtcbiAgICAgIGlmICh0b2tlbiAmJiBzZXNzaW9uLnVzZXIpIHtcbiAgICAgICAgLy8gRW5zdXJlIHJvbGUgaXMgcHJvcGVybHkgcGFzc2VkIHRvIHNlc3Npb25cbiAgICAgICAgc2Vzc2lvbi51c2VyLnJvbGUgPSBTdHJpbmcodG9rZW4ucm9sZSk7XG4gICAgICAgIHNlc3Npb24udXNlci5pZCA9IHRva2VuLmlkIGFzIHN0cmluZztcbiAgICAgICAgLy8gQWRkIGRlYnVnIGluZm9ybWF0aW9uXG4gICAgICAgIGNvbnNvbGUubG9nKCdTZXNzaW9uIGNhbGxiYWNrIC0gdG9rZW4gcm9sZTonLCB0b2tlbi5yb2xlKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1Nlc3Npb24gY2FsbGJhY2sgLSBzZXNzaW9uIHJvbGU6Jywgc2Vzc2lvbi51c2VyLnJvbGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlc3Npb247XG4gICAgfSxcbiAgfSxcbiAgcGFnZXM6IHtcbiAgICBzaWduSW46IFwiL2F1dGgvc2lnbmluXCIsXG4gICAgc2lnbk91dDogXCIvYXV0aC9zaWdub3V0XCIsXG4gICAgZXJyb3I6IFwiL2F1dGgvZXJyb3JcIixcbiAgfSxcbiAgZGVidWc6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCIsXG4gIHNlc3Npb246IHtcbiAgICBzdHJhdGVneTogXCJqd3RcIixcbiAgfSxcbiAgc2VjcmV0OiBwcm9jZXNzLmVudi5ORVhUQVVUSF9TRUNSRVQsXG59O1xuXG4vLyBDdXN0b20gdHlwZXMgZm9yIE5leHRBdXRoXG5kZWNsYXJlIG1vZHVsZSBcIm5leHQtYXV0aFwiIHtcbiAgaW50ZXJmYWNlIFNlc3Npb24ge1xuICAgIHVzZXI6IHtcbiAgICAgIGlkOiBzdHJpbmc7XG4gICAgICBuYW1lPzogc3RyaW5nIHwgbnVsbDtcbiAgICAgIGVtYWlsPzogc3RyaW5nIHwgbnVsbDtcbiAgICAgIGltYWdlPzogc3RyaW5nIHwgbnVsbDtcbiAgICAgIHJvbGU/OiBzdHJpbmc7XG4gICAgfTtcbiAgfVxufVxuXG5kZWNsYXJlIG1vZHVsZSBcIm5leHQtYXV0aC9qd3RcIiB7XG4gIGludGVyZmFjZSBKV1Qge1xuICAgIGlkPzogc3RyaW5nO1xuICAgIHJvbGU/OiBzdHJpbmc7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJQcmlzbWFBZGFwdGVyIiwiQ3JlZGVudGlhbHNQcm92aWRlciIsImJjcnlwdCIsInByaXNtYSIsImF1dGhPcHRpb25zIiwiYWRhcHRlciIsInByb3ZpZGVycyIsIm5hbWUiLCJjcmVkZW50aWFscyIsImVtYWlsIiwibGFiZWwiLCJ0eXBlIiwicGFzc3dvcmQiLCJhdXRob3JpemUiLCJFcnJvciIsInByb2Nlc3MiLCJlbnYiLCJBRE1JTl9VU0VSTkFNRSIsIkFETUlOX1BBU1NXT1JEIiwiaWQiLCJyb2xlIiwiaW1hZ2UiLCJlbWFpbFZlcmlmaWVkIiwiRGF0ZSIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJoYXNoZWRQYXNzd29yZCIsImlzQ29ycmVjdFBhc3N3b3JkIiwiY29tcGFyZSIsImNhbGxiYWNrcyIsImp3dCIsInRva2VuIiwiU3RyaW5nIiwiY29uc29sZSIsImxvZyIsInNlc3Npb24iLCJwYWdlcyIsInNpZ25JbiIsInNpZ25PdXQiLCJlcnJvciIsImRlYnVnIiwic3RyYXRlZ3kiLCJzZWNyZXQiLCJORVhUQVVUSF9TRUNSRVQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = global.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) {\n    global.prisma = prisma;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBOEM7QUFPOUMsTUFBTUMsU0FBU0MsT0FBT0QsTUFBTSxJQUFJLElBQUlELHdEQUFZQTtBQUVoRCxJQUFJRyxJQUFxQyxFQUFFO0lBQ3pDRCxPQUFPRCxNQUFNLEdBQUdBO0FBQ2xCO0FBRUEsaUVBQWVBLE1BQU1BLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90cmltc2xvdHMvLi9zcmMvbGliL3ByaXNtYS50cz8wMWQ3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuXG4vLyBQcmV2ZW50IG11bHRpcGxlIGluc3RhbmNlcyBvZiBQcmlzbWEgQ2xpZW50IGluIGRldmVsb3BtZW50XG5kZWNsYXJlIGdsb2JhbCB7XG4gIHZhciBwcmlzbWE6IFByaXNtYUNsaWVudCB8IHVuZGVmaW5lZDtcbn1cblxuY29uc3QgcHJpc21hID0gZ2xvYmFsLnByaXNtYSB8fCBuZXcgUHJpc21hQ2xpZW50KCk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgZ2xvYmFsLnByaXNtYSA9IHByaXNtYTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcHJpc21hO1xuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsInByaXNtYSIsImdsb2JhbCIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/preact-render-to-string","vendor-chunks/uuid","vendor-chunks/@next-auth","vendor-chunks/yallist","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fuser%2Faccount%2Froute&page=%2Fapi%2Fuser%2Faccount%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fuser%2Faccount%2Froute.ts&appDir=D%3A%5CTSVWEB%5CTrimSlots%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTSVWEB%5CTrimSlots&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();