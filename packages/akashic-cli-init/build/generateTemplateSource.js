const path = require("path");
const fs = require("fs");
const shell = require('shelljs');
const { execSync } = require("child_process");

const templatesBaseDirPath = path.join(__dirname, "..", "templates-src", "base");
const templatesGameDirPath = path.join(__dirname, "..", "templates-src", "game");
const templatesDirPath = path.join(__dirname, "..", "templates");
const gameTemplates = fs.readdirSync(templatesGameDirPath);

// typescriptテンプレートを作成
console.log("Start to generate typescript-templates");
gameTemplates.forEach(dirName => {
	console.log(`"${dirName}" template`);
	const distPath = path.join(templatesDirPath, "typescript-" + dirName);
	shell.rm("-rf", distPath);
	shell.cp("-R", path.join(templatesBaseDirPath, "typescript"), distPath);
	shell.cp("-R", path.join(templatesGameDirPath, dirName, "*"), distPath);
	const packageJson = JSON.parse(fs.readFileSync(path.join(distPath, "package.json")));
	shell.cp(path.join(templatesBaseDirPath, "typescript", "package.json"), distPath); //TODO 2度手間なのでできれば無くしたい処理
	// 追加すべきライブラリが存在する場合はakashic installを実行
	if (packageJson["dependencies"]) {
		execSync(`cd ${distPath} && npm install @akashic/akashic-cli-install`);
		Object.keys(packageJson["dependencies"]).forEach(libName => {
			execSync(`cd ${distPath} && ${path.join(distPath, "node_modules", ".bin", "akashic-cli-install")} ${libName}`);
		});
	}
	shell.rm("-rf", path.join(distPath, "node_modules"));
});
console.log("End to generate typescript-templates");

// typescript以外のテンプレートを作成
// ビルド用のディレクトリ準備
shell.rm("-rf", path.join(templatesDirPath, "common"));
shell.cp("-R", path.join(templatesBaseDirPath, "typescript"), path.join(templatesDirPath, "common"));
// テンプレート生成処理時間の短縮のため、各jsテンプレートビルド時に共通的に使用するパッケージを先にインストールしておく
console.log("Install packages");
execSync(`cd ${path.join(templatesDirPath, "common")} && npm install`);
const bases = fs.readdirSync(templatesBaseDirPath);
bases.forEach(base => {
	if (base === "typescript") {
		return;
	}
	console.log(`Start to generate ${base}-templates`);
	if (fs.existsSync(path.join(templatesBaseDirPath, base, "tsconfig.json"))) {
		shell.cp(path.join(templatesBaseDirPath, base, "tsconfig.json"), path.join(templatesDirPath, "common"));
	} else {
		shell.cp(path.join(templatesBaseDirPath, "typescript", "tsconfig.json"), path.join(templatesDirPath, "common"));
	}
	const tsconfigJson = JSON.parse(fs.readFileSync(path.join(templatesDirPath, "common", "tsconfig.json")));
	gameTemplates.forEach(dirName => {
		console.log(`"${dirName}" template`);
		// このスクリプト実行前にテンプレートが既に作られているならば、それを削除する
		const distPath = path.join(templatesDirPath, `${base}-${dirName}`);
		shell.rm("-rf", distPath);
		// テンプレートを新たに生成
		shell.cp("-R", path.join(templatesBaseDirPath, base), distPath);
		shell.cp("-R", path.join(templatesGameDirPath, dirName, "*"), distPath);
		const packageJson = JSON.parse(fs.readFileSync(path.join(distPath, "package.json")));
		shell.cp(path.join(templatesBaseDirPath, base, "package.json"), distPath); //TODO 2度手間なのでできれば無くしたい処理
		shell.cp("-R", path.join(templatesGameDirPath, dirName, "src"), path.join(templatesDirPath, "common", "src"));
		console.log("  - start to build");
		if (packageJson["dependencies"]) {
			Object.keys(packageJson["dependencies"]).forEach(libName => {
				execSync(`cd ${path.join(templatesDirPath, "common")} && npm install ${libName}`);
			});
		}
		// node_modulesがcommon下にあるので、そこでそのままビルドする
		execSync(`cd ${path.join(templatesDirPath, "common")} && npm run _build`);
		if (packageJson["dependencies"]) {
			Object.keys(packageJson["dependencies"]).forEach(libName => {
				execSync(`cd ${path.join(templatesDirPath, "common")} && npm uninstall ${libName}`);
			});
		}
		console.log("  - end to build");
		// 他のテンプレートもcommon下でビルドするため、ソースファイルディレクトリは削除しておく
		shell.rm("-rf", path.join(templatesDirPath, "common", "src"));
		// common下でビルド済みのためソースファイルディレクトリは不要なので削除
		shell.rm("-rf", path.join(distPath, "src"));
		// common下でビルドしたものをテンプレートに移す
		const buildDirName = path.basename(tsconfigJson["compilerOptions"]["outDir"]);
		shell.mv(path.join(templatesDirPath, "common", buildDirName), path.join(distPath, buildDirName));
		// game.jsonにscriptアセットが登録されていない状態なので、ここで登録する
		execSync(`cd ${distPath} && ${path.join(templatesDirPath, "common", "node_modules", ".bin", "akashic-cli-scan")} asset script`);
		// 追加すべきライブラリが存在する場合はakashic installを実行
		if (packageJson["dependencies"]) {
			Object.keys(packageJson["dependencies"]).forEach(libName => {
				execSync(`cd ${distPath} && ${path.join(templatesDirPath, "common", "node_modules", ".bin", "akashic-cli-install")} ${libName}`);
			});
		}
		shell.rm("-rf", path.join(distPath, "node_modules"));
	});
	console.log(`End to generate ${base}-templates`);
});
shell.rm("-rf", path.join(templatesDirPath, "common"));
