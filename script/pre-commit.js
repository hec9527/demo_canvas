const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const indexFile = path.join(rootDir, 'index.html');

/**
 * 函数用于递归遍历目录下的所有 HTML 文件
 * @param {string} dir
 * @returns  {string []}
 */
function traverseDirectory(dir) {
    let arr = [];
    fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arr = arr.concat(traverseDirectory(fullPath));
        } else if (file.endsWith('.html')) {
            arr.push(fullPath);
        }
    });
    return arr;
}

const files = traverseDirectory(rootDir)
    .map((item) => item.replace(rootDir, '.'))
    .filter((f) => f != '/index.html')
    .map((f) => `<li><a href="${f}">${f}</a></li>`)
    .join('\n');

// console.log(files);

let content = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>canvas demos</title>
    </head>
    <body>
        <div style="text-align: center;">
            <span>canvas demos</span>
            <span>Powered by <a href="https://github.com/hec9527">@hec9527</a></span>
        </div>
        <hr/>
        <ol>
           ${files}
        </ol>
    </body>
</html>
`.trim();

if (fs.statSync(indexFile).isFile()) {
    fs.unlinkSync(indexFile);
}

fs.writeFileSync(indexFile, content);
