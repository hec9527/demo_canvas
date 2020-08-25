/**
 * @author   hec9527
 * @time     2019-12-15
 * @change   2019-12-15
 * @param {callback} callback(file)
 *
 *      文件异步读取机制
 */

class FileClick {
    constructor(callback, elID = 'fileReader') {
        document.getElementById(elID).addEventListener(
            'change',
            e => {
                const file = e.target.files[0];
                const fileReader = new FileReader();
                if (!file) return alert('文件读取出错！');
                fileReader.onload = e => {
                    file.fileData = e.target.result;
                    file.base = FileClick.getFileBase(file.type || undefined);
                    file.computedSize = FileClick.getFileSize(file.size || undefined);
                    callback(file);
                };
                fileReader.readAsDataURL(file);
            },
            false
        );
    }

    static getFileBase(mime) {
        if (mime === undefined) return undefined;
        const fileTypes = {
            'audio/aac': '.aac',
            'video/x-msvideo': '.avi',
            'application/octet-stream': '.bin',
            'image/bmp': '.bmp',
            'application/x-bzip': '.bz',
            'application/x-bzip2': '.bz2',
            'text/css': '.css',
            'text/csv': '.csv',
            'application/msword': '.doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'application/vnd.ms-fontobject': '.eot',
            'image/gif': '.gif',
            'text/html': '.htm',
            'text/html': '.html',
            'image/vnd.microsoft.icon': '.ico',
            'image/jpeg': '.jpeg',
            'image/jpeg': '.jpg',
            'text/javascript': '.js',
            'application/json': '.json',
            'text/javascript': '.mjs',
            'audio/mpeg': '.mp3',
            'video/mpeg': '.mpeg',
            'audio/ogg': '.oga',
            'video/ogg': '.ogv',
            'application/ogg': '.ogx',
            'font/otf': '.otf',
            'image/png': '.png',
            'application/pdf': '.pdf',
            'application/vnd.ms-powerpoint': '.ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
            'application/x-rar-compressed': '.rar',
            'application/rtf': '.rtf',
            'image/svg+xml': '.svg',
            'application/x-shockwave-flash': '.swf',
            'application/x-tar': '.tar',
            'font/ttf': '.ttf',
            'text/plain': '.txt',
            'audio/wav': '.wav',
            'audio/webm': '.weba',
            'video/webm': '.webm',
            'image/webp': '.webp',
            'font/woff': '.woff',
            'font/woff2': '.woff2',
            'application/xhtml+xml': '.xhtml',
            'application/vnd.ms-excel': '.xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
            'application/xml': '.xml',
            'application/vnd.mozilla.xul+xml': '.xul',
            'application/zip': '.zip',
            'video/3gpp': '.3gp',
            'video/3gpp2': '.3g2',
            'application/x-7z-compressed': '.7z'
        };
        return fileTypes[mime];
    }

    static getFileSize(size) {
        size = Number(size);

        if (size < 1024) {
            return size + 'B';
        } else if (size < 1024 * 1024) {
            return Number(size / 1024).toFixed(2) + 'KB';
        } else if (size < Math.pow(1024, 3)) {
            return Number(size / 1024 / 1024).toFixed(2) + 'MG';
        } else if (size < Math.pow(1024, 4)) {
            return Number(size / 1024 / 1024 / 1024).toFixed(2) + 'GB';
        } else {
            return size + 'B';
        }
    }
}
