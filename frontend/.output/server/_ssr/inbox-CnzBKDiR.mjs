import { n as __toESM } from "../_runtime.mjs";
import { n as approvalsApi } from "./client-CFyrzEWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as useApprovals } from "./queries-ci5_guFA.mjs";
import { B as Check, _ as Mail, a as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { c as RoleBadge, d as fmtDate, l as SectionCard, o as PageHeader } from "./primitives-CP5i6y_b.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inbox-CnzBKDiR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InboxPage() {
	const { role } = useAuth();
	const queryClient = useQueryClient();
	const { data: approvals = [], isLoading, refetch } = useApprovals({ status: "PENDING" });
	useMutation({
		mutationFn: ({ id, decision, notes }) => approvalsApi.decide(id, decision, notes),
		onSuccess: () => {
			toast.success("Decision recorded");
			queryClient.invalidateQueries({ queryKey: ["approvals"] });
		},
		onError: (error) => toast.error(error.message || "Failed to decide")
	});
	const pending = approvals.filter((a) => a.status === "PENDING");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Approvals Inbox",
		subtitle: `${pending.length} pending requests`
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center h-64",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" })
	}) : pending.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-12 text-muted-foreground/50" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-lg font-medium",
				children: "Inbox empty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "No pending approval requests."
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: pending.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-border p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: a.title
								}),
								a.severity === "CRITICAL" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 text-destructive" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-xs",
									children: a.kind
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-xs",
									children: a.resourceType
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, { role: ROLE_MAP[a.approverRole] || "investigating_officer" })
							]
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.caseId }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Requested by: ", a.requester?.name || "Unknown"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtDate(a.createdAt) })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalActions, {
					approval: a,
					onDecide: () => refetch()
				})]
			})
		}, a.id))
	}) })] });
}
function ApprovalActions({ approval, onDecide }) {
	const [showReject, setShowReject] = (0, import_react.useState)(false);
	const [notes, setNotes] = (0, import_react.useState)("");
	const queryClient = useQueryClient();
	const decideMutation = useMutation({
		mutationFn: (decision) => approvalsApi.decide(approval.id, decision, notes),
		onSuccess: () => {
			toast.success(`Approval ${decision === "APPROVED" ? "granted" : "rejected"}`);
			queryClient.invalidateQueries({ queryKey: ["approvals"] });
			onDecide();
		},
		onError: (error) => toast.error(error.message || "Failed")
	});
	if (showReject) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: notes,
				onChange: (e) => setNotes(e.target.value),
				placeholder: "Rejection reason (required)",
				className: "w-64 min-h-[60px]",
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "destructive",
				size: "sm",
				onClick: () => decideMutation.mutate("REJECTED"),
				disabled: !notes.trim() || decideMutation.isPending,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" }), " Reject"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => setShowReject(false),
				children: "Cancel"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: () => decideMutation.mutate("APPROVED"),
			disabled: decideMutation.isPending,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }), " Approve"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			onClick: () => setShowReject(true),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" }), " Reject"]
		})]
	});
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
export { InboxPage as component };
