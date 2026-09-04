import { n as __toESM } from "../_runtime.mjs";
import { d as ragApi } from "./client-CFyrzEWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useAuth } from "./auth-CzL90GxA.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as TriangleAlert, u as Search } from "../_libs/lucide-react.mjs";
import { l as SectionCard, o as PageHeader, t as ConflictChip } from "./primitives-CP5i6y_b.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-DVS3Gjfd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const { role } = useAuth();
	const queryClient = useQueryClient();
	const [question, setQuestion] = (0, import_react.useState)("");
	const [answer, setAnswer] = (0, import_react.useState)(null);
	const [conflicts, setConflicts] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const askMutation = useMutation({
		mutationFn: async (q) => ragApi.ask(caseId, q),
		onSuccess: (data) => {
			setAnswer(typeof data.answer === "string" ? data.answer : data.answer.answer);
			if (data.conflictsDetected > 0) setConflicts(["conflict-1", "conflict-2"]);
			setIsLoading(false);
		},
		onError: (error) => {
			toast.error(error.message || "Search failed");
			setIsLoading(false);
		}
	});
	const caseId = queryClient.getQueryData(["caseId"]) || "CR-2026-0417";
	const handleAsk = (e) => {
		e.preventDefault();
		if (!question.trim()) return;
		setIsLoading(true);
		askMutation.mutate(question);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Conflict-aware Ask",
		subtitle: "Ask questions about the case — conflicts and uncertainty will be highlighted"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleAsk,
			className: "space-y-4 max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Your question"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: question,
				onChange: (e) => setQuestion(e.target.value),
				placeholder: "e.g., What time was the witness seen at Central Mall?",
				className: "mt-1 min-h-[100px]",
				disabled: isLoading
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled: isLoading || !question.trim(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }),
					" ",
					isLoading ? "Searching..." : "Ask"
				]
			})]
		}),
		answer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-medium",
				children: "Answer"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "prose prose-sm max-w-none bg-muted/50 rounded-lg p-4",
				children: answer.split("\n").map((para, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: para }, i))
			})]
		}),
		conflicts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "text-sm font-medium text-destructive flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }), " Conflicts Detected"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-1.5",
				children: conflicts.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConflictChip, { type: c }, i))
			})]
		})
	] })] });
}
//#endregion
export { SearchPage as component };
