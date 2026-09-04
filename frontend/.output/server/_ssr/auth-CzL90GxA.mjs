import { n as __toESM } from "../_runtime.mjs";
import { i as authApi, p as setToken, s as clearToken } from "./client-CFyrzEWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CzL90GxA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(null);
var ROLE_MAP = {
	IO: "investigating_officer",
	REC: "records_section",
	FSL: "forensic_analyst",
	PP: "prosecutor",
	CRT: "judge",
	SYS: "system_admin"
};
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [role, setRole] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const restoreSession = async () => {
		if (!localStorage.getItem("adalat360_token")) {
			setIsLoading(false);
			return;
		}
		try {
			const { user: userData } = await authApi.me();
			if (userData) {
				setUser(userData);
				setRole(ROLE_MAP[userData.role] || "investigating_officer");
			} else clearToken();
		} catch {
			clearToken();
		} finally {
			setIsLoading(false);
		}
	};
	const login = async (selectedRole, serviceBarId, passphrase) => {
		console.log("[Auth] Login attempt:", {
			selectedRole,
			serviceBarId,
			passphrase: "***"
		});
		try {
			const { user: userData, token } = await authApi.login(serviceBarId, passphrase, selectedRole);
			console.log("[Auth] Login success:", {
				user: userData,
				token: token?.slice(0, 20)
			});
			setToken(token);
			setUser(userData);
			setRole(selectedRole);
		} catch (error) {
			console.error("[Auth] Login error:", error.message);
			throw error;
		}
	};
	const logout = async () => {
		try {
			await authApi.logout();
		} catch {}
		clearToken();
		setUser(null);
		setRole(null);
	};
	(0, import_react.useEffect)(() => {
		restoreSession();
	}, []);
	const value = {
		user,
		role,
		isLoading,
		login,
		logout,
		restoreSession
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
//#endregion
export { useAuth as n, AuthProvider as t };
