import { n as __toESM } from "../_runtime.mjs";
import { i as performance_default } from "../_libs/h3-v2+rou3+srvx+unenv.mjs";
import { f as roleMeta } from "./client-CFyrzEWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
import { a as useCases, l as useDocuments, n as useAudit, t as useApprovals } from "./queries-ci5_guFA.mjs";
import { E as FolderOpen, a as TriangleAlert, d as ScrollText, j as FilePenLine, l as ShieldAlert } from "../_libs/lucide-react.mjs";
import { a as IntegrityBadge, c as RoleBadge, d as fmtDate, l as SectionCard, o as PageHeader } from "./primitives-CP5i6y_b.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-B4R31Qg6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var statusLabel = {
	OPEN: "Open",
	UNDER_INVESTIGATION: "Under investigation",
	CHARGESHEET_FILED: "Charge sheet filed",
	IN_COURT: "In court",
	CLOSED: "Closed"
};
function Dashboard() {
	const { role, name, user } = useAuth();
	const [activeFilter, setActiveFilter] = (0, import_react.useState)(null);
	const { data: cases = [], isLoading: casesLoading } = useCases(role);
	const { data: approvals = [], isLoading: approvalsLoading } = useApprovals();
	const { data: docs = [], isLoading: docsLoading } = useDocuments();
	const { data: activity = [], isLoading: activityLoading } = useAudit();
	const pendingApprovals = approvals.filter((a) => a.status === "PENDING");
	const alerts = docs.filter((d) => d.integrity === "MISMATCH");
	const pendingCertificates = pendingApprovals.filter((a) => a.resourceType === "CERTIFICATE" || a.kind === "certificate").length;
	const stats = [
		{
			label: "Active cases",
			value: cases.length,
			icon: FolderOpen
		},
		{
			label: "Pending signatures / approvals",
			value: pendingApprovals.filter((a) => a.kind !== "case_update").length,
			icon: FilePenLine
		},
		{
			label: "Integrity alerts",
			value: alerts.length + pendingApprovals.filter((a) => a.kind === "integrity_alert").length,
			icon: ShieldAlert
		},
		{
			label: "Certificates pending",
			value: pendingCertificates,
			icon: ScrollText
		}
	];
	const visibleCases = cases.filter((c) => !activeFilter || c.priorityLabel === activeFilter || c.status === activeFilter || c.department === activeFilter);
	if (casesLoading || approvalsLoading || docsLoading || activityLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center h-64",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `Good day, ${user?.name || name}`,
			subtitle: `${roleMeta(role).label} — ${roleMeta(role).access}`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
			children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "size-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedCounter, { value: s.value })]
			}, s.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				title: "Case list",
				className: "lg:col-span-2",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						visibleCases.length,
						" of ",
						cases.length,
						" cases assigned"
					] }), activeFilter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-primary underline-offset-2 hover:underline",
						onClick: () => setActiveFilter(null),
						children: "Clear filter"
					})]
				}),
				children: cases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "This role has technical/system visibility only — case documents are not exposed here."
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
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1.5 pr-3 font-medium",
									children: "Priority"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1.5 font-medium",
									children: "Last activity"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visibleCases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
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
									className: "font-mono py-1.5 text-[11px] text-muted-foreground",
									children: fmtDate(c.lastActivityAt)
								})
							]
						}, c.id)) })]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				title: "Approvals inbox",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/inbox",
					className: "text-xs text-muted-foreground underline-offset-2 hover:underline",
					children: "Open inbox"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: pendingApprovals.slice(0, 5).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-md border border-border p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2",
							children: [a.severity === "critical" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-3.5 shrink-0 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium leading-snug",
									children: a.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono mt-0.5 text-[11px] text-muted-foreground",
									children: [
										a.caseId,
										" · ",
										fmtDate(a.createdAt)
									]
								})]
							})]
						})
					}, a.id))
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid gap-3 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Case priority distribution",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryBars, {
						items: [
							{
								label: "High",
								value: cases.filter((c) => c.priorityLabel === "HIGH").length,
								color: "bg-destructive",
								filter: "HIGH"
							},
							{
								label: "Medium",
								value: cases.filter((c) => c.priorityLabel === "MEDIUM").length,
								color: "bg-amber-500",
								filter: "MEDIUM"
							},
							{
								label: "Low",
								value: cases.filter((c) => c.priorityLabel === "LOW").length,
								color: "bg-emerald-500",
								filter: "LOW"
							}
						],
						activeFilter,
						onSelect: setActiveFilter
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Case status overview",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryBars, {
						items: Object.entries(statusLabel).map(([status, label]) => ({
							label,
							value: cases.filter((c) => c.status === status).length,
							color: "bg-primary",
							filter: status
						})),
						activeFilter,
						onSelect: setActiveFilter
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Cases by department",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryBars, {
						items: Object.entries(cases.reduce((counts, c) => {
							counts[c.department] = (counts[c.department] || 0) + 1;
							return counts;
						}, {})).map(([department, count]) => ({
							label: department,
							value: count,
							color: "bg-accent",
							filter: department
						})),
						activeFilter,
						onSelect: setActiveFilter
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid gap-3 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				title: "Recent integrity alerts",
				children: alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No hash mismatches on records visible to this role."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: alerts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/documents/$docId",
								params: { docId: d.id },
								className: "truncate text-xs font-medium hover:underline",
								children: d.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: [
									d.caseId,
									" · ",
									d.id
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntegrityBadge, { state: d.integrity })]
					}, d.id))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				title: "Recent activity",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5 text-xs",
					children: activity.slice(0, 10).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-1.5 border-b border-border/60 pb-1.5 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: a.actor?.name || a.actorId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, { role: ROLE_MAP[a.actor?.role] || "investigating_officer" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: a.action.replace("_", " ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: a.resourceId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono ml-auto text-[11px] text-muted-foreground",
								children: fmtDate(a.timestamp)
							})
						]
					}, a.id))
				})
			})]
		})
	] });
}
function SummaryBars({ items, activeFilter, onSelect }) {
	const max = Math.max(...items.map((item) => item.value), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No case data available."
		}) : items.map(({ label, value, color, filter }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			title: `Filter case list by ${label} (${value} case${value === 1 ? "" : "s"})`,
			onClick: () => onSelect(activeFilter === filter ? null : filter),
			className: `block w-full rounded-md p-1 text-left transition-colors hover:bg-muted/70 ${activeFilter === filter ? "bg-muted ring-1 ring-primary/30" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-muted-foreground",
					children: value
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 rounded-full bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `h-2 rounded-full ${color}`,
					style: { width: `${value / max * 100}%` }
				})
			})]
		}, label))
	});
}
function AnimatedCounter({ value }) {
	const [displayValue, setDisplayValue] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let frame = 0;
		const start = performance_default.now();
		const animate = (now) => {
			const progress = Math.min((now - start) / 500, 1);
			setDisplayValue(Math.round(value * progress));
			if (progress < 1) frame = requestAnimationFrame(animate);
		};
		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 font-mono text-3xl font-semibold",
		children: displayValue
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
export { Dashboard as component };
