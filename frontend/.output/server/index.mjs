globalThis.__nitro_main__ = import.meta.url;
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx+unenv.mjs";
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-30T13:24:06.026Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-30T13:24:06.040Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/audit-B75lmSQY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1064-yeC8lDadeyvlzAgeOXcfqx8yGJc\"",
		"mtime": "2026-09-04T17:08:23.034Z",
		"size": 4196,
		"path": "../public/assets/audit-B75lmSQY.js"
	},
	"/assets/badge-B18YD_1d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"323-kIN6pUGQYIPj9+b5eXM9cJQJwDg\"",
		"mtime": "2026-09-04T17:08:23.035Z",
		"size": 803,
		"path": "../public/assets/badge-B18YD_1d.js"
	},
	"/assets/button-CsDpB4IB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"531-EmqArOAv2+xx8aGEB+kykaFLfL8\"",
		"mtime": "2026-09-04T17:08:23.041Z",
		"size": 1329,
		"path": "../public/assets/button-CsDpB4IB.js"
	},
	"/assets/cases.index-Df31W5mR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eaf-/KtAgRwduzoo6AGBkoYwSHbNNXA\"",
		"mtime": "2026-09-04T17:08:23.045Z",
		"size": 3759,
		"path": "../public/assets/cases.index-Df31W5mR.js"
	},
	"/assets/cases._caseId-BeXIDxtD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"44eb-Tjnb9FiOBi15MgFLMCJAkHJdySo\"",
		"mtime": "2026-09-04T17:08:23.042Z",
		"size": 17643,
		"path": "../public/assets/cases._caseId-BeXIDxtD.js"
	},
	"/assets/certificates-ZxPAWPiK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1141-NZEN2FnjZbMw0/Hz+Ko3VaO0Hq0\"",
		"mtime": "2026-09-04T17:08:23.046Z",
		"size": 4417,
		"path": "../public/assets/certificates-ZxPAWPiK.js"
	},
	"/assets/dashboard-DaQjxGtM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22ac-U4RU8zC97tBH2+brg66ci5STeXQ\"",
		"mtime": "2026-09-04T17:08:23.061Z",
		"size": 8876,
		"path": "../public/assets/dashboard-DaQjxGtM.js"
	},
	"/assets/client-Bs3cP2BX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4024-3IzyWRGBHJ1fOlX2z+d+Bm4g7JE\"",
		"mtime": "2026-09-04T17:08:23.051Z",
		"size": 16420,
		"path": "../public/assets/client-Bs3cP2BX.js"
	},
	"/assets/dist-B95VnJFx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1183e-THosVIusnWqgvj7OJzCC1QnhS3M\"",
		"mtime": "2026-09-04T17:08:23.063Z",
		"size": 71742,
		"path": "../public/assets/dist-B95VnJFx.js"
	},
	"/assets/admin-DuzaaagF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ee8-snPXZrC7lODxvbSpvbrRcGL09TM\"",
		"mtime": "2026-09-04T17:08:23.033Z",
		"size": 3816,
		"path": "../public/assets/admin-DuzaaagF.js"
	},
	"/assets/download-Boy5O_6d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-cdJl9a4PqsvoYbl3kD4Cimk+iFU\"",
		"mtime": "2026-09-04T17:08:23.082Z",
		"size": 220,
		"path": "../public/assets/download-Boy5O_6d.js"
	},
	"/assets/dist-BFB1ygzC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c78-PhAXptWFMIiEwB5FXKIaOykSGz8\"",
		"mtime": "2026-09-04T17:08:23.069Z",
		"size": 7288,
		"path": "../public/assets/dist-BFB1ygzC.js"
	},
	"/assets/dist-JSzU-Y48.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"280-EsOExsflGLkQXmBWrPCXLHxClec\"",
		"mtime": "2026-09-04T17:08:23.077Z",
		"size": 640,
		"path": "../public/assets/dist-JSzU-Y48.js"
	},
	"/assets/documents._docId-EF_FqMDK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bf8-W61+g2tLbQskVElYTaZ7HY6SUr8\"",
		"mtime": "2026-09-04T17:08:23.078Z",
		"size": 3064,
		"path": "../public/assets/documents._docId-EF_FqMDK.js"
	},
	"/assets/eye-off-QvBFDVkv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a2-9KEyT3L8n2HwDBn6YSewDtdZheI\"",
		"mtime": "2026-09-04T17:08:23.146Z",
		"size": 418,
		"path": "../public/assets/eye-off-QvBFDVkv.js"
	},
	"/assets/exhibits-ntLAyPrs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bdd-OzK2uKgTD9XI9Z0MQmnMIm7XgTA\"",
		"mtime": "2026-09-04T17:08:23.133Z",
		"size": 3037,
		"path": "../public/assets/exhibits-ntLAyPrs.js"
	},
	"/assets/file-stack-Cl2RWwfX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"169-RMLxSHzVbSCBWHvewdPyhpBV3zE\"",
		"mtime": "2026-09-04T17:08:23.148Z",
		"size": 361,
		"path": "../public/assets/file-stack-Cl2RWwfX.js"
	},
	"/assets/file-text-TZ3JkfVD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"175-FLiX5KLYG3GHd2Egvru9Scc4Bwc\"",
		"mtime": "2026-09-04T17:08:23.169Z",
		"size": 373,
		"path": "../public/assets/file-text-TZ3JkfVD.js"
	},
	"/assets/file-pen-line-D77Ogowg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c5-5zfdtYNB4uvslsFW6CmrJ+mCQU4\"",
		"mtime": "2026-09-04T17:08:23.147Z",
		"size": 453,
		"path": "../public/assets/file-pen-line-D77Ogowg.js"
	},
	"/assets/folder-open-DZIDiREi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118-puuP5V6oRXkDkUICNR1FtDRo9+4\"",
		"mtime": "2026-09-04T17:08:23.170Z",
		"size": 280,
		"path": "../public/assets/folder-open-DZIDiREi.js"
	},
	"/assets/inbox-D_q8Jc3D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ff6-hN5uLodXDTEwzq5XHcjQZUO+B5w\"",
		"mtime": "2026-09-04T17:08:23.175Z",
		"size": 4086,
		"path": "../public/assets/inbox-D_q8Jc3D.js"
	},
	"/assets/input-CdWZXO9W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"267-sR06eZhudPLYkMPvJ6w9n/Z5TUI\"",
		"mtime": "2026-09-04T17:08:23.188Z",
		"size": 615,
		"path": "../public/assets/input-CdWZXO9W.js"
	},
	"/assets/index-Cr-HE5Ng.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a7a0-4ToEjt/blZZBUyHURnW+Bh9Wdr0\"",
		"mtime": "2026-09-04T17:08:23.030Z",
		"size": 305056,
		"path": "../public/assets/index-Cr-HE5Ng.js"
	},
	"/assets/intake-BAUAGz2f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1162-Lp1jm2GUEtoVmVGVzznbu7Yvjy8\"",
		"mtime": "2026-09-04T17:08:23.197Z",
		"size": 4450,
		"path": "../public/assets/intake-BAUAGz2f.js"
	},
	"/assets/label-Bkym57aI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a7-M29aklbOzkC8oiwV7mSRY523aZ8\"",
		"mtime": "2026-09-04T17:08:23.213Z",
		"size": 679,
		"path": "../public/assets/label-Bkym57aI.js"
	},
	"/assets/landmark-BXKtBB63.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"184-2bUPNYJl/xJXRcFfK260UHBefuE\"",
		"mtime": "2026-09-04T17:08:23.215Z",
		"size": 388,
		"path": "../public/assets/landmark-BXKtBB63.js"
	},
	"/assets/ledger-CANhAA7W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"515-CSLHgVozIME9A/gBzg9hEMLY8II\"",
		"mtime": "2026-09-04T17:08:23.217Z",
		"size": 1301,
		"path": "../public/assets/ledger-CANhAA7W.js"
	},
	"/assets/link-6GAAvDuH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5afa-3azPA7mkJ45QQ5ZnHCaxy7Seky0\"",
		"mtime": "2026-09-04T17:08:23.219Z",
		"size": 23290,
		"path": "../public/assets/link-6GAAvDuH.js"
	},
	"/assets/Match-DPpIcYtu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bdf8-7THqNwqAfaQhkPupACCs5u2CVzE\"",
		"mtime": "2026-09-04T17:08:23.031Z",
		"size": 48632,
		"path": "../public/assets/Match-DPpIcYtu.js"
	},
	"/assets/primitives-CFZwjOj_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b47-TZx/XdLgww68PcGS+GuuUnUmGIs\"",
		"mtime": "2026-09-04T17:08:23.219Z",
		"size": 15175,
		"path": "../public/assets/primitives-CFZwjOj_.js"
	},
	"/assets/queries-CK1xJf42.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"265e-gL3EO21Pw8Na2/1zBZ1uIA79svE\"",
		"mtime": "2026-09-04T17:08:23.220Z",
		"size": 9822,
		"path": "../public/assets/queries-CK1xJf42.js"
	},
	"/assets/routes-BE8xJW07.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f0c-bVkYJUIgq7FCdB4aW9LmPz8gTIo\"",
		"mtime": "2026-09-04T17:08:23.226Z",
		"size": 3852,
		"path": "../public/assets/routes-BE8xJW07.js"
	},
	"/assets/redaction-Bo4wLl5P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"89e-VAQNYsMCE/pyCxBxCxlyUZxKIdg\"",
		"mtime": "2026-09-04T17:08:23.225Z",
		"size": 2206,
		"path": "../public/assets/redaction-Bo4wLl5P.js"
	},
	"/assets/scroll-text-VmTVsL1D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"151-n+lchvCmDuVbEVrXt7ABgM+UfDw\"",
		"mtime": "2026-09-04T17:08:23.227Z",
		"size": 337,
		"path": "../public/assets/scroll-text-VmTVsL1D.js"
	},
	"/assets/search-C-5E428q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"888-YHEfqrsepGGCHSseyuRylu/BBtw\"",
		"mtime": "2026-09-04T17:08:23.228Z",
		"size": 2184,
		"path": "../public/assets/search-C-5E428q.js"
	},
	"/assets/search-D7-CLzgn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2-Fcp6iISmgRpcTNS9E9DdT1wDGrU\"",
		"mtime": "2026-09-04T17:08:23.228Z",
		"size": 162,
		"path": "../public/assets/search-D7-CLzgn.js"
	},
	"/assets/textarea-DgjmIMma.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"201-dKyDZGRoLEWy5fznafYORkp0p7A\"",
		"mtime": "2026-09-04T17:08:23.232Z",
		"size": 513,
		"path": "../public/assets/textarea-DgjmIMma.js"
	},
	"/assets/signatures-Ck92bb3g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ee-mp09tGWVO6VfD+fVZXrupLGEQb4\"",
		"mtime": "2026-09-04T17:08:23.231Z",
		"size": 2030,
		"path": "../public/assets/signatures-Ck92bb3g.js"
	},
	"/assets/triangle-alert-Bbkxq7a4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fd-bxS6G1z44pmI4oNHh8TjN7g8n5A\"",
		"mtime": "2026-09-04T17:08:23.232Z",
		"size": 253,
		"path": "../public/assets/triangle-alert-Bbkxq7a4.js"
	},
	"/assets/upload-RW-vZvRc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"da-foHA4rGbqf7jR+Mit2Ya3RFRHcQ\"",
		"mtime": "2026-09-04T17:08:23.233Z",
		"size": 218,
		"path": "../public/assets/upload-RW-vZvRc.js"
	},
	"/assets/select-BLT62Dol.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"986a-+AjtKFTtSJovM/4ksiAgFVJHW1k\"",
		"mtime": "2026-09-04T17:08:23.230Z",
		"size": 39018,
		"path": "../public/assets/select-BLT62Dol.js"
	},
	"/assets/styles-C7ck9gGD.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"13c4d-k51g8gUOtslgQa7OjTLH/JUVTgM\"",
		"mtime": "2026-09-04T17:08:23.246Z",
		"size": 80973,
		"path": "../public/assets/styles-C7ck9gGD.css"
	},
	"/assets/x-BxlrDBxp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-irrK04d1ftaF/fWrVAiDkZhwW1A\"",
		"mtime": "2026-09-04T17:08:23.243Z",
		"size": 142,
		"path": "../public/assets/x-BxlrDBxp.js"
	},
	"/assets/useMatch-IYcUhU7d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"49c-T6q+NKGkOe4HojV8oKwiBQuuJ58\"",
		"mtime": "2026-09-04T17:08:23.234Z",
		"size": 1180,
		"path": "../public/assets/useMatch-IYcUhU7d.js"
	},
	"/assets/useMutation-q0H9vfNV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"91d-FMm3KXbfK9wLW33CuVobcIJjZ6k\"",
		"mtime": "2026-09-04T17:08:23.234Z",
		"size": 2333,
		"path": "../public/assets/useMutation-q0H9vfNV.js"
	},
	"/assets/useRouter-CS_ZZHNd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92-n8pUjr8K0NFxmkrcYpsEfAAz33Y\"",
		"mtime": "2026-09-04T17:08:23.238Z",
		"size": 146,
		"path": "../public/assets/useRouter-CS_ZZHNd.js"
	},
	"/assets/user-cog-JmeOhGRr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"279-AMyVvq/x6Xa5d/EuaVPJxNmLMMg\"",
		"mtime": "2026-09-04T17:08:23.242Z",
		"size": 633,
		"path": "../public/assets/user-cog-JmeOhGRr.js"
	},
	"/assets/_app-DW6TDj8B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3996-L7Jddog3Cp4q6dUaOvXmSr3jIhg\"",
		"mtime": "2026-09-04T17:08:23.032Z",
		"size": 14742,
		"path": "../public/assets/_app-DW6TDj8B.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_KOp3Ga = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_KOp3Ga
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
