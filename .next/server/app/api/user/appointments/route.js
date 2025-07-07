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
exports.id = "app/api/user/appointments/route";
exports.ids = ["app/api/user/appointments/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fuser%2Fappointments%2Froute&page=%2Fapi%2Fuser%2Fappointments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fuser%2Fappointments%2Froute.ts&appDir=D%3A%5CTSVWEB%5CTrimSlots%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTSVWEB%5CTrimSlots&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fuser%2Fappointments%2Froute&page=%2Fapi%2Fuser%2Fappointments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fuser%2Fappointments%2Froute.ts&appDir=D%3A%5CTSVWEB%5CTrimSlots%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTSVWEB%5CTrimSlots&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var D_TSVWEB_TrimSlots_src_app_api_user_appointments_route_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/app/api/user/appointments/route.ts */ \"(rsc)/./src/app/api/user/appointments/route.ts\");\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/user/appointments/route\",\n        pathname: \"/api/user/appointments\",\n        filename: \"route\",\n        bundlePath: \"app/api/user/appointments/route\"\n    },\n    resolvedPagePath: \"D:\\\\TSVWEB\\\\TrimSlots\\\\src\\\\app\\\\api\\\\user\\\\appointments\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_TSVWEB_TrimSlots_src_app_api_user_appointments_route_ts__WEBPACK_IMPORTED_MODULE_2__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/user/appointments/route\";\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZ1c2VyJTJGYXBwb2ludG1lbnRzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZ1c2VyJTJGYXBwb2ludG1lbnRzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGdXNlciUyRmFwcG9pbnRtZW50cyUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDVFNWV0VCJTVDVHJpbVNsb3RzJTVDc3JjJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1EJTNBJTVDVFNWV0VCJTVDVHJpbVNsb3RzJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNnQztBQUMvRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHVHQUF1RztBQUMvRztBQUNpSjs7QUFFakoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90cmltc2xvdHMvPzBkMDYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiRDpcXFxcVFNWV0VCXFxcXFRyaW1TbG90c1xcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFx1c2VyXFxcXGFwcG9pbnRtZW50c1xcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvdXNlci9hcHBvaW50bWVudHMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS91c2VyL2FwcG9pbnRtZW50c1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdXNlci9hcHBvaW50bWVudHMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJEOlxcXFxUU1ZXRUJcXFxcVHJpbVNsb3RzXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXHVzZXJcXFxcYXBwb2ludG1lbnRzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIGhlYWRlckhvb2tzLCBzdGF0aWNHZW5lcmF0aW9uQmFpbG91dCB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL3VzZXIvYXBwb2ludG1lbnRzL3JvdXRlXCI7XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIGhlYWRlckhvb2tzLCBzdGF0aWNHZW5lcmF0aW9uQmFpbG91dCwgb3JpZ2luYWxQYXRobmFtZSwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fuser%2Fappointments%2Froute&page=%2Fapi%2Fuser%2Fappointments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fuser%2Fappointments%2Froute.ts&appDir=D%3A%5CTSVWEB%5CTrimSlots%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTSVWEB%5CTrimSlots&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/user/appointments/route.ts":
/*!************************************************!*\
  !*** ./src/app/api/user/appointments/route.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n\n\n\n\nasync function GET() {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n        if (!session?.user?.id) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"Unauthorized\"\n            }, {\n                status: 401\n            });\n        }\n        const userId = session.user.id;\n        const userRole = session.user.role;\n        // Different queries based on user role\n        let bookings = [];\n        if (userRole === \"CLIENT\") {\n            // For clients, get bookings where they are the client\n            bookings = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].booking.findMany({\n                where: {\n                    clientId: userId,\n                    status: {\n                        notIn: [\n                            \"cancelled\"\n                        ]\n                    }\n                },\n                orderBy: {\n                    startTime: \"asc\"\n                },\n                include: {\n                    service: true,\n                    business: true\n                },\n                take: 5 // Limit to 5 most recent bookings\n            });\n        } else if (userRole === \"WORKER\") {\n            // For workers, get bookings assigned to them\n            bookings = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].booking.findMany({\n                where: {\n                    workerId: userId,\n                    status: {\n                        notIn: [\n                            \"cancelled\"\n                        ]\n                    }\n                },\n                orderBy: {\n                    startTime: \"asc\"\n                },\n                include: {\n                    service: true,\n                    business: true\n                },\n                take: 5\n            });\n        } else if (userRole === \"BUSINESS_OWNER\") {\n            // For business owners, get bookings for their business\n            const business = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].business.findUnique({\n                where: {\n                    ownerId: userId\n                }\n            });\n            if (business) {\n                bookings = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].booking.findMany({\n                    where: {\n                        businessId: business.id,\n                        status: {\n                            notIn: [\n                                \"cancelled\"\n                            ]\n                        }\n                    },\n                    orderBy: {\n                        startTime: \"asc\"\n                    },\n                    include: {\n                        service: true\n                    },\n                    take: 5\n                });\n            } else {\n                bookings = [];\n            }\n        } else if (userRole === \"ADMIN\") {\n            // For admins, get the most recent bookings across all businesses\n            bookings = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].booking.findMany({\n                orderBy: {\n                    startTime: \"asc\"\n                },\n                include: {\n                    service: true,\n                    business: true\n                },\n                take: 5\n            });\n        } else {\n            bookings = [];\n        }\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json(bookings);\n    } catch (error) {\n        console.error(\"Error fetching appointments:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS91c2VyL2FwcG9pbnRtZW50cy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBMkM7QUFDRTtBQUNKO0FBQ1A7QUFjM0IsZUFBZUk7SUFDcEIsSUFBSTtRQUNGLE1BQU1DLFVBQVUsTUFBTUosMkRBQWdCQSxDQUFDQyxrREFBV0E7UUFFbEQsSUFBSSxDQUFDRyxTQUFTQyxNQUFNQyxJQUFJO1lBQ3RCLE9BQU9QLGtGQUFZQSxDQUFDUSxJQUFJLENBQ3RCO2dCQUFFQyxPQUFPO1lBQWUsR0FDeEI7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLE1BQU1DLFNBQVNOLFFBQVFDLElBQUksQ0FBQ0MsRUFBRTtRQUM5QixNQUFNSyxXQUFXUCxRQUFRQyxJQUFJLENBQUNPLElBQUk7UUFFbEMsdUNBQXVDO1FBQ3ZDLElBQUlDLFdBQW1DLEVBQUU7UUFFekMsSUFBSUYsYUFBYSxVQUFVO1lBQ3pCLHNEQUFzRDtZQUN0REUsV0FBVyxNQUFNWCxtREFBTUEsQ0FBQ1ksT0FBTyxDQUFDQyxRQUFRLENBQUM7Z0JBQ3ZDQyxPQUFPO29CQUNMQyxVQUFVUDtvQkFDVkQsUUFBUTt3QkFDTlMsT0FBTzs0QkFBQzt5QkFBWTtvQkFDdEI7Z0JBQ0Y7Z0JBQ0FDLFNBQVM7b0JBQ1BDLFdBQVc7Z0JBQ2I7Z0JBQ0FDLFNBQVM7b0JBQ1BDLFNBQVM7b0JBQ1RDLFVBQVU7Z0JBQ1o7Z0JBQ0FDLE1BQU0sRUFBRSxrQ0FBa0M7WUFDNUM7UUFDRixPQUFPLElBQUliLGFBQWEsVUFBVTtZQUNoQyw2Q0FBNkM7WUFDN0NFLFdBQVcsTUFBTVgsbURBQU1BLENBQUNZLE9BQU8sQ0FBQ0MsUUFBUSxDQUFDO2dCQUN2Q0MsT0FBTztvQkFDTFMsVUFBVWY7b0JBQ1ZELFFBQVE7d0JBQ05TLE9BQU87NEJBQUM7eUJBQVk7b0JBQ3RCO2dCQUNGO2dCQUNBQyxTQUFTO29CQUNQQyxXQUFXO2dCQUNiO2dCQUNBQyxTQUFTO29CQUNQQyxTQUFTO29CQUNUQyxVQUFVO2dCQUNaO2dCQUNBQyxNQUFNO1lBQ1I7UUFDRixPQUFPLElBQUliLGFBQWEsa0JBQWtCO1lBQ3hDLHVEQUF1RDtZQUN2RCxNQUFNWSxXQUFXLE1BQU1yQixtREFBTUEsQ0FBQ3FCLFFBQVEsQ0FBQ0csVUFBVSxDQUFDO2dCQUNoRFYsT0FBTztvQkFDTFcsU0FBU2pCO2dCQUNYO1lBQ0Y7WUFFQSxJQUFJYSxVQUFVO2dCQUNaVixXQUFXLE1BQU1YLG1EQUFNQSxDQUFDWSxPQUFPLENBQUNDLFFBQVEsQ0FBQztvQkFDdkNDLE9BQU87d0JBQ0xZLFlBQVlMLFNBQVNqQixFQUFFO3dCQUN2QkcsUUFBUTs0QkFDTlMsT0FBTztnQ0FBQzs2QkFBWTt3QkFDdEI7b0JBQ0Y7b0JBQ0FDLFNBQVM7d0JBQ1BDLFdBQVc7b0JBQ2I7b0JBQ0FDLFNBQVM7d0JBQ1BDLFNBQVM7b0JBQ1g7b0JBQ0FFLE1BQU07Z0JBQ1I7WUFDRixPQUFPO2dCQUNMWCxXQUFXLEVBQUU7WUFDZjtRQUNGLE9BQU8sSUFBSUYsYUFBYSxTQUFTO1lBQy9CLGlFQUFpRTtZQUNqRUUsV0FBVyxNQUFNWCxtREFBTUEsQ0FBQ1ksT0FBTyxDQUFDQyxRQUFRLENBQUM7Z0JBQ3ZDSSxTQUFTO29CQUNQQyxXQUFXO2dCQUNiO2dCQUNBQyxTQUFTO29CQUNQQyxTQUFTO29CQUNUQyxVQUFVO2dCQUNaO2dCQUNBQyxNQUFNO1lBQ1I7UUFDRixPQUFPO1lBQ0xYLFdBQVcsRUFBRTtRQUNmO1FBRUEsT0FBT2Qsa0ZBQVlBLENBQUNRLElBQUksQ0FBQ007SUFDM0IsRUFBRSxPQUFPTCxPQUFPO1FBQ2RxQixRQUFRckIsS0FBSyxDQUFDLGdDQUFnQ0E7UUFDOUMsT0FBT1Qsa0ZBQVlBLENBQUNRLElBQUksQ0FDdEI7WUFBRUMsT0FBTztRQUF3QixHQUNqQztZQUFFQyxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL3RyaW1zbG90cy8uL3NyYy9hcHAvYXBpL3VzZXIvYXBwb2ludG1lbnRzL3JvdXRlLnRzPzlmOGMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IHsgYXV0aE9wdGlvbnMgfSBmcm9tIFwiQC9saWIvYXV0aFwiO1xuaW1wb3J0IHByaXNtYSBmcm9tIFwiQC9saWIvcHJpc21hXCI7XG5pbXBvcnQgeyBCb29raW5nIH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5cbnR5cGUgQm9va2luZ1dpdGhSZWxhdGlvbnMgPSBCb29raW5nICYge1xuICBzZXJ2aWNlOiB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGR1cmF0aW9uOiBudW1iZXI7XG4gICAgcHJpY2U6IG51bWJlcjtcbiAgfTtcbiAgYnVzaW5lc3M/OiB7XG4gICAgbmFtZTogc3RyaW5nO1xuICB9O1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG5cbiAgICBpZiAoIXNlc3Npb24/LnVzZXI/LmlkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMSB9XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHVzZXJJZCA9IHNlc3Npb24udXNlci5pZDtcbiAgICBjb25zdCB1c2VyUm9sZSA9IHNlc3Npb24udXNlci5yb2xlO1xuICAgIFxuICAgIC8vIERpZmZlcmVudCBxdWVyaWVzIGJhc2VkIG9uIHVzZXIgcm9sZVxuICAgIGxldCBib29raW5nczogQm9va2luZ1dpdGhSZWxhdGlvbnNbXSA9IFtdO1xuICAgIFxuICAgIGlmICh1c2VyUm9sZSA9PT0gXCJDTElFTlRcIikge1xuICAgICAgLy8gRm9yIGNsaWVudHMsIGdldCBib29raW5ncyB3aGVyZSB0aGV5IGFyZSB0aGUgY2xpZW50XG4gICAgICBib29raW5ncyA9IGF3YWl0IHByaXNtYS5ib29raW5nLmZpbmRNYW55KHtcbiAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICBjbGllbnRJZDogdXNlcklkLFxuICAgICAgICAgIHN0YXR1czoge1xuICAgICAgICAgICAgbm90SW46IFtcImNhbmNlbGxlZFwiXVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb3JkZXJCeToge1xuICAgICAgICAgIHN0YXJ0VGltZTogXCJhc2NcIlxuICAgICAgICB9LFxuICAgICAgICBpbmNsdWRlOiB7XG4gICAgICAgICAgc2VydmljZTogdHJ1ZSxcbiAgICAgICAgICBidXNpbmVzczogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB0YWtlOiA1IC8vIExpbWl0IHRvIDUgbW9zdCByZWNlbnQgYm9va2luZ3NcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodXNlclJvbGUgPT09IFwiV09SS0VSXCIpIHtcbiAgICAgIC8vIEZvciB3b3JrZXJzLCBnZXQgYm9va2luZ3MgYXNzaWduZWQgdG8gdGhlbVxuICAgICAgYm9va2luZ3MgPSBhd2FpdCBwcmlzbWEuYm9va2luZy5maW5kTWFueSh7XG4gICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgd29ya2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICBzdGF0dXM6IHtcbiAgICAgICAgICAgIG5vdEluOiBbXCJjYW5jZWxsZWRcIl1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9yZGVyQnk6IHtcbiAgICAgICAgICBzdGFydFRpbWU6IFwiYXNjXCJcbiAgICAgICAgfSxcbiAgICAgICAgaW5jbHVkZToge1xuICAgICAgICAgIHNlcnZpY2U6IHRydWUsXG4gICAgICAgICAgYnVzaW5lc3M6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgdGFrZTogNVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh1c2VyUm9sZSA9PT0gXCJCVVNJTkVTU19PV05FUlwiKSB7XG4gICAgICAvLyBGb3IgYnVzaW5lc3Mgb3duZXJzLCBnZXQgYm9va2luZ3MgZm9yIHRoZWlyIGJ1c2luZXNzXG4gICAgICBjb25zdCBidXNpbmVzcyA9IGF3YWl0IHByaXNtYS5idXNpbmVzcy5maW5kVW5pcXVlKHtcbiAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICBvd25lcklkOiB1c2VySWRcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGlmIChidXNpbmVzcykge1xuICAgICAgICBib29raW5ncyA9IGF3YWl0IHByaXNtYS5ib29raW5nLmZpbmRNYW55KHtcbiAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgYnVzaW5lc3NJZDogYnVzaW5lc3MuaWQsXG4gICAgICAgICAgICBzdGF0dXM6IHtcbiAgICAgICAgICAgICAgbm90SW46IFtcImNhbmNlbGxlZFwiXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3JkZXJCeToge1xuICAgICAgICAgICAgc3RhcnRUaW1lOiBcImFzY1wiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBpbmNsdWRlOiB7XG4gICAgICAgICAgICBzZXJ2aWNlOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0YWtlOiA1XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9va2luZ3MgPSBbXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHVzZXJSb2xlID09PSBcIkFETUlOXCIpIHtcbiAgICAgIC8vIEZvciBhZG1pbnMsIGdldCB0aGUgbW9zdCByZWNlbnQgYm9va2luZ3MgYWNyb3NzIGFsbCBidXNpbmVzc2VzXG4gICAgICBib29raW5ncyA9IGF3YWl0IHByaXNtYS5ib29raW5nLmZpbmRNYW55KHtcbiAgICAgICAgb3JkZXJCeToge1xuICAgICAgICAgIHN0YXJ0VGltZTogXCJhc2NcIlxuICAgICAgICB9LFxuICAgICAgICBpbmNsdWRlOiB7XG4gICAgICAgICAgc2VydmljZTogdHJ1ZSxcbiAgICAgICAgICBidXNpbmVzczogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB0YWtlOiA1XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYm9va2luZ3MgPSBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oYm9va2luZ3MpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyBhcHBvaW50bWVudHM6XCIsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBcIkludGVybmFsIHNlcnZlciBlcnJvclwiIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0U2VydmVyU2Vzc2lvbiIsImF1dGhPcHRpb25zIiwicHJpc21hIiwiR0VUIiwic2Vzc2lvbiIsInVzZXIiLCJpZCIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsInVzZXJJZCIsInVzZXJSb2xlIiwicm9sZSIsImJvb2tpbmdzIiwiYm9va2luZyIsImZpbmRNYW55Iiwid2hlcmUiLCJjbGllbnRJZCIsIm5vdEluIiwib3JkZXJCeSIsInN0YXJ0VGltZSIsImluY2x1ZGUiLCJzZXJ2aWNlIiwiYnVzaW5lc3MiLCJ0YWtlIiwid29ya2VySWQiLCJmaW5kVW5pcXVlIiwib3duZXJJZCIsImJ1c2luZXNzSWQiLCJjb25zb2xlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/user/appointments/route.ts\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/preact-render-to-string","vendor-chunks/uuid","vendor-chunks/@next-auth","vendor-chunks/yallist","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fuser%2Fappointments%2Froute&page=%2Fapi%2Fuser%2Fappointments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fuser%2Fappointments%2Froute.ts&appDir=D%3A%5CTSVWEB%5CTrimSlots%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTSVWEB%5CTrimSlots&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();