import { n as __toESM } from "../_runtime.mjs";
import { a as casesApi, l as documentsApi } from "./client-CFyrzEWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useCases } from "./queries-ci5_guFA.mjs";
import { i as Upload } from "../_libs/lucide-react.mjs";
import { l as SectionCard, o as PageHeader } from "./primitives-CP5i6y_b.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intake-JpR-0Rp6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Intake() {
	const { role, user } = useAuth();
	const { data: cases = [] } = useCases(role);
	const [mode, setMode] = (0, import_react.useState)("existing");
	const [caseId, setCaseId] = (0, import_react.useState)("");
	const [caseNumber, setCaseNumber] = (0, import_react.useState)("");
	const [caseTitle, setCaseTitle] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	const [docType, setDocType] = (0, import_react.useState)("FIR");
	const [file, setFile] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const intakeMutation = useMutation({
		mutationFn: async () => {
			let targetCaseId = caseId;
			if (mode === "new") {
				if (!caseNumber.trim() || !caseTitle.trim()) throw new Error("Case number and title are required");
				targetCaseId = (await casesApi.create({
					caseNumber: caseNumber.trim(),
					title: caseTitle.trim(),
					department: user?.department || "City Police — Crime Branch"
				})).case.id;
			}
			if (!targetCaseId) throw new Error("Please select a case");
			if (!file) return { caseOnly: true };
			return documentsApi.upload(file, targetCaseId, title, docType);
		},
		onSuccess: () => {
			toast.success(mode === "new" && !file ? "Case created successfully" : "Document uploaded successfully");
			setFile(null);
			setTitle("");
			setCaseNumber("");
			setCaseTitle("");
		},
		onError: (error) => {
			toast.error(error.message || "Upload failed");
		}
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		if (mode === "existing" && (!caseId || !file)) {
			toast.error("Please select an existing case and file");
			return;
		}
		intakeMutation.mutate();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Intake / Upload",
		subtitle: "Upload new documents to a case"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "space-y-4 max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 rounded-lg bg-muted p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: mode === "existing" ? "default" : "ghost",
					className: "flex-1",
					onClick: () => setMode("existing"),
					children: "Upload to existing case"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: mode === "new" ? "default" : "ghost",
					className: "flex-1",
					onClick: () => setMode("new"),
					children: "Add new case"
				})]
			}),
			mode === "new" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Case Number"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: caseNumber,
					onChange: (e) => setCaseNumber(e.target.value),
					placeholder: "CR-2026-0450",
					className: "mt-1"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Case Title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: caseTitle,
					onChange: (e) => setCaseTitle(e.target.value),
					placeholder: "Brief case title",
					className: "mt-1"
				})] })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Select Case"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: caseId,
					onValueChange: setCaseId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose a case" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: cases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "none",
						disabled: true,
						children: "No cases available"
					}) : cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: c.id,
						children: [
							c.id,
							" — ",
							c.title
						]
					}, c.id)) })]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Document Type"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: docType,
					onValueChange: setDocType,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "FIR",
							children: "FIR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "CHARGE_SHEET",
							children: "Charge Sheet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "WITNESS_STATEMENT",
							children: "Witness Statement"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "COURT_FILING",
							children: "Court Filing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "JUDGMENT",
							children: "Judgment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "FORENSIC_REPORT",
							children: "Forensic Report"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "DEVICE_EXTRACT",
							children: "Device Extract"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "PHOTO",
							children: "Photo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "VIDEO",
							children: "Video"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "AUDIO",
							children: "Audio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "LEGAL_NOTICE",
							children: "Legal Notice"
						})
					] })]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Title (optional)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: title,
				onChange: (e) => setTitle(e.target.value),
				placeholder: "Document title",
				className: "mt-1"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "File"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "file",
					onChange: (e) => setFile(e.target.files?.[0] || null),
					className: "mt-1",
					disabled: isLoading || intakeMutation.isPending
				}),
				file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						file.name,
						" (",
						(file.size / 1024 / 1024).toFixed(2),
						" MB)"
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled: isLoading || intakeMutation.isPending,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
					" ",
					isLoading || intakeMutation.isPending ? "Saving..." : mode === "new" && !file ? "Create Case" : "Upload Document"
				]
			})
		]
	}) })] });
}
//#endregion
export { Intake as component };
