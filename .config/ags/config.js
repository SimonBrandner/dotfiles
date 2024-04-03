const IN_PATH = App.configDir + "/main.ts";
const OUT_PATH = "/tmp/ags/js";

try {
	await Utils.execAsync([
		"bun",
		"build",
		IN_PATH,
		"--outdir",
		OUT_PATH,
		"--external",
		"resource://*",
		"--external",
		"gi://*",
	]);
	await import(`file://${OUT_PATH}/main.js`);
} catch (error) {
	console.error(error);
}
