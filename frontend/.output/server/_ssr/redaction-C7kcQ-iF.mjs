import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
import { P as EyeOff } from "../_libs/lucide-react.mjs";
import { l as SectionCard, o as PageHeader } from "./primitives-CP5i6y_b.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/redaction-C7kcQ-iF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RedactionPage() {
	const { role } = useAuth();
	const [docId, setDocId] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Redaction",
			subtitle: "Create redacted copies of restricted documents"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4 max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Document ID"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: docId,
					onChange: (e) => setDocId(e.target.value),
					placeholder: "e.g., DOC-1002",
					className: "mt-1 font-mono"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Redaction Reason"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: reason,
					onChange: (e) => setReason(e.target.value),
					placeholder: "Legal basis for redaction (e.g., witness protection, national security)",
					className: "mt-1 min-h-[80px]"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Page"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							placeholder: "1",
							className: "mt-1"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "X Position"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							placeholder: "100",
							className: "mt-1"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Y Position"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							placeholder: "200",
							className: "mt-1"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Width"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							placeholder: "300",
							className: "mt-1"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Height"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							placeholder: "150",
							className: "mt-1"
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }), " Apply Redaction"] })
			]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			title: "Applied Redactions",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Redaction history would appear here."
			})
		})
	] });
}
//#endregion
export { RedactionPage as component };
