import { n as __toESM } from "../_runtime.mjs";
import { t as ROLES } from "./client-CFyrzEWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
import { S as Landmark, c as ShieldCheck, y as Lock } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BhiWzo7T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [role, setRole] = (0, import_react.useState)("investigating_officer");
	const [serviceBarId, setServiceBarId] = (0, import_react.useState)("");
	const [passphrase, setPassphrase] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const handleRoleChange = (newRole) => {
		setRole(newRole);
		setServiceBarId("");
		setPassphrase("");
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await login(role, serviceBarId, passphrase);
			toast.success(`Signed in as ${ROLES.find((r) => r.id === role)?.label}`);
			navigate({ to: "/dashboard" });
		} catch (error) {
			toast.error(error.message || "Sign in failed");
		} finally {
			setIsLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-6 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-semibold tracking-tight text-white",
						children: "ADALAT360"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-semibold leading-tight text-white",
						children: "Tamper-evident custody for legal and investigation records."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-6 space-y-3 text-sm opacity-80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 size-4 shrink-0 text-accent" }), "Nothing is overwritten — every edit becomes a new, diffable version."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 size-4 shrink-0 text-accent" }), "Search surfaces conflicts and uncertainty instead of one confident answer."]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] opacity-50",
					children: "SIH26190 · Blockchain & Cybersecurity · design prototype"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "w-full max-w-sm",
				onSubmit: handleSubmit,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold tracking-tight",
						children: "Officer sign-in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Access-controlled system. Activity is logged."
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "svc",
							className: "text-xs",
							children: "Service / Bar ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "svc",
							value: serviceBarId,
							onChange: (e) => setServiceBarId(e.target.value),
							className: "font-mono mt-1",
							autoComplete: "off",
							disabled: isLoading
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "pwd",
							className: "text-xs",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "pwd",
							type: "password",
							value: passphrase,
							onChange: (e) => setPassphrase(e.target.value),
							className: "mt-1",
							disabled: isLoading
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Sign in as role (demo)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: role,
								onValueChange: (v) => handleRoleChange(v),
								disabled: isLoading,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: r.id,
									children: r.label
								}, r.id)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-[11px] text-muted-foreground",
								children: ROLES.find((r) => r.id === role).access
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							className: "w-full",
							disabled: isLoading,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }),
								" ",
								isLoading ? "Signing in..." : "Sign in"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-[11px] text-muted-foreground",
							children: "Prototype only — synthetic data, no real case material, no live government integration."
						})
					]
				})]
			})
		})]
	});
}
//#endregion
export { LoginPage as component };
