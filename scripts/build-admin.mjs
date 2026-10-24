import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

async function buildAdmin() {
	console.log("⚡ Bundling React admin UI...");
	mkdirSync(resolve(rootDir, "dist/admin"), { recursive: true });

	await build({
		entryPoints: [resolve(rootDir, "src/admin/index.tsx")],
		bundle: true,
		format: "esm",
		target: "es2022",
		outfile: resolve(rootDir, "dist/admin/index.mjs"),
		external: ["react", "react-dom", "react/jsx-runtime"],
		jsx: "automatic",
		sourcemap: true,
	});

	console.log("✔ Built dist/admin/index.mjs");

	// Bundle src/native.ts to dist/native.mjs and dist/index.mjs
	await build({
		entryPoints: [resolve(rootDir, "src/native.ts")],
		bundle: true,
		platform: "node",
		format: "esm",
		target: "es2022",
		outfile: resolve(rootDir, "dist/native.mjs"),
		sourcemap: false,
	});

	const nativeContent = readFileSync(resolve(rootDir, "dist/native.mjs"), "utf-8");
	writeFileSync(resolve(rootDir, "dist/index.mjs"), nativeContent, "utf-8");
	console.log("✔ Compiled dist/native.mjs and dist/index.mjs with public page:fragments hook and publish route");
}

buildAdmin().catch((err) => {
	console.error(err);
	process.exit(1);
});
