import { n as __toESM } from "../_runtime.mjs";
import { f as roleMeta } from "./client-CFyrzEWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { B as Check, L as Copy, b as Link2, c as ShieldCheck, l as ShieldAlert, s as ShieldQuestionMark } from "../_libs/lucide-react.mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/primitives-CP5i6y_b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmtDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(date);
}
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
function HashChip({ hash, className }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const short = `${hash.slice(0, 4)}…${hash.slice(-4)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 150,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: (e) => {
					e.stopPropagation();
					navigator.clipboard?.writeText(hash);
					setCopied(true);
					setTimeout(() => setCopied(false), 1200);
				},
				className: cn("data-mono inline-flex items-center gap-1 rounded border border-border bg-secondary px-1.5 py-0.5 text-[11px] text-secondary-foreground transition-colors hover:border-ring", className),
				children: [short, copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-verified" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3 opacity-50" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
			className: "max-w-[22rem]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "data-mono break-all text-[11px]",
				children: hash
			})
		})] })
	});
}
var integrityMap = {
	verified: {
		label: "Verified",
		cls: "border-verified/40 bg-verified/10 text-verified",
		Icon: ShieldCheck
	},
	pending: {
		label: "Pending",
		cls: "border-pending/50 bg-pending/15 text-pending-foreground",
		Icon: ShieldQuestionMark
	},
	mismatch: {
		label: "Mismatch",
		cls: "border-mismatch/40 bg-mismatch/10 text-mismatch",
		Icon: ShieldAlert
	}
};
function IntegrityBadge({ state, className }) {
	const { label, cls, Icon } = integrityMap[String(state).toLowerCase()] || integrityMap.pending;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium", cls, className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" }), label]
	});
}
function RoleBadge({ role, className }) {
	const m = roleMeta(role);
	if (!m) {
		console.warn("[RoleBadge] Unknown role:", role);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("data-mono inline-flex items-center rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground", className),
			children: role
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		title: m.label,
		className: cn("data-mono inline-flex items-center rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground", className),
		children: m.short
	});
}
function RestrictedTag({ label = "Restricted" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center rounded-sm border border-restricted/40 bg-restricted/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-restricted",
		children: label
	});
}
var conflictMap = {
	temporal: {
		label: "Temporal",
		cls: "border-pending/50 bg-pending/15 text-pending-foreground"
	},
	location: {
		label: "Location",
		cls: "border-mismatch/40 bg-mismatch/10 text-mismatch"
	},
	identity: {
		label: "Identity",
		cls: "border-restricted/40 bg-restricted/10 text-restricted"
	},
	witness: {
		label: "Witness",
		cls: "border-pending/50 bg-pending/15 text-pending-foreground"
	},
	superseded: {
		label: "Superseded",
		cls: "border-border bg-muted text-muted-foreground"
	},
	forensic: {
		label: "Forensic",
		cls: "border-verified/40 bg-verified/10 text-verified"
	},
	scope: {
		label: "Scope",
		cls: "border-border bg-muted text-muted-foreground"
	}
};
function ConflictChip({ type }) {
	const c = conflictMap[type];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium", c.cls),
		children: [c.label, " conflict"]
	});
}
function VersionPill({ current, total, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "data-mono rounded border border-border bg-surface px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-ring hover:text-foreground",
		children: [
			"v",
			current,
			" of ",
			total
		]
	});
}
function CustodyEventRow({ event, last }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "chain-link relative pb-4 last:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "chain-node",
				style: event.broken ? { borderColor: "var(--mismatch)" } : void 0,
				"aria-hidden": true
			}),
			!last && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute left-[0.59rem] top-4 bottom-0 w-px",
				style: { background: event.broken ? "var(--mismatch)" : "var(--border)" },
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-x-2 gap-y-1 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium capitalize",
						children: event.action
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "by"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: event.actor }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, { role: event.actorRole }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "data-mono ml-auto text-[11px] text-muted-foreground",
						children: fmtDate(event.timestamp)
					})
				]
			}),
			event.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: event.note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "prev" }),
					event.prevHash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, { hash: event.prevHash }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "data-mono",
						children: "genesis"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→ this" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashChip, { hash: event.hash }),
					event.broken && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-mismatch",
						children: "chain break detected"
					})
				]
			})
		]
	});
}
function SectionCard({ title, action, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-lg border border-border bg-surface", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between gap-2 border-b border-border px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold tracking-tight",
				children: title
			}), action]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-3",
			children
		})]
	});
}
function PageHeader({ title, subtitle, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-semibold tracking-tight",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-sm text-muted-foreground",
			children: subtitle
		})] }), action]
	});
}
function DemoDataBadge() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded border border-dashed border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground",
		children: "Demo data"
	});
}
//#endregion
export { IntegrityBadge as a, RoleBadge as c, fmtDate as d, HashChip as i, SectionCard as l, CustodyEventRow as n, PageHeader as o, DemoDataBadge as r, RestrictedTag as s, ConflictChip as t, VersionPill as u };
