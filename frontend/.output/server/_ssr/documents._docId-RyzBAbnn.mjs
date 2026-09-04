import { n as __toESM } from "../_runtime.mjs";
import { l as documentsApi } from "./client-CFyrzEWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as useDocumentVersions, o as useCustody, s as useDocument } from "./queries-ci5_guFA.mjs";
import { F as Download, c as ShieldCheck } from "../_libs/lucide-react.mjs";
import { a as IntegrityBadge, d as fmtDate, i as HashChip, l as SectionCard, o as PageHeader } from "./primitives-CP5i6y_b.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./documents._docId-N02e1kRi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents._docId-RyzBAbnn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DocumentDetail() {
	const { docId } = Route.useParams();
	const { data, isLoading } = useDocument(docId);
	const { data: versionData } = useDocumentVersions(docId);
	const { data: custody = [] } = useCustody(docId);
	const [downloadError, setDownloadError] = (0, import_react.useState)("");
	const document = data?.document;
	const custodyEntries = Array.isArray(custody) ? custody : [];
	const download = async () => {
		setDownloadError("");
		const response = await documentsApi.download(docId);
		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: "Download failed" }));
			setDownloadError(error.error || "Download failed");
			return;
		}
		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		const anchor = window.document.createElement("a");
		anchor.href = url;
		anchor.download = document?.filename || "document";
		anchor.click();
		URL.revokeObjectURL(url);
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading document…"
	});
	if (!document) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
		title: "Document not found",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "This document is unavailable to your account."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: document.filename,
			subtitle: `${document.docType} · uploaded ${fmtDate(document.uploadedAt)}`,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: download,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download"]
			})
		}),
		downloadError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-destructive",
			children: downloadError
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				title: "Integrity",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntegrityBadge, { state: document.integrity }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "SHA-256"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, {
							hash: document.sha256Hash,
							className: "max-w-full"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "The server verifies this hash after decrypting the vault file before download."
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				title: "Version history",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-sm",
					children: (versionData?.versions || []).map((version) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between border-b border-border/60 pb-2 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/documents/$docId",
							params: { docId: version.id },
							className: "hover:underline",
							children: ["Version ", version.version]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[11px] text-muted-foreground",
							children: [version.sha256Hash.slice(0, 12), "…"]
						})]
					}, version.id))
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
			title: `Custody events (${custodyEntries.length})`,
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-sm",
				children: custodyEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-2 border-b border-border/60 pb-2 last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-verified" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: entry.action
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: entry.actor?.name || entry.actorId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto font-mono text-[11px] text-muted-foreground",
							children: fmtDate(entry.timestamp)
						})
					]
				}, entry.id))
			})
		})
	] });
}
//#endregion
export { DocumentDetail as component };
