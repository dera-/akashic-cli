import * as fs from "fs";
import * as path from "path";
import * as commander from "commander";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import { promiseScanAsset, promiseScanNodeModules } from "./scan";

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

commander
	.description("Update various properties of game.json")
	.version(ver);

commander
	.command("asset [target]")
	.description("Update 'assets' property of game.json")
	.option("-C, --cwd <dir>", "The directory incluedes game.json")
	.option("-q, --quiet", "Suppress output")
	.option("--use-path-asset-id", "Resolve Asset IDs from these path instead of name")
	.option("--update-asset-id", "Update previously registered Asset IDs")
	.option(
		"--include-ext-to-asset-id",
		"Include file extensions to the Asset IDs (if specify `--use-path-asset-id` option, default value is true, otherwise false)"
	)
	.option("--image-asset-dir <dir>", "specify ImageAsset directory", commanderArgsCoordinater)
	.option("--audio-asset-dir <dir>", "specify AudioAsset directory", commanderArgsCoordinater)
	.option("--script-asset-dir <dir>", "specify ScriptAsset directory", commanderArgsCoordinater)
	.option("--text-asset-dir <dir>", "specify TextAsset directory", commanderArgsCoordinater)
	.option("--text-asset-extension <extension>", "specify TextAsset extension", commanderArgsCoordinater)
	.action((target: string, opts: any = {}) => {
		var logger = new ConsoleLogger({ quiet: opts.quiet });
		var assetScanDirectoryTable = {
			audio: opts.audioAssetDir,
			image: opts.imageAssetDir,
			script: opts.scriptAssetDir,
			text: opts.textAssetDir
		};
		var assetExtension = {
			text: opts.textAssetExtension
		};
		promiseScanAsset({
			target: target,
			cwd: opts.cwd,
			logger: logger,
			resolveAssetIdsFromPath: opts.usePathAssetId,
			forceUpdateAssetIds: opts.updateAssetId,
			includeExtensionToAssetId: opts.usePathAssetId || opts.includeExtensionToAssetId,
			assetScanDirectoryTable: assetScanDirectoryTable,
			assetExtension: assetExtension
		})
			.catch((err: any) => {
				logger.error(err);
				process.exit(1);
			});
	})
	.on("--help", () => {
		console.log("  Target:");
		console.log("");
		console.log("    image");
		console.log("    audio");
		console.log("    script");
		console.log("    text");
		console.log("    all");
		console.log("");
	});

commander
	.command("globalScripts")
	.description("Update 'globalScripts' property of game.json")
	.option("-C, --cwd <dir>", "The directory incluedes game.json")
	.option("-e, --from-entry-point", "Scan from the entrypoint instead of `npm ls`")
	.option("-q, --quiet", "Suppress output")
	.option("--no-omit-packagejson", "Add package.json of each module to the globalScripts property (to support older Akashic Engine)")
	.action((opts: any = {}) => {
		var logger = new ConsoleLogger({ quiet: opts.quiet });
		promiseScanNodeModules({ cwd: opts.cwd, logger: logger, fromEntryPoint: opts.fromEntryPoint, noOmitPackagejson: !opts.omitPackagejson })
			.catch((err: any) => {
				logger.error(err);
				process.exit(1);
			});
	});

export function run(argv: string[]): void {
	commander.parse(argv);
	if (argv.length < 3
		|| !argv[2].match(/^(asset|globalScripts)$/)) {
		commander.help();
	}
}

function commanderArgsCoordinater (val: any, ret: any) {
	ret = ret || [];
	ret.push(val);
	return ret;
}
