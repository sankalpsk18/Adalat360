import { m as systemApi } from "./client-CFyrzEWy.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { d as useSystemHealth, f as useSystemStats } from "./queries-ci5_guFA.mjs";
import { I as Database, c as ShieldCheck, n as Wrench, r as UserCog } from "../_libs/lucide-react.mjs";
import { l as SectionCard, o as PageHeader } from "./primitives-CP5i6y_b.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CPEE_SzL.js
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { role } = useAuth();
	const { data: health } = useSystemHealth();
	const { data: stats } = useSystemStats();
	const seedMutation = useMutation({
		mutationFn: () => systemApi.seed(),
		onSuccess: () => toast.success("Database seeded"),
		onError: (error) => toast.error(error.message || "Seed failed")
	});
	const integrityMutation = useMutation({
		mutationFn: () => systemApi.integrityCheck("CR-2026-0417"),
		onSuccess: (data) => toast.success(`Integrity check: ${data.verified}/${data.totalDocuments} verified`),
		onError: (error) => toast.error(error.message || "Check failed")
	});
	const llmMutation = useMutation({
		mutationFn: () => systemApi.llmUsage(),
		onSuccess: (data) => toast.success(`LLM Usage: ${JSON.stringify(data.usage)}`),
		onError: (error) => toast.error(error.message || "Failed")
	});
	if (role !== "system_admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "size-12 text-muted-foreground/50" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-lg font-medium",
				children: "Access Denied"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "System Administrator role required."
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Admin Panel",
		subtitle: "System administration and monitoring"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 sm:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				title: "System Health",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-verified",
								children: health?.status || "unknown"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Service"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs",
								children: health?.service || "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Version"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs",
								children: health?.version || "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Timestamp"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs",
								children: health?.timestamp || "—"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				title: "Statistics",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 text-sm",
					children: stats?.stats && Object.entries(stats.stats).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: key
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: JSON.stringify(value)
						})]
					}, key))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				title: "Actions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => seedMutation.mutate(),
							disabled: seedMutation.isPending,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "size-4" }),
								" ",
								seedMutation.isPending ? "Seeding..." : "Seed Database"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => integrityMutation.mutate(),
							disabled: integrityMutation.isPending,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }),
								" ",
								integrityMutation.isPending ? "Checking..." : "Run Integrity Check"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => llmMutation.mutate(),
							disabled: llmMutation.isPending,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4" }),
								" ",
								llmMutation.isPending ? "Loading..." : "LLM Usage"
							]
						})
					]
				})
			})
		]
	})] });
}
//#endregion
export { AdminPage as component };
