import { f as roleMeta } from "./client-CFyrzEWy.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
import { a as useCases } from "./queries-ci5_guFA.mjs";
import { E as FolderOpen, k as FileStack } from "../_libs/lucide-react.mjs";
import { c as RoleBadge, d as fmtDate, l as SectionCard, o as PageHeader } from "./primitives-CP5i6y_b.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases.index-KOG1lb-n.js
var import_jsx_runtime = require_jsx_runtime();
var statusLabel = {
	OPEN: "Open",
	UNDER_INVESTIGATION: "Under investigation",
	CHARGESHEET_FILED: "Charge sheet filed",
	IN_COURT: "In court",
	CLOSED: "Closed"
};
function CasesIndex() {
	const { role, name } = useAuth();
	const { data: cases = [], isLoading } = useCases(role);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center h-64",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "All Cases",
		subtitle: `${cases.length} cases visible to ${roleMeta(role).short}`,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/intake",
			className: "inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileStack, { className: "size-4" }), " New Case"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, { children: cases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "size-12 text-muted-foreground/50" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-lg font-medium",
				children: "No cases found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Cases will appear here once created or assigned to your role."
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-1.5 pr-3 font-medium",
						children: "Case ID"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-1.5 pr-3 font-medium",
						children: "Title"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-1.5 pr-3 font-medium",
						children: "Department"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-1.5 pr-3 font-medium",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-1.5 pr-3 font-medium",
						children: "Priority"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-1.5 pr-3 font-medium",
						children: "Officers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-1.5 font-medium",
						children: "Last activity"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border/60 last:border-0 hover:bg-muted/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-1.5 pr-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cases/$caseId",
							params: { caseId: c.id },
							className: "font-mono text-xs underline-offset-2 hover:underline",
							children: c.id
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "max-w-[22rem] truncate py-1.5 pr-3",
						children: c.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-1.5 pr-3 text-xs text-muted-foreground",
						children: c.department
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-1.5 pr-3 text-xs",
						children: statusLabel[c.status] || c.status
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-1.5 pr-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: c.priorityLabel === "HIGH" ? "border-destructive/40 text-destructive" : c.priorityLabel === "MEDIUM" ? "border-amber/50 text-amber" : "text-muted-foreground",
							children: c.priorityLabel
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-1.5 pr-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: c.officers?.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: o.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, { role: ROLE_MAP[o.role] || "investigating_officer" })]
							}, o.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "font-mono py-1.5 text-[11px] text-muted-foreground",
						children: fmtDate(c.lastActivityAt)
					})
				]
			}, c.id)) })]
		})
	}) })] });
}
var ROLE_MAP = {
	IO: "investigating_officer",
	REC: "records_section",
	FSL: "forensic_analyst",
	PP: "prosecutor",
	CRT: "judge",
	SYS: "system_admin"
};
//#endregion
export { CasesIndex as component };
