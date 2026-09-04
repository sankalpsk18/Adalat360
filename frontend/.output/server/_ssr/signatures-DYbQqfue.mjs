import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
import { t as useApprovals } from "./queries-ci5_guFA.mjs";
import { m as Pen } from "../_libs/lucide-react.mjs";
import { c as RoleBadge, l as SectionCard, o as PageHeader } from "./primitives-CP5i6y_b.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signatures-DYbQqfue.js
var import_jsx_runtime = require_jsx_runtime();
function SignaturesPage() {
	const { role } = useAuth();
	const { data: approvals = [], isLoading } = useApprovals();
	const signatureApprovals = approvals.filter((a) => a.kind === "signature" && a.status === "PENDING");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Sign & Approve",
		subtitle: "Documents and certificates awaiting your signature"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center h-64",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" })
	}) : signatureApprovals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "No pending signature requests."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: signatureApprovals.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "rounded-md border border-border p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: a.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: a.description || "No description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: a.resourceId
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: a.resourceType
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.caseId }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, { role: ROLE_MAP[a.approverRole] || "investigating_officer" })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-4" }), " Sign"] })]
			})
		}, a.id))
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
export { SignaturesPage as component };
