import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as useCaseCustody, l as useDocuments, r as useCase, t as useApprovals, u as useExhibits } from "./queries-ci5_guFA.mjs";
import { A as FilePlay, C as HardDrive, D as FlaskConical, M as FileImage, N as FileHeadphone, O as FileText, d as ScrollText, f as Scale, w as Gavel } from "../_libs/lucide-react.mjs";
import { a as IntegrityBadge, c as RoleBadge, d as fmtDate, i as HashChip, l as SectionCard, n as CustodyEventRow, o as PageHeader, s as RestrictedTag, u as VersionPill } from "./primitives-CP5i6y_b.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./cases._caseId-CIWnUyd9.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases._caseId-DeMjEcs1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var typeIcon = {
	FIR: FileText,
	CHARGE_SHEET: ScrollText,
	WITNESS_STATEMENT: FileText,
	COURT_FILING: Scale,
	JUDGMENT: Gavel,
	LEGAL_NOTICE: ScrollText,
	PHOTO: FileImage,
	VIDEO: FilePlay,
	AUDIO: FileHeadphone,
	FORENSIC_REPORT: FlaskConical,
	DEVICE_EXTRACT: HardDrive
};
var typeLabel = {
	FIR: "FIR",
	CHARGE_SHEET: "Charge sheet",
	WITNESS_STATEMENT: "Witness statement",
	COURT_FILING: "Court filing",
	JUDGMENT: "Judgment",
	LEGAL_NOTICE: "Legal notice",
	PHOTO: "Photograph",
	VIDEO: "Video",
	AUDIO: "Audio",
	FORENSIC_REPORT: "Forensic report",
	DEVICE_EXTRACT: "Device extract"
};
var statusLabel = {
	OPEN: "Open",
	UNDER_INVESTIGATION: "Under investigation",
	CHARGESHEET_FILED: "Charge sheet filed",
	IN_COURT: "In court",
	CLOSED: "Closed"
};
var ROLE_MAP = {
	IO: "investigating_officer",
	REC: "records_section",
	FSL: "forensic_analyst",
	PP: "prosecutor",
	CRT: "judge",
	SYS: "system_admin"
};
function CaseDetail() {
	const { caseId } = Route.useParams();
	const { role } = useAuth();
	const { data: caseData, isLoading: caseLoading } = useCase(caseId);
	const { data: docs = [], isLoading: docsLoading } = useDocuments(caseId);
	const { data: exhibits = [], isLoading: exhibitsLoading } = useExhibits(caseId);
	const { data: custody = [], isLoading: custodyLoading } = useCaseCustody(caseId);
	const { data: approvals = [] } = useApprovals();
	if (caseLoading || docsLoading || exhibitsLoading || custodyLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center h-64",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" })
	});
	if (!caseData?.case) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
		title: "Case not found",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [
				"No case with identifier ",
				caseId,
				" is available to this role."
			]
		})
	});
	const c = caseData.case;
	const pendingApprovals = approvals.filter((a) => a.caseId === caseId && a.status === "PENDING");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: c.title,
			subtitle: `${c.department} · opened ${fmtDate(c.createdAt)}`,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono rounded border border-border bg-surface px-2 py-1 text-xs",
					children: c.id
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestrictedTag, { label: c.priorityLabel === "HIGH" ? "High priority" : "Access controlled" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-2 rounded-lg border border-border bg-surface p-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-wide text-muted-foreground",
					children: "Status"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: statusLabel[c.status] || c.status
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-wide text-muted-foreground",
					children: "Priority"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: c.priorityLabel
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-wide text-muted-foreground",
					children: "Last activity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-sm",
					children: fmtDate(c.lastActivityAt)
				})] })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "documents",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "documents",
							children: [
								"Documents (",
								docs.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "evidence",
							children: [
								"Evidence (",
								exhibits.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "timeline",
							children: [
								"Timeline (",
								custody.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "approvals",
							children: [
								"Approvals (",
								pendingApprovals.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "team",
							children: "Team"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "documents",
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: `Records (${docs.length})`,
						children: docs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No records of this case are visible to your role."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-1.5 pr-3 font-medium",
											children: "Record"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-1.5 pr-3 font-medium",
											children: "Type"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-1.5 pr-3 font-medium",
											children: "Hash"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-1.5 pr-3 font-medium",
											children: "Integrity"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-1.5 pr-3 font-medium",
											children: "Version"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-1.5 pr-3 font-medium",
											children: "Signed"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-1.5 font-medium",
											children: "Updated"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: docs.map((d) => {
									const Icon = typeIcon[d.docType] || FileText;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border/60 last:border-0 hover:bg-muted/50",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-1.5 pr-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
													to: "/documents/$docId",
													params: { docId: d.id },
													className: "flex items-center gap-2 hover:underline",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0 text-muted-foreground" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "truncate",
															children: d.filename
														}),
														d.restricted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestrictedTag, {}),
														d.redactedCopy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestrictedTag, { label: "Redacted copy" })
													]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-1.5 pr-3 text-xs text-muted-foreground",
												children: typeLabel[d.docType] || d.docType
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-1.5 pr-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, { hash: d.sha256Hash })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-1.5 pr-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntegrityBadge, { state: d.integrity })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-1.5 pr-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VersionPill, {
													current: d.version,
													total: d.version
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-1.5 pr-3 text-center",
												children: d.signed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-verified text-xs",
													children: "✓ Signed"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground text-xs",
													children: "—"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "font-mono py-1.5 text-[11px] text-muted-foreground",
												children: fmtDate(d.uploadedAt)
											})
										]
									}, d.id);
								}) })]
							})
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "evidence",
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: `Physical exhibits (${exhibits.length})`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "grid gap-2 md:grid-cols-2",
							children: [exhibits.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-md border border-border p-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/exhibits",
											className: "font-mono text-xs hover:underline",
											children: e.exhibitCode
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: e.status?.replace("_", " ") || e.status
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-sm",
										children: e.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex items-center gap-2 text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, { hash: e.sealHash }),
											" · ",
											e.holder
										]
									})
								]
							}, e.id)), exhibits.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "No exhibits registered."
							})]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "timeline",
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Case timeline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "relative",
							children: custody.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustodyEventRow, {
								event: e,
								last: i === custody.length - 1
							}, e.id))
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "approvals",
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Approvals for this case",
						children: pendingApprovals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No pending approvals for this case."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: pendingApprovals.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-md border border-border p-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [a.severity === "CRITICAL" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mt-0.5 size-3.5 shrink-0 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-medium leading-snug",
												children: a.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-mono mt-0.5 text-[11px] text-muted-foreground",
												children: [
													a.kind,
													" · ",
													fmtDate(a.createdAt)
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground",
												children: [
													"Requested by: ",
													a.requester?.name || "Unknown",
													" (",
													a.approverRole,
													")"
												]
											})
										]
									})]
								})
							}, a.id))
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "team",
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Team & collaborators",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border text-sm",
							children: c.officers?.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [
										o.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, { role: ROLE_MAP[o.role] || "investigating_officer" })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: c.department
								})]
							}, o.id))
						})
					})
				})
			]
		})
	] });
}
//#endregion
export { CaseDetail as component };
