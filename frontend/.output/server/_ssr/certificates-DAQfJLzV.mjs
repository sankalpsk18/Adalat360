import { n as __toESM } from "../_runtime.mjs";
import { o as certificatesApi } from "./client-CFyrzEWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useSession } from "./session-BEQJSY0v.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { l as useDocuments } from "./queries-ci5_guFA.mjs";
import { O as FileText } from "../_libs/lucide-react.mjs";
import { l as SectionCard, o as PageHeader } from "./primitives-CP5i6y_b.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/certificates-DAQfJLzV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CertificatesPage() {
	const { activeCaseId, name } = useSession();
	const { data: documents = [] } = useDocuments(activeCaseId);
	const [selectedId, setSelectedId] = (0, import_react.useState)("");
	const selectedDocument = documents.find((document) => document.id === selectedId);
	const queryClient = useQueryClient();
	const generateMutation = useMutation({
		mutationFn: (docId) => certificatesApi.generate(docId),
		onSuccess: () => {
			toast.success("Certificate generated");
			queryClient.invalidateQueries({ queryKey: ["certificates"] });
		},
		onError: (error) => toast.error(error.message || "Failed to generate")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "BSA §63 Certificates",
		subtitle: "Generate and manage Section 65B certificates for electronic records"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			title: "Generate Certificate",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-xl space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Select an evidence item to generate a BSA §63 certificate for electronic record admissibility."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-medium",
						children: ["Select Evidence Item", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
							value: selectedId,
							onChange: (event) => setSelectedId(event.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select document..."
							}), documents.map((document) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: document.id,
								children: [
									document.filename,
									" (",
									document.caseId,
									")"
								]
							}, document.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-medium",
						children: ["Authorized Officer", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-1 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm",
							value: name,
							readOnly: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-medium",
						children: ["Technical Expert (if required)", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select expert..."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "FSL",
								children: "Forensic Analyst (FSL)"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => selectedId && generateMutation.mutate(selectedId),
						disabled: !selectedId || generateMutation.isPending,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }),
							" ",
							generateMutation.isPending ? "Generating..." : "Generate Section 63 Certificate Draft"
						]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			title: "Certificate Preview",
			children: selectedDocument ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border bg-card p-5 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-center text-lg font-semibold uppercase tracking-widest",
						children: "Certificate under Section 63"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-5 text-center text-xs text-muted-foreground",
						children: "Bharatiya Sakshya Adhiniyam, 2023"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateRow, {
								label: "Case ID",
								value: selectedDocument.caseId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateRow, {
								label: "Document ID",
								value: selectedDocument.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateRow, {
								label: "Document Name",
								value: selectedDocument.filename
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateRow, {
								label: "Document Type",
								value: selectedDocument.docType
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateRow, {
								label: "SHA-256 Hash",
								value: selectedDocument.sha256Hash,
								mono: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateRow, {
								label: "Uploaded By",
								value: selectedDocument.uploader?.name || name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateRow, {
								label: "Timestamp",
								value: selectedDocument.uploadedAt ? new Date(selectedDocument.uploadedAt).toLocaleString() : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateRow, {
								label: "Custody Ref",
								value: `LEDGER-${selectedDocument.id}-001`,
								mono: true
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-5 border-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm leading-6",
						children: [
							"I hereby certify that the above electronic record was produced from the custody of ",
							selectedDocument.docType,
							" records and that the hash value matches the original at the time of capture. The record has not been altered since upload as verified by the tamper-evident custody ledger."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid grid-cols-2 gap-6 text-center text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-2 border-b border-foreground" }), "Authorized Officer"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-2 border-b border-foreground" }), "Technical Expert (if applicable)"] })]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-sm text-muted-foreground",
				children: "Select an evidence item to preview the BSA §63 certificate draft."
			})
		})]
	})] });
}
function CertificateRow({ label, value, mono = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-semibold",
			children: [label, ":"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: mono ? "font-mono text-xs" : "text-right",
			children: value
		})]
	});
}
//#endregion
export { CertificatesPage as component };
