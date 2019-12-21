const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const templatesDirPath = path.join(__dirname, "..", "templates");
const templates = fs.readdirSync(templatesDirPath);
templates.forEach(dir => {
	console.log(dir);
	if (fs.statSync(path.join(__dirname, "..", "templates", dir)).isDirectory()) {
		execSync(`cd ${path.join(templatesDirPath, dir)} \
			&& ${path.join(__dirname, "..", "node_modules", ".bin", "bestzip")} ../../templates/${dir + ".zip"} ./ \
			&& cd .. \
			&& ${path.join(__dirname, "..", "node_modules", ".bin", "rimraf")} ${path.join(templatesDirPath, dir)}`);
	}
});
