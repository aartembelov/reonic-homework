import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["./**/__tests__/**/*.spec.ts"],
		environment: "node",
		globals: true,
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html", "lcov"],
			include: ["src/**/*.{ts,js}"],
			exclude: [
				"**/*.spec.ts",
				"**/*.d.ts",
				"node_modules/**",
				"**/__tests__/**",
				"**/test/**",
				"src/**/*.interface.ts",
				"src/**/*.module.ts",
			],
			reportsDirectory: "./coverage",
		},
	},
	plugins: [
		swc.vite({
			tsconfigFile: "./tsconfig.json",
		}),
	],
});
