const fs = require('fs')
const path = require('path')

const dirsToIgnore = ['service-wrapper', 'node_modules', '.mvn', '.idea', '.git'];
const dirsToIgnoreRegex = new RegExp(`(?=${dirsToIgnore.map(dir => `^${dir}$`).join('|')})`);

function discoverRelativeFilesByExtension(relativeSrc, extensions) {
    const realPath = relativeSrc.startsWith('/') ? relativeSrc : path.resolve(relativeSrc);
    return discoverFilesByExtension(realPath, extensions);
}

function discoverFilesByExtension(src, extensions) {
    const extensionsRegex = compileExtensionsRegex(extensions);

    if (fs.existsSync(src)) {
        return discoverFilesByRegex(src, extensionsRegex);
    } else {
        return [];
    }
}

function discoverFilesByRegex(src, regex) {
    let files = [];

    fs.readdirSync(src).forEach(fileOrDir => {
        const fileOrDirPath = path.join(src, fileOrDir);
        const stat = fs.statSync(fileOrDirPath);
        if (stat.isFile()) {
            if (fileOrDir.match(regex)) {
                files.push(fileOrDirPath);
            }
        } else if (stat.isDirectory() && !fileOrDir.match(dirsToIgnoreRegex)) {
            files = files.concat(discoverFilesByRegex(fileOrDirPath, regex));
        }
    });

    return files.sort();
}

function compileExtensionsRegex(extensions) {
    if (!Array.isArray(extensions)) {
        extensions = [extensions];
    }

    const extensionsExp = extensions
        .map(ext => {
            if (!ext.startsWith('.')) {
                ext = `.${ext}`;
            }
            return `\\${ext}$`;
        })
        .join('|');
    return new RegExp(`(?=${extensionsExp})`);
}

module.exports = {
    discoverFilesByExtension,
    discoverRelativeFilesByExtension
};
