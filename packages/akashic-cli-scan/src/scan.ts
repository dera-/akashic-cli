import * as cmn from "@akashic/akashic-cli-commons";
import { Configuration } from "./Configuration";

export interface AssetScanDir  {
	/**
	 * AudioAssetを取得するパス。
	 * 省略された場合、 `["audio"]` 。
	 */
	audio?: string[];

	/**
	 * ImageAssetを取得するパス。
	 * 省略された場合、 `["image"]` 。
	 */
	image?: string[];

	/**
	 * ScriptAssetを取得するパス。
	 * 省略された場合、 `["script"]` 。
	 */
	script?: string[];

	/**
	 * TextAssetを取得するパス。
	 * 省略された場合、 `["text"]` 。
	 */
	text?: string[];
}

export interface AssetExtension {
	/**
	 * TextAssetの拡張子。
	 * 省略された場合、全て利用できることを表す `[]` 。
	 */
	text?: string[];
}

export interface ScanAssetParameterObject {
	/**
	 * 更新する対象。
	 * `"image"`, `"audio"`, `"script"`, `"text"`, `"all"` のいずれか。
	 * 省略された場合、 `"all"` 。
	 */
	target?: string;

	/**
	 * 作業ディレクトリ。
	 * 省略された場合、 `process.cwd()` 。
	 */
	cwd?: string;

	/**
	 * コマンドの出力を受け取るロガー。
	 * 省略された場合、akashic-cli-commons の `new ConsoleLogger()` 。
	 */
	logger?: cmn.Logger;

	/**
	 * `globalScripts` に外部モジュールの package.json のパスを含めるかどうか。
	 * 省略された場合、 `false` 。
	 */
	noOmitPackagejson?: boolean;

	/**
	 * アセットIDをアセットのパスから解決するかどうか。
	 * 省略された場合、 `false` 。
	 */
	resolveAssetIdsFromPath?: boolean;

	/**
	 * 各アセットを取得するパス。
	 */
	assetScanDir?: AssetScanDir;

	/**
	 * 各アセットとして扱う拡張子。
	 * 省略された場合、 `[]` 。
	 */
	assetExtension?: AssetExtension;
}

export function _completeScanAssetParameterObject(param: ScanAssetParameterObject): void {
	param.target = param.target || "all";
	param.cwd = param.cwd || process.cwd();
	param.logger = param.logger || new cmn.ConsoleLogger();

	param.resolveAssetIdsFromPath = !!param.resolveAssetIdsFromPath;
	param.assetScanDir = param.assetScanDir || {};
	param.assetScanDir.audio = param.assetScanDir.audio || ["audio"];
	param.assetScanDir.image = param.assetScanDir.image || ["image"];
	param.assetScanDir.script = param.assetScanDir.script || ["script"];
	param.assetScanDir.text = param.assetScanDir.text || ["text"];

	param.assetExtension = param.assetExtension || {};
	param.assetExtension.text = param.assetExtension.text || [];
}

export function promiseScanAsset(param: ScanAssetParameterObject): Promise<void> {
	_completeScanAssetParameterObject(param);

	var restoreDirectory = cmn.Util.chdir(param.cwd);
	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read("./game.json", param.logger))
		.then((content: cmn.GameConfiguration) => {
			var conf = new Configuration({
				content: content,
				logger: param.logger,
				basepath: ".",
				noOmitPackagejson: param.noOmitPackagejson,
				resolveAssetIdsFromPath: param.resolveAssetIdsFromPath
			});
			conf.vacuum(param.assetScanDir, param.assetExtension);
			return new Promise<void>((resolve, reject) => {
				switch (param.target) {
				case "image":
					conf.scanAssetsImage(param.assetScanDir.image);
					break;
				case "audio":
					return conf.scanAssetsAudio(param.assetScanDir.audio).then(resolve, reject);
				case "script":
					conf.scanAssetsScript(param.assetScanDir.script);
					break;
				case "text":
					conf.scanAssetsText(param.assetScanDir.text, param.assetExtension.text);
					break;
				case "all":
					return conf.scanAssets(param.assetScanDir, param.assetExtension).then(resolve, reject);
				default:
					return reject("scan asset " + param.target + ": unknown target " + param.target);
				}
				resolve();
			})
			.then(() => cmn.ConfigurationFile.write(conf.getContent(), "./game.json", param.logger))
			.then(() => param.logger.info("Done!"));
		})
		.then(restoreDirectory)
		.catch((err) => {
			restoreDirectory();
			throw err;
		});
}

export function scanAsset(param: ScanAssetParameterObject, cb: (err: any) => void): void {
	promiseScanAsset(param).then(cb, cb);
}

export interface ScanNodeModulesParameterObject {
	/**
	 * 作業ディレクトリ。
	 * 省略された場合、 `process.cwd()` 。
	 */
	cwd?: string;

	/**
	 * コマンドの出力を受け取るロガー。
	 * 省略された場合、akashic-cli-commons の `new ConsoleLogger()` 。
	 */
	logger?: cmn.Logger;

	/**
	 * エントリポイントスクリプトの内容からスキャンするようにするか否か。
	 * 省略された場合、偽。
	 * 偽である場合、 `npm ls` して得られたモジュール名一覧からスキャンする。
	 */
	fromEntryPoint?: boolean;

	/**
	 * デバッグ用のNPMを受け取る。
	 * 省略された場合、NPMを引き渡さない。
	 */
	debugNpm?: cmn.PromisedNpm;

	/**
	 * `globalScripts` に外部モジュールの package.json のパスを含めるかどうか。
	 * 省略された場合、 `false` 。
	 */
	noOmitPackagejson?: boolean;

	/**
	 * アセットIDをアセットのパスから解決するかどうか。
	 * 省略された場合、 `false` 。
	 * 偽である場合、ファイル名から拡張子を除去した文字列がアセットIDとして利用される。
	 */
	resolveAssetIdsFromPath?: boolean;
}

export function _completeScanNodeModulesParameterObject(param: ScanNodeModulesParameterObject): void {
	param.cwd = param.cwd || process.cwd();
	param.logger = param.logger || new cmn.ConsoleLogger();
	param.fromEntryPoint = param.fromEntryPoint || false;
	param.resolveAssetIdsFromPath = !!param.resolveAssetIdsFromPath;
}

export function promiseScanNodeModules(param: ScanNodeModulesParameterObject): Promise<void> {
	_completeScanNodeModulesParameterObject(param);
	var restoreDirectory = cmn.Util.chdir(param.cwd);
	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read("./game.json", param.logger))
		.then((content: cmn.GameConfiguration) => {
			var conf = new Configuration({
				content: content,
				logger: param.logger,
				basepath: "." ,
				debugNpm: param.debugNpm,
				noOmitPackagejson: !!param.noOmitPackagejson,
				resolveAssetIdsFromPath: !!param.resolveAssetIdsFromPath
			});
			return Promise.resolve()
				.then(() => (param.fromEntryPoint ? conf.scanGlobalScriptsFromEntryPoint() : conf.scanGlobalScripts()))
				.then(() => cmn.ConfigurationFile.write(conf.getContent(), "./game.json", param.logger))
				.then(() => param.logger.info("Done!"));
		})
		.then(restoreDirectory, restoreDirectory);
}

export function scanNodeModules(param: ScanNodeModulesParameterObject, cb: (err: any) => void): void {
	promiseScanNodeModules(param).then(cb, cb);
}
