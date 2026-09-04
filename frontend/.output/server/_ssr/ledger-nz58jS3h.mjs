import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
import { i as useCaseCustody } from "./queries-ci5_guFA.mjs";
import { l as SectionCard, n as CustodyEventRow, o as PageHeader } from "./primitives-CP5i6y_b.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ledger-nz58jS3h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Ledger() {
	const { role } = useAuth();
	const [filterCaseId, setFilterCaseId] = (0, import_react.useState)("");
	const { data: custody = [], isLoading } = useCaseCustody(filterCaseId || "CR-2026-0417");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Custody Ledger",
			subtitle: "Hash-chained custody trail for all documents"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Filter by Case"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: filterCaseId,
						onChange: (e) => setFilterCaseId(e.target.value),
						placeholder: "Case ID (e.g., CR-2026-0417)",
						className: "mt-1 font-mono text-sm"
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center h-64",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" })
		}) : custody.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No custody entries found."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "relative",
			children: custody.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustodyEventRow, {
				event: e,
				last: i === custody.length - 1
			}, e.id))
		}) })
	] });
}
//#endregion
export { Ledger as component };
