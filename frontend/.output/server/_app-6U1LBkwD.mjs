import { n as __toESM } from "./_runtime.mjs";
import { f as roleMeta } from "./_ssr/client-CFyrzEWy.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { n as useSession, t as SessionProvider } from "./_ssr/session-BEQJSY0v.mjs";
import { t as cva } from "./_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { a as useCases, t as useApprovals } from "./_ssr/queries-ci5_guFA.mjs";
import { P as EyeOff, S as Landmark, T as Gauge, V as Bell, c as ShieldCheck, d as ScrollText, g as Menu, h as Package, i as Upload, j as FilePenLine, k as FileStack, o as Sparkles, r as UserCog, t as X, u as Search, v as LogOut, x as LayoutGrid } from "./_libs/lucide-react.mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "./_libs/@radix-ui/react-dialog+[...].mjs";
import { c as RoleBadge, r as DemoDataBadge } from "./_ssr/primitives-CP5i6y_b.mjs";
import { t as Button } from "./_ssr/button-Bq5vK6RO.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-Dg1urBTx.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-6U1LBkwD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var ALL = [
	"investigating_officer",
	"records_section",
	"forensic_analyst",
	"prosecutor",
	"judge",
	"system_admin"
];
var NON_ADMIN = ALL.filter((r) => r !== "system_admin");
var NAV = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: Gauge,
		roles: ALL
	},
	{
		to: "/cases",
		label: "Cases",
		icon: FileStack,
		roles: NON_ADMIN
	},
	{
		to: "/intake",
		label: "Intake",
		icon: Upload,
		roles: [
			"investigating_officer",
			"records_section",
			"forensic_analyst"
		]
	},
	{
		to: "/search",
		label: "Conflict-aware Ask",
		icon: Sparkles,
		roles: NON_ADMIN
	},
	{
		to: "/ledger",
		label: "Custody ledger",
		icon: ShieldCheck,
		roles: ALL
	},
	{
		to: "/signatures",
		label: "Sign & approve",
		icon: FilePenLine,
		roles: [
			"investigating_officer",
			"prosecutor",
			"judge",
			"forensic_analyst"
		]
	},
	{
		to: "/certificates",
		label: "BSA §63 certificates",
		icon: ScrollText,
		roles: [
			"investigating_officer",
			"forensic_analyst",
			"prosecutor"
		]
	},
	{
		to: "/exhibits",
		label: "Exhibit register",
		icon: Package,
		roles: [
			"investigating_officer",
			"records_section",
			"forensic_analyst",
			"judge"
		]
	},
	{
		to: "/redaction",
		label: "Redaction",
		icon: EyeOff,
		roles: [
			"records_section",
			"investigating_officer",
			"prosecutor"
		]
	},
	{
		to: "/audit",
		label: "Audit & compliance",
		icon: LayoutGrid,
		roles: ALL
	},
	{
		to: "/inbox",
		label: "Approvals inbox",
		icon: Bell,
		roles: ALL
	},
	{
		to: "/admin",
		label: "Admin panel",
		icon: UserCog,
		roles: ["system_admin"]
	}
];
function SidebarContent({ onNavigate }) {
	const { role, name, signOut } = useSession();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const items = NAV.filter((n) => n.roles.includes(role));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col bg-sidebar text-sidebar-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-b border-sidebar-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold tracking-tight text-white",
						children: "ADALAT360"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest opacity-60",
						children: "Evidence & records"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 overflow-y-auto p-2",
				children: items.map((item) => {
					const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: onNavigate,
						className: cn("mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "opacity-80 hover:bg-sidebar-accent/60 hover:opacity-100"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: item.label
						})]
					}, item.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-sidebar-border p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs font-medium",
						children: name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-[11px] opacity-60",
						children: roleMeta(role).label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							signOut();
							navigate({ to: "/" });
						},
						className: "mt-2 flex items-center gap-1.5 text-[11px] opacity-70 hover:opacity-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3" }), " Sign out"]
					})
				]
			})
		]
	});
}
function AppShell({ children }) {
	const { role, activeCaseId, setActiveCaseId } = useSession();
	const [open, setOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const { data: cases = [] } = useCases(role);
	const { data: approvals = [] } = useApprovals();
	const pending = approvals.filter((a) => a.status === "pending").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "hidden w-60 shrink-0 border-r border-sidebar-border lg:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-0 h-screen",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContent, {})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b border-border bg-surface/95 px-3 py-2 backdrop-blur",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "lg:hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
							side: "left",
							className: "w-64 p-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
								className: "sr-only",
								children: "Navigation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContent, { onNavigate: () => setOpen(false) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: activeCaseId,
						onValueChange: setActiveCaseId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-8 w-[200px] text-xs sm:w-[260px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select case" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [cases.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "none",
							disabled: true,
							children: "No case context for this role"
						}), cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: c.id,
							className: "text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "data-mono",
									children: c.id
								}),
								" — ",
								c.title
							]
						}, c.id))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => navigate({ to: "/search" }),
						className: "hidden min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-ring sm:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3.5" }), "Ask about this case…"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoDataBadge, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/inbox",
								className: "relative rounded-md border border-border p-1.5 transition-colors hover:border-ring",
								"aria-label": "Approvals inbox",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), pending > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -right-1 -top-1 rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground",
									children: pending
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, { role })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "min-w-0 flex-1 p-3 md:p-5",
				children
			})]
		})]
	});
}
function AppLayoutWithSession() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppLayout, {}) });
}
function AppLayout() {
	const { signedIn } = useSession();
	const navigate = useNavigate();
	console.log("[AppLayout] signedIn:", signedIn);
	(0, import_react.useEffect)(() => {
		console.log("[AppLayout] useEffect signedIn:", signedIn);
		if (!signedIn) {
			console.log("[AppLayout] Redirecting to /");
			navigate({
				to: "/",
				replace: true
			});
		}
	}, [signedIn, navigate]);
	if (!signedIn) {
		console.log("[AppLayout] Returning null (not signed in)");
		return null;
	}
	console.log("[AppLayout] Rendering AppShell");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { AppLayoutWithSession as component };
