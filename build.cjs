const fs = require("fs");
const lt = String.fromCharCode(60), gt = String.fromCharCode(62), sl = String.fromCharCode(47);
const h = [lt+"!DOCTYPE html"+gt,lt+'html lang="zh-CN"'+gt,lt+"head"+gt,lt+'meta charset="UTF-8"'+gt,lt+'meta name="viewport" content="width=device-width, initial-scale=1.0"'+gt,lt+"title"+gt+"\u6ce1\u9762\u5b87\u5b99"+lt+sl+"title"+gt,lt+'link rel="stylesheet" href="styles.css"'+gt,lt+sl+"head"+gt,lt+"body"+gt,lt+'script src="site.js"'+gt+lt+sl+"script"+gt,lt+sl+"body"+gt,lt+sl+"html"+gt].join("\n");
fs.writeFileSync(__dirname + "/index.html", h, "utf8");
