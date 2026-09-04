import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-BEQJSY0v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SessionCtx = (0, import_react.createContext)(null);
function SessionProvider({ children }) {
	const auth = useAuth();
	const [roleOverride, setRoleOverride] = (0, import_react.useState)(null);
	const [activeCaseId, setActiveCaseId] = (0, import_react.useState)("CR-2026-0417");
	const role = roleOverride || auth.role || "investigating_officer";
	const signIn = async (selectedRole, serviceBarId, passphrase) => {
		await auth.login(selectedRole, serviceBarId, passphrase);
		setRoleOverride(selectedRole);
	};
	const signOut = () => {
		auth.logout();
		setRoleOverride(null);
	};
	const value = (0, import_react.useMemo)(() => ({
		role,
		name: auth.user?.name || "Unknown",
		signedIn: !!auth.user,
		activeCaseId,
		user: auth.user,
		setRole: setRoleOverride,
		setActiveCaseId,
		signIn,
		signOut,
		restoreSession: auth.restoreSession
	}), [
		role,
		auth.user,
		activeCaseId,
		auth.restoreSession
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionCtx.Provider, {
		value,
		children
	});
}
function useSession() {
	const ctx = (0, import_react.useContext)(SessionCtx);
	if (!ctx) throw new Error("useSession must be used inside SessionProvider");
	return ctx;
}
//#endregion
export { useSession as n, SessionProvider as t };
