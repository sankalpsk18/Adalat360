import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
import { u as useExhibits } from "./queries-ci5_guFA.mjs";
import { p as Plus } from "../_libs/lucide-react.mjs";
import { i as HashChip, l as SectionCard, o as PageHeader } from "./primitives-CP5i6y_b.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exhibits-6krhcwTx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExhibitsPage() {
	const { role } = useAuth();
	const [caseId, setCaseId] = (0, import_react.useState)("CR-2026-0417");
	const { data: exhibits = [], isLoading } = useExhibits(caseId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Exhibit Register",
			subtitle: "Physical evidence and exhibit management",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Register Exhibit"] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 max-w-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Filter by Case"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: caseId,
						onChange: (e) => setCaseId(e.target.value),
						placeholder: "Case ID",
						className: "mt-1 font-mono text-sm"
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center h-64",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" })
		}) : exhibits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No exhibits registered for this case."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1.5 pr-3 font-medium",
							children: "Code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1.5 pr-3 font-medium",
							children: "Label"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1.5 pr-3 font-medium",
							children: "Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1.5 pr-3 font-medium",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1.5 pr-3 font-medium",
							children: "Location"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1.5 pr-3 font-medium",
							children: "Holder"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1.5 font-medium",
							children: "Seal"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: exhibits.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/60 last:border-0 hover:bg-muted/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1.5 pr-3 font-mono text-xs",
							children: e.exhibitCode
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1.5 pr-3",
							children: e.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1.5 pr-3 text-xs text-muted-foreground",
							children: e.category?.replace("_", " ") || e.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1.5 pr-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-xs",
								children: e.status?.replace("_", " ") || e.status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1.5 pr-3 text-sm",
							children: e.location
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1.5 pr-3 text-sm",
							children: e.holder
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1.5 pr-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, { hash: e.sealHash })
						})
					]
				}, e.id)) })]
			})
		}) })
	] });
}
//#endregion
export { ExhibitsPage as component };
