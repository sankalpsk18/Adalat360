import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AuthProvider } from "./auth-CzL90GxA.mjs";
import { t as SessionProvider } from "./session-BEQJSY0v.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$15 } from "./cases._caseId-CIWnUyd9.mjs";
import { t as Route$16 } from "./documents._docId-N02e1kRi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B0OR91cM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-C7ck9gGD.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ADALAT360 — Secure Digital Evidence & Records" },
			{
				name: "description",
				content: "Role-based digital document and evidence management prototype with hash-chained custody, versioning and conflict-aware search."
			},
			{
				name: "author",
				content: "ADALAT360"
			},
			{
				property: "og:title",
				content: "ADALAT360 — Secure Digital Evidence & Records"
			},
			{
				property: "og:description",
				content: "Tamper-evident custody chains, version control and conflict-aware case search."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230d1b2a'/%3E%3Cpath d='M18 48L32 14l14 34h-8l-2.6-6.5h-6.8L26 48h-8zm9.3-13.5h9.4L32 23.8l-4.7 10.7z' fill='%23f8fafc'/%3E%3C/svg%3E",
				type: "image/svg+xml"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SessionProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})] }) })
	});
}
var $$splitComponentImporter$13 = () => import("./routes-BhiWzo7T.mjs");
var Route$13 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Sign in — ADALAT360 Evidence & Records" },
		{
			name: "description",
			content: "Secure role-based sign-in for the ADALAT360 digital document and evidence management prototype."
		},
		{
			property: "og:title",
			content: "Sign in — ADALAT360 Evidence & Records"
		},
		{
			property: "og:description",
			content: "Role-based access to hash-chained case records, custody ledgers and conflict-aware search."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("../_app-6U1LBkwD.mjs");
var Route$12 = createFileRoute("/_app")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./admin-CPEE_SzL.mjs");
var Route$11 = createFileRoute("/_app/admin")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./audit-5Xiv_JIh.mjs");
var Route$10 = createFileRoute("/_app/audit")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./certificates-DAQfJLzV.mjs");
var Route$9 = createFileRoute("/_app/certificates")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./dashboard-B4R31Qg6.mjs");
var Route$8 = createFileRoute("/_app/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./exhibits-6krhcwTx.mjs");
var Route$7 = createFileRoute("/_app/exhibits")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./inbox-CnzBKDiR.mjs");
var Route$6 = createFileRoute("/_app/inbox")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./intake-JpR-0Rp6.mjs");
var Route$5 = createFileRoute("/_app/intake")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./ledger-nz58jS3h.mjs");
var Route$4 = createFileRoute("/_app/ledger")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./redaction-C7kcQ-iF.mjs");
var Route$3 = createFileRoute("/_app/redaction")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./search-DVS3Gjfd.mjs");
var Route$2 = createFileRoute("/_app/search")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./signatures-DYbQqfue.mjs");
var Route$1 = createFileRoute("/_app/signatures")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./cases.index-KOG1lb-n.mjs");
var Route = createFileRoute("/_app/cases/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var AppRoute = Route$12.update({
	id: "/_app",
	getParentRoute: () => Route$14
});
var AppAdminRoute = Route$11.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AppRoute
});
var AppAuditRoute = Route$10.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AppRoute
});
var AppCertificatesRoute = Route$9.update({
	id: "/certificates",
	path: "/certificates",
	getParentRoute: () => AppRoute
});
var AppDashboardRoute = Route$8.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppRoute
});
var AppExhibitsRoute = Route$7.update({
	id: "/exhibits",
	path: "/exhibits",
	getParentRoute: () => AppRoute
});
var AppInboxRoute = Route$6.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => AppRoute
});
var AppIntakeRoute = Route$5.update({
	id: "/intake",
	path: "/intake",
	getParentRoute: () => AppRoute
});
var AppLedgerRoute = Route$4.update({
	id: "/ledger",
	path: "/ledger",
	getParentRoute: () => AppRoute
});
var AppRedactionRoute = Route$3.update({
	id: "/redaction",
	path: "/redaction",
	getParentRoute: () => AppRoute
});
var AppSearchRoute = Route$2.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => AppRoute
});
var AppSignaturesRoute = Route$1.update({
	id: "/signatures",
	path: "/signatures",
	getParentRoute: () => AppRoute
});
var AppCasesIndexRoute = Route.update({
	id: "/cases/",
	path: "/cases/",
	getParentRoute: () => AppRoute
});
var AppRouteChildren = {
	AppAdminRoute,
	AppAuditRoute,
	AppCertificatesRoute,
	AppDashboardRoute,
	AppExhibitsRoute,
	AppInboxRoute,
	AppIntakeRoute,
	AppLedgerRoute,
	AppRedactionRoute,
	AppSearchRoute,
	AppSignaturesRoute,
	AppCasesCaseIdRoute: Route$15.update({
		id: "/cases/$caseId",
		path: "/cases/$caseId",
		getParentRoute: () => AppRoute
	}),
	AppDocumentsDocIdRoute: Route$16.update({
		id: "/documents/$docId",
		path: "/documents/$docId",
		getParentRoute: () => AppRoute
	}),
	AppCasesIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren)
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
